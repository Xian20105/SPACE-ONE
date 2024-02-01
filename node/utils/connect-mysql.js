import mysql from 'mysql2/promise.js'

import 'dotenv/config.js' // 用來讀.env

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

const db = await mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 99,
  queueLimit: 0,
})

export default db
