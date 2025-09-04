import {get, post, put, patch, del, requestBody, param} from '@loopback/rest';
import {pool} from '../db';

export class VenuesController {
  @get('/venues')
  async list(@param.query.string('q') q?: string, @param.query.string('city') city?: string, @param.query.number('page') page: number = 1, @param.query.number('limit') limit: number = 50) {
    const offset = (page-1)*limit;
    const like = `%${q ?? ''}%`; const likeCity = `%${city ?? ''}%`;
    const [rows] = await pool.query('SELECT *, id_venue AS id FROM venues WHERE (name LIKE ? OR city LIKE ?) AND city LIKE ? ORDER BY id_venue DESC LIMIT ? OFFSET ?', [like, like, likeCity, limit, offset]);
    return rows;
  }
  @post('/venues')
  async create(@requestBody() body: any) {
    const [r]: any = await pool.query('INSERT INTO venues (name, city, capacity) VALUES (?, ?, ?)', [body.name, body.city, body.capacity||null]);
    const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues WHERE id_venue = ?', [r.insertId]);
    return rows[0];
  }
  @get('/venues/{id}')
  async getById(@param.path.number('id') id: number) {
    const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues WHERE id_venue = ?', [id]);
    return rows[0] || null;
  }
  @put('/venues/{id}')
  async replace(@param.path.number('id') id: number, @requestBody() body: any) {
    await pool.query('UPDATE venues SET name=?, city=?, capacity=? WHERE id_venue=?', [body.name, body.city, body.capacity||null, id]);
    const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues WHERE id_venue = ?', [id]);
    return rows[0] || null;
  }
  @patch('/venues/{id}')
  async update(@param.path.number('id') id: number, @requestBody() body: any) {
    const fields: string[] = []; const values: any[] = [];
    for (const k of ['name','city','capacity']) if (body[k]!==undefined) { fields.push(`${k}=?`); values.push(body[k]); }
    if (!fields.length) return {status:400, message:'no fields'};
    values.push(id);
    await pool.query(`UPDATE venues SET ${fields.join(', ')} WHERE id_venue=?`, values);
    const [rows]: any = await pool.query('SELECT *, id_venue AS id FROM venues WHERE id_venue = ?', [id]);
    return rows[0] || null;
  }
  @del('/venues/{id}')
  async remove(@param.path.number('id') id: number) {
    await pool.query('DELETE FROM venues WHERE id_venue = ?', [id]);
  }
  @get('/venues/{id}/events')
  async listEvents(@param.path.number('id') id: number) {
    const [rows] = await pool.query('SELECT *, id_event AS id FROM events WHERE id_venue = ? ORDER BY date DESC', [id]);
    return rows;
  }
}
