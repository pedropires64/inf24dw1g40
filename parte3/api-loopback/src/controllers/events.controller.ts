import {get, post, put, patch, del, requestBody, param} from '@loopback/rest';
import {pool} from '../db';

export class EventsController {
  @get('/events')
  async list(
    @param.query.string('q') q?: string,
    @param.query.string('status') status?: string,
    @param.query.number('venueId') venueId?: number,
    @param.query.string('dateFrom') dateFrom?: string,
    @param.query.string('dateTo') dateTo?: string,
    @param.query.number('page') page: number = 1,
    @param.query.number('limit') limit: number = 50
  ) {
    const offset = (page-1)*limit;
    const like = `%${q ?? ''}%`; const likeStatus = `%${status ?? ''}%`;
    let sql = 'SELECT *, id_event AS id FROM events WHERE (name LIKE ? OR description LIKE ?) AND status LIKE ?';
    const params: any[] = [like, like, likeStatus];
    if (venueId) { sql += ' AND id_venue = ?'; params.push(venueId); }
    if (dateFrom) { sql += ' AND date >= ?'; params.push(dateFrom); }
    if (dateTo) { sql += ' AND date <= ?'; params.push(dateTo); }
    sql += ' ORDER BY date DESC LIMIT ? OFFSET ?'; params.push(limit, offset);
    const [rows] = await pool.query(sql, params);
    return rows;
  }
  @post('/events')
  async create(@requestBody() body: any) {
    const [r]: any = await pool.query('INSERT INTO events (id_venue, name, date, status, description) VALUES (?,?,?,?,?)',
      [body.id_venue, body.name, body.date, body.status||'draft', body.description||null]);
    const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_event = ?', [r.insertId]);
    return rows[0];
  }
  @get('/events/{id}')
  async getById(@param.path.number('id') id: number) {
    const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_event = ?', [id]);
    return rows[0] || null;
  }
  @put('/events/{id}')
  async replace(@param.path.number('id') id: number, @requestBody() body: any) {
    await pool.query('UPDATE events SET id_venue=?, name=?, date=?, status=?, description=? WHERE id_event=?',
      [body.id_venue, body.name, body.date, body.status, body.description, id]);
    const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_event = ?', [id]);
    return rows[0] || null;
  }
  @patch('/events/{id}')
  async update(@param.path.number('id') id: number, @requestBody() body: any) {
    const fields: string[] = []; const values: any[] = [];
    for (const k of ['id_venue','name','date','status','description']) if (body[k]!==undefined) { fields.push(`${k}=?`); values.push(body[k]); }
    if (!fields.length) return {status:400, message:'no fields'};
    values.push(id);
    await pool.query(`UPDATE events SET ${fields.join(', ')} WHERE id_event=?`, values);
    const [rows]: any = await pool.query('SELECT *, id_event AS id FROM events WHERE id_event = ?', [id]);
    return rows[0] || null;
  }
  @del('/events/{id}')
  async remove(@param.path.number('id') id: number) {
    await pool.query('DELETE FROM events WHERE id_event = ?', [id]);
  }
  @get('/events/{id}/tickets')
  async listTickets(@param.path.number('id') id: number) {
    const [rows] = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_event = ? ORDER BY price ASC', [id]);
    return rows;
  }
}
