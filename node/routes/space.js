import express from 'express'
import db from '##/utils/connect-mysql.js'
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
    endDate = endDateD
  } else {
    endDate = ''
  }

  let people =
    +req.query.people && typeof +req.query.people === 'number'
      ? req.query.people
      : ''
  let people_ = db.escape(`${people}`)

  let area =
    +req.query.area && typeof +req.query.area === 'number' ? req.query.area : ''
  let area_ = db.escape(`${area}`)

  let where = ` WHERE 1 `
  if (keyword) {
    qs.keyword = keyword
    where += ` AND ( \`space\` LIKE ${keyword_} ) `
  }
  if (startDate) {
    qs.startDate = startDate
    where += ` AND purchase_date >= '${startDate}' `
  }
  if (endDate) {
    qs.endDate = endDate
    where += ` AND purchase_date <= '${endDate}' `
  }
  // if (city) {
  //   qs.city = city
  //   where += ` AND city_id = ${city_} `
  // }
  if (people) {
    qs.people = people
    where += ` AND accommodate >= ${people_} `
  }

  if (area) {
    qs.area = area
    where += ` AND zip = ${area_} `
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

  const t_sql = `SELECT COUNT(1) totalRows FROM ((space JOIN place ON space.place_id = place.place_id) JOIN area ON place.zip = area.zip) JOIN city ON area.city_id = city.city_id JOIN category ON space.category_id = category.category_id ${where}`
  ;[[{ totalRows }]] = await db.query(t_sql)
  totalPages = Math.ceil(totalRows / perPage)
  if (totalRows > 0) {
    if (page > totalPages) {
      output.redirect = `?page=${totalPages}`
      output.info = `頁碼值大於總頁數`
      return { ...output, totalRows, totalPages }
    }

    const sql = `SELECT * FROM ((space JOIN place ON space.place_id = place.place_id) JOIN area ON place.zip = area.zip) JOIN city ON area.city_id = city.city_id JOIN category ON space.category_id = category.category_id ${where} ORDER BY space_id LIMIT ${
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

router.post('/add', upload.none(), async (req, res) => {
  // router.post("/add", async (req, res) => {

  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  // const [result] = await db.query(sql, [space_name, model, space_intro, purchase_date, basic_fee, time_rate, day_rate]);

  const {
    space_id,
    space_name,
    model,
    space_intro,
    purchase_date,
    basic_fee,
    time_rate,
    day_rate,
  } = req.body
  const sql =
    'INSERT INTO `space` (`space_id`, `space_name`, `model`, `space_intro`, `purchase_date`, `basic_fee`, `time_rate`, `day_rate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

  try {
    const [result] = await db.query(sql, [
      space_id,
      space_name,
      model,
      space_intro,
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

router.post('/order', upload.none(), async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  const { uuid, member_id, space_id, start_time, time, time_rate } = req.body
  const sql =
    'INSERT INTO `space_order` (`uuid`, `member_id`, `space_id`, `start_time`, `time`, `time_rate`) VALUES (?, ?, ?, ?, ?, ?)'

  try {
    const [result] = await db.query(sql, [
      uuid,
      member_id,
      space_id,
      start_time,
      time,
      time_rate,
    ])
    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    output.exception = ex
  }
  res.json(output)
})

router.get('/order/api', async (req, res) => {
  const output = {
    success: false,
    error: '',
    data: {},
  }

  const [rows] = await db.query(
    'SELECT * FROM `space_order` JOIN space ON space_order.space_id = space.space_id WHERE 1'
  )
  res.json({ success: true, rows })
})


router.get('/order/one', async (req, res) => {
  const output = {
    success: false,
    error: '',
    data: {},
    locals: res.locals,
  }

  if (!res.locals.jwt?.member_id) {
    output.error = '沒有權限'
    return res.json(output)
  }
  const [rows] = await db.query(
    'SELECT * FROM `space_order` JOIN space ON space_order.space_id = space.space_id WHERE member_id=? ORDER BY timestamp DESC',
    [res.locals.jwt.member_id]
  )

  if (!rows.length) {
    output.error = '目前沒有訂單'
    return res.json(output)
  }
  res.json({ success: true, rows })
})

router.get('/api/detail/:space_id', async (req, res) => {
  const space_id = req.params.space_id

  const sql =
    `SELECT * FROM ((space JOIN place ON space.place_id = place.place_id) JOIN area ON place.zip = area.zip) JOIN city ON area.city_id = city.city_id JOIN category ON space.category_id = category.category_id WHERE space_id=` +
    db.escape(space_id)
  // const sql = `SELECT * FROM space WHERE space_id=` + db.escape(space_id)
  const [rows] = await db.query(sql)
  if (!rows.length) {
    return res.json({ success: false })
  }
  const row = rows[0]
  res.json({ success: true, row })
})

router.get('/api/photo/:space_id', async (req, res) => {
  const space_id = req.params.space_id

  const sql = `SELECT * FROM space_photo WHERE space_id=` + db.escape(space_id)

  const [rows] = await db.query(sql)
  if (!rows.length) {
    return res.json({ success: false })
  }
  res.json({ success: true, rows })
})

router.get('/api/place/:place_id', async (req, res) => {
  const place_id = req.params.place_id

  const sql = `SELECT * FROM place_photo WHERE place_id=` + db.escape(place_id)

  const [rows] = await db.query(sql)
  if (!rows.length) {
    return res.json({ success: false })
  }
  res.json({ success: true, rows })
})

router.get('/api/photo', async (req, res) => {
  const sql = `SELECT * FROM space_photo`

  const [rows] = await db.query(sql)
  if (!rows.length) {
    return res.json({ success: false })
  }
  res.json({ success: true, rows })
})

router.delete('/:space_id', async (req, res) => {
  const output = {
    success: false,
    result: null,
  }
  const space_id = +req.params.space_id
  // if (!space_id || space_id < 1) {
  //   return res.json(output);
  // }
  const sql = ` DELETE FROM space WHERE space_id='${space_id}'`
  const [result] = await db.query(sql)
  output.result = result
  output.success = !!result.affectedRows
  res.json(output)
})

export default router