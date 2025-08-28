import * as mysql from 'mysql2/promise';

const {
  DB_HOST='localhost', DB_PORT='3306', DB_USER='root', DB_PASS='12345678', DB_NAME='eventosdb'
} = process.env as Record<string,string>;

export const pool = mysql.createPool({
  host: DB_HOST,
  port: +DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
