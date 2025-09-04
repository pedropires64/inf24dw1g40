import {get, post, put, patch, del, requestBody, param} from '@loopback/rest';
import {pool} from '../db';

export class UsersController {
  @get('/users')
  async list(@param.query.string('q') q?: string, @param.query.number('page') page: number = 1, @param.query.number('limit') limit: number = 50) {
    const offset = (page-1)*limit;
    const like = `%${q ?? ''}%`;
    const [rows] = await pool.query('SELECT *, id_user AS id FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY id_user DESC LIMIT ? OFFSET ?', [like, like, limit, offset]);
    return rows;
  }
  @post('/users')
  async create(@requestBody() body: any) {
    if (!body?.name || !body?.email) return {status:400, message:'name and email are required'};
    const [r]: any = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [body.name, body.email]);
    const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user = ?', [r.insertId]);
    return rows[0];
  }
  @get('/users/{id}')
  async getById(@param.path.number('id') id: number) {
    const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user = ?', [id]);
    return rows[0] || null;
  }
  @put('/users/{id}')
  async replace(@param.path.number('id') id: number, @requestBody() body: any) {
    await pool.query('UPDATE users SET name=?, email=? WHERE id_user=?', [body.name, body.email, id]);
    const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user = ?', [id]);
    return rows[0] || null;
  }
  @patch('/users/{id}')
  async update(@param.path.number('id') id: number, @requestBody() body: any) {
    const fields: string[] = []; const values: any[] = [];
    for (const k of ['name','email']) if (body[k]!==undefined) { fields.push(`${k}=?`); values.push(body[k]); }
    if (!fields.length) return {status:400, message:'no fields'};
    values.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id_user=?`, values);
    const [rows]: any = await pool.query('SELECT *, id_user AS id FROM users WHERE id_user = ?', [id]);
    return rows[0] || null;
  }
  @del('/users/{id}')
  async remove(@param.path.number('id') id: number) {
    await pool.query('DELETE FROM users WHERE id_user = ?', [id]);
  }
}
