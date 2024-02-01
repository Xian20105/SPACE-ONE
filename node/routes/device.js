import express from 'express'
import db from '##/utils/connect-mysql.js'
// import db from '#configs/db.js'
import upload from '../utils/upload-imgs.js'
import dayjs from 'dayjs'

const router = express.Router()

router.use((req, res, next) => {
  const u = req.url.split('?')[0] //純路徑
  console.log({ u })
  if (req.method === 'GET' && u === '/') {
    return next()
  }

  // if (!req.session.admin) {
  //   return res.redirect("/login");
  // }
  next()
})

const getListData = async (req) => {
  const perPage = 20
  let page = +req.query.page || 1

  let keyword =
    req.query.keyword && typeof req.query.keyword === 'string'
      ? req.query.keyword.trim()
      : ''
  let keyword_ = db.escape(`%${keyword}%`) //跳脫

  let qs = {}

  let startDate = req.query.startDate ? req.query.startDate.trim() : ''
  const startDateD = dayjs(startDate)
  if (startDateD.isValid()) {
    startDate = startDateD.format('YYYY-MM-DD')
  } else {
    startDate = ''
  }

  let endDate = req.query.ednDate ? req.query.endDate.trim() : ''
  const endDateD = dayjs(endDate)
  if (endDateD.isValid()) {
    endDate = endDateD.format('YYYY-MM-DD')
  } else {
    endDate = ''
  }

  let where = ` WHERE 1 `
  if (keyword) {
    qs.keyword = keyword
    where += ` AND ( \`device_name\` LIKE ${keyword_} OR \`model\` LIKE ${keyword_} ) `
  }
  if (startDate) {
    qs.startDate = startDate
    where += ` AND purchase_date >= '${startDate}' `
  }
  if (endDate) {
    qs.endDate = endDate
    where += ` AND purchase_date <= '${endDate}' `
  }

  let totalRows = 0
  let totalPages = 0
  let rows = []

  let output = {
    success: false,
    page,
    perPage,
    rows,
    totalRows,
    totalPages,
    qs,

    redirect: '',
    info: '',
  }

  if (page < 1) {
    output.redirect = `?page=1`
    output.info = `頁碼值小於 1`
    return output
  }

  const t_sql = `SELECT COUNT(1) totalRows FROM device ${where}`
  ;[[{ totalRows }]] = await db.query(t_sql)
  totalPages = Math.ceil(totalRows / perPage)
  if (totalRows > 0) {
    if (page > totalPages) {
      output.redirect = `?page=${totalPages}`
      output.info = `頁碼值大於總頁數`
      return { ...output, totalRows, totalPages }
    }

    const sql = `SELECT * FROM device ${where} ORDER BY device_id LIMIT ${
      (page - 1) * perPage
    }, ${perPage}`
    ;[rows] = await db.query(sql)
    output = { ...output, success: true, rows, totalRows, totalPages }
  }
  return output
}

router.get('/api', async (req, res) => {
  res.json(await getListData(req))
  // if(res.locals.jwt?.member_id){
  //   return res.json(await getListData(req));
  // } else {
  //   return res.json({success: false, error: "沒有授權, 不能取得資料"});
  // }
})

router.get('/add', async (req, res) => {
  res.render('device/device-add')
})

router.post('/add', upload.none(), async (req, res) => {
  // router.post("/add", async (req, res) => {

  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  // const [result] = await db.query(sql, [device_name, model, device_intro, purchase_date, basic_fee, time_rate, day_rate]);

  const {
    device_id,
    device_name,
    model,
    device_intro,
    purchase_date,
    basic_fee,
    time_rate,
    day_rate,
  } = req.body
  const sql =
    'INSERT INTO `device` (`device_id`, `device_name`, `model`, `device_intro`, `purchase_date`, `basic_fee`, `time_rate`, `day_rate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

  try {
    const [result] = await db.query(sql, [
      device_id,
      device_name,
      model,
      device_intro,
      purchase_date,
      basic_fee,
      time_rate,
      day_rate,
    ])
    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    output.exception = ex
  }

  // 一次全部寫入, 但是不能多或少
  // const sql = "INSERT INTO `address_book` SET ?";
  // req.body.created_at = new Date();
  // const [result] = await db.query(sql, [req.body]);
  res.json(output)
})

router.get('/edit/:device_id', async (req, res) => {
  const device_id = req.params.device_id
  res.locals.title = '編輯｜' + res.locals.title
  const sql = ` SELECT * FROM device WHERE device_id= ?`
  const [rows] = await db.query(sql, [device_id])
  if (!rows.length) {
    return res.redirect(req.baseUrl)
  }
  const row = rows[0]
  row.purchase_date = dayjs(row.purchase_date).format('YYYY-MM-DD')
  res.render('device/device-edit', row)
})

router.put('/edit/:device_id', async (req, res) => {
  const output = {
    success: false,
    postData: req.body,
    result: null,
  }
  const sql = `UPDATE device SET ? WHERE device_id=?`
  const [result] = await db.query(sql, [req.body, req.body.device_id])
  output.result = result
  output.success = !!result.changedRows
  res.json(output)
})

router.get('/api/edit/:device_id', async (req, res) => {
  const device_id = +req.params.device_id
  const sql = `SELECT * FROM device WHERE device_id=?`
  const [rows] = await db.query(sql, [device_id])
  if (!rows.length) {
    return res.json({ success: false })
  }
  const row = rows[0]
  row.purchase_date = dayjs(row.purchase_date).format('YYYY-MM-DD')
  res.json({ success: true, row })
})

router.delete('/:device_id', async (req, res) => {
  const output = {
    success: false,
    result: null,
  }
  const device_id = +req.params.device_id
  // if (!device_id || device_id < 1) {
  //   return res.json(output);
  // }
  const sql = ` DELETE FROM device WHERE device_id='${device_id}'`
  const [result] = await db.query(sql)
  output.result = result
  output.success = !!result.affectedRows
  res.json(output)
})

export default router
