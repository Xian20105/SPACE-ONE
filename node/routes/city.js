import express from 'express'
import db from '##/utils/connect-mysql.js'

const router = express.Router()

router.use((req, res, next) => {
  const u = req.url.split('?')[0] //純路徑
  console.log({ u })
  if (req.method === 'GET' && u === '/') {
    return next()
  }
  next()
})

const getListData = async (req) => {
  let rows = []

  let output = {
    success: false,
    rows,
    redirect: '',
    info: '',
  }

  const sql = `SELECT * FROM city `
  ;[rows] = await db.query(sql)
  output = { ...output, success: true, rows }
  return output
}

router.get('/api', async (req, res) => {
  res.json(await getListData(req))
})

router.get('/area/api', async (req, res) => {
  const sql = `SELECT * FROM area JOIN city ON area.city_id = city.city_id`
  const [rows] = await db.query(sql)
  if (!rows.length) {
    return res.json({ success: false })
  }
  res.json({ success: true, rows })
})

export default router
