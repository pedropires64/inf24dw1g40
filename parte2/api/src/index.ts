import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import {pool} from './db';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Swagger (design-first)
const openapiPath = path.join(__dirname, '../openapi.yaml');
const swaggerDocument = YAML.load(openapiPath);
app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const listHeaders = (res: any, resource: string, total: number) => {
  res.setHeader('Content-Range', `${resource} 0-${Math.max(total-1,0)}/${total}`);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
};

// Helpers
const ok = (res: any, data: any) => res.json(data);
const created = (res: any, data: any) => res.json(data);
const noContent = (res: any) => res.status(204).send();

// ---- USERS ----
app.get('/users', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users ORDER BY id_user DESC');
  listHeaders(res, 'users', rows.length);
  ok(res, rows);
});
app.post('/users', async (req, res) => {
  const {name, email} = req.body||{};
  if (!name || !email) return res.status(400).json({error:'name and email are required'});
  try {
    const [r]: any = await pool.query('INSERT INTO users (name, email) VALUES (?,?)', [name, email]);
    const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user=?', [r.insertId]);
    created(res, rows[0]);
  } catch (e:any) {
    return res.status(400).json({error: e?.message || 'insert error'});
  }
});
app.get('/users/:id', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'User not found'});
  ok(res, rows[0]);
});
app.patch('/users/:id', async (req, res) => {
  const updates: string[] = []; const values:any[] = [];
  for (const k of ['name','email']) if (req.body[k]!==undefined){ updates.push(`${k}=?`); values.push(req.body[k]); }
  if (!updates.length) return res.status(400).json({error:'no fields'});
  values.push(req.params.id);
  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id_user=?`, values);
  const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'User not found'});
  ok(res, rows[0]);
});
app.put('/users/:id', async (req, res) => {
  const {name, email} = req.body||{};
  if (!name || !email) return res.status(400).json({error:'name and email are required'});
  await pool.query('UPDATE users SET name=?, email=? WHERE id_user=?', [name, email, req.params.id]);
  const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'User not found'});
  ok(res, rows[0]);
});
app.delete('/users/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id_user=?', [req.params.id]);
  noContent(res);
});

// ---- VENUES ----
app.get('/venues', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues ORDER BY id_venue DESC');
  listHeaders(res, 'venues', rows.length);
  ok(res, rows);
});
app.post('/venues', async (req, res) => {
  const {name, city, capacity} = req.body||{};
  if (!name || !city) return res.status(400).json({error:'name and city are required'});
  const [r]: any = await pool.query('INSERT INTO venues (name, city, capacity) VALUES (?,?,?)', [name, city, capacity||null]);
  const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues WHERE id_venue=?', [r.insertId]);
  created(res, rows[0]);
});
app.get('/venues/:id', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues WHERE id_venue=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Venue not found'});
  ok(res, rows[0]);
});
app.patch('/venues/:id', async (req, res) => {
  const updates: string[] = []; const values:any[] = [];
  for (const k of ['name','city','capacity']) if (req.body[k]!==undefined){ updates.push(`${k}=?`); values.push(req.body[k]); }
  if (!updates.length) return res.status(400).json({error:'no fields'});
  values.push(req.params.id);
  await pool.query(`UPDATE venues SET ${updates.join(', ')} WHERE id_venue=?`, values);
  const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues WHERE id_venue=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Venue not found'});
  ok(res, rows[0]);
});
app.delete('/venues/:id', async (req, res) => {
  await pool.query('DELETE FROM venues WHERE id_venue=?', [req.params.id]);
  noContent(res);
});
app.get('/venues/:id/events', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_venue=? ORDER BY date DESC', [req.params.id]);
  listHeaders(res, 'events', rows.length);
  ok(res, rows);
});

// ---- EVENTS ----
app.get('/events', async (req, res) => {
  const {q='', status='', venueId, dateFrom, dateTo} = req.query as any;
  let sql = 'SELECT *, id_event AS id FROM events WHERE (name LIKE ? OR description LIKE ?) AND status LIKE ?';
  const params:any[] = [`%${q||''}%`, `%${q||''}%`, `%${status||''}%`];
  if (venueId) { sql += ' AND id_venue=?'; params.push(venueId); }
  if (dateFrom) { sql += ' AND date >= ?'; params.push(dateFrom); }
  if (dateTo) { sql += ' AND date <= ?'; params.push(dateTo); }
  sql += ' ORDER BY date DESC';
  const [rows]: any = await pool.query(sql, params);
  listHeaders(res, 'events', rows.length);
  ok(res, rows);
});
app.post('/events', async (req, res) => {
  const {id_venue, name, date, status, description} = req.body||{};
  if (!id_venue || !name || !date) return res.status(400).json({error:'id_venue, name and date are required'});
  // FK check
  const [v]: any = await pool.query('SELECT id_venue FROM venues WHERE id_venue=?', [id_venue]);
  if (!v[0]) return res.status(404).json({error:'Venue not found'});
  const [r]: any = await pool.query('INSERT INTO events (id_venue, name, date, status, description) VALUES (?,?,?,?,?)',
    [id_venue, name, date, status||'draft', description||null]);
  const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_event=?', [r.insertId]);
  created(res, rows[0]);
});
app.get('/events/:id', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_event=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Event not found'});
  ok(res, rows[0]);
});
app.patch('/events/:id', async (req, res) => {
  const allowed = ['id_venue','name','date','status','description'];
  const updates: string[] = []; const values:any[] = [];
  for (const k of allowed) if (req.body[k]!==undefined){ updates.push(`${k}=?`); values.push(req.body[k]); }
  if (!updates.length) return res.status(400).json({error:'no fields'});
  values.push(req.params.id);
  await pool.query(`UPDATE events SET ${updates.join(', ')} WHERE id_event=?`, values);
  const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_event=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Event not found'});
  ok(res, rows[0]);
});
app.delete('/events/:id', async (req, res) => {
  await pool.query('DELETE FROM events WHERE id_event=?', [req.params.id]);
  noContent(res);
});
app.get('/events/:id/tickets', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_event=? ORDER BY price ASC', [req.params.id]);
  listHeaders(res, 'tickets', rows.length);
  ok(res, rows);
});

// ---- TICKETS ----
app.get('/tickets', async (req, res) => {
  const {eventId, status=''} = req.query as any;
  let sql = 'SELECT *, id_ticket AS id FROM tickets WHERE status LIKE ?';
  const params:any[] = [`%${status||''}%`];
  if (eventId) { sql += ' AND id_event=?'; params.push(eventId); }
  sql += ' ORDER BY id_ticket DESC';
  const [rows]: any = await pool.query(sql, params);
  listHeaders(res, 'tickets', rows.length);
  ok(res, rows);
});
app.post('/tickets', async (req, res) => {
  const {id_event, type, price, status} = req.body||{};
  if (!id_event || !type || price===undefined) return res.status(400).json({error:'id_event, type and price are required'});
  // FK check
  const [e]: any = await pool.query('SELECT id_event FROM events WHERE id_event=?', [id_event]);
  if (!e[0]) return res.status(404).json({error:'Event not found'});
  const [r]: any = await pool.query('INSERT INTO tickets (id_event, type, price, status) VALUES (?,?,?,?)',
    [id_event, type, price, status||'available']);
  const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_ticket=?', [r.insertId]);
  created(res, rows[0]);
});
app.get('/tickets/:id', async (req, res) => {
  const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_ticket=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Ticket not found'});
  ok(res, rows[0]);
});
app.patch('/tickets/:id', async (req, res) => {
  const allowed = ['id_event','type','price','status'];
  const updates: string[] = []; const values:any[] = [];
  for (const k of allowed) if (req.body[k]!==undefined){ updates.push(`${k}=?`); values.push(req.body[k]); }
  if (!updates.length) return res.status(400).json({error:'no fields'});
  values.push(req.params.id);
  await pool.query(`UPDATE tickets SET ${updates.join(', ')} WHERE id_ticket=?`, values);
  const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_ticket=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({error:'Ticket not found'});
  ok(res, rows[0]);
});
app.delete('/tickets/:id', async (req, res) => {
  await pool.query('DELETE FROM tickets WHERE id_ticket=?', [req.params.id]);
  noContent(res);
});

const port = +(process.env.PORT||3000);
app.listen(port, () => console.log('Parte 2 API on http://localhost:'+port+' (Explorer: /explorer)'));
