import {get, post, put, patch, del, requestBody, param} from '@loopback/rest';
import {pool} from '../db';

export class TicketsController {
  @get('/tickets')
  async list(@param.query.number('eventId') eventId?: number, @param.query.string('status') status?: string, @param.query.number('page') page: number = 1, @param.query.number('limit') limit: number = 50) {
    const offset = (page-1)*limit;
    const likeStatus = `%${status ?? ''}%`;
    let sql = 'SELECT *, id_ticket AS id FROM tickets WHERE status LIKE ?';
    const params: any[] = [likeStatus];
    if (eventId) { sql += ' AND id_event = ?'; params.push(eventId); }
    sql += ' ORDER BY id_ticket DESC LIMIT ? OFFSET ?'; params.push(limit, offset);
    const [rows] = await pool.query(sql, params);
    return rows;
  }
  @post('/tickets')
  async create(@requestBody() body: any) {
    const [r]: any = await pool.query('INSERT INTO tickets (id_event, type, price, status) VALUES (?,?,?,?)', [body.id_event, body.type, body.price, body.status||'available']);
    const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_ticket = ?', [r.insertId]);
    return rows[0];
  }
  @get('/tickets/{id}')
  async getById(@param.path.number('id') id: number) {
    const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_ticket = ?', [id]);
    return rows[0] || null;
  }
  @put('/tickets/{id}')
  async replace(@param.path.number('id') id: number, @requestBody() body: any) {
    await pool.query('UPDATE tickets SET id_event=?, type=?, price=?, status=? WHERE id_ticket=?', [body.id_event, body.type, body.price, body.status, id]);
    const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_ticket = ?', [id]);
    return rows[0] || null;
  }
  @patch('/tickets/{id}')
  async update(@param.path.number('id') id: number, @requestBody() body: any) {
    const fields: string[] = []; const values: any[] = [];
    for (const k of ['id_event','type','price','status']) if (body[k]!==undefined) { fields.push(`${k}=?`); values.push(body[k]); }
    if (!fields.length) return {status:400, message:'no fields'};
    values.push(id);
    await pool.query(`UPDATE tickets SET ${fields.join(', ')} WHERE id_ticket=?`, values);
    const [rows]: any = await pool.query('SELECT *, id_ticket AS id FROM tickets WHERE id_ticket = ?', [id]);
    return rows[0] || null;
  }
  @del('/tickets/{id}')
  async remove(@param.path.number('id') id: number) {
    await pool.query('DELETE FROM tickets WHERE id_ticket = ?', [id]);
  }
}
