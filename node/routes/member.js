import express from 'express'
// import db from '#configs/db.js'
import db from '##/utils/connect-mysql.js'
import upload from '../utils/upload-imgs.js'
import dayjs from 'dayjs'
import bcrypt from 'bcryptjs'

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
    where += ` AND ( \`member\` LIKE ${keyword_} OR \`model\` LIKE ${keyword_} ) `
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

  const t_sql = `SELECT COUNT(1) totalRows FROM space ${where}`
  ;[[{ totalRows }]] = await db.query(t_sql)
  totalPages = Math.ceil(totalRows / perPage)
  if (totalRows > 0) {
    if (page > totalPages) {
      output.redirect = `?page=${totalPages}`
      output.info = `頁碼值大於總頁數`
      return { ...output, totalRows, totalPages }
    }

    const sql = `SELECT * FROM member ${where} ORDER BY member_id LIMIT ${
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
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  const { email, name, nickname, password, phone, birthday, area, address } =
    req.body
  const password_ = bcrypt.hashSync(password, 10)
  const sql =
    'INSERT INTO `member` (`email`, `name`, `nickname`, `password`, `phone`, `birthday`, `area_id`, `address`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

  try {
    const [result] = await db.query(sql, [
      email,
      name,
      nickname,
      password_,
      phone,
      birthday,
      area,
      address,
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

router.get('/profile', async (req, res) => {
  // res.locals.jwt: {id, email}

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
    'SELECT `member_id`, `name`, `email`, `phone`, `birthday`, `nickname`, `city`, `area`, `zip`, `address` FROM ((`member` JOIN area ON member.area_id = area.zip) JOIN city ON area.city_id = city.city_id) WHERE member_id=?',
    [res.locals.jwt.member_id]
  )

  if (!rows.length) {
    output.error = '沒有這個會員'
    return res.json(output)
  }
  output.success = true
  output.data = rows[0]
  res.json(output)
})

router.post('api/edit/:member_id', upload.none(), async (req, res) => {
  const member_id = +req.params.member_id

  const { email, name, nickname, phone, birthday, area, address } = req.body
  const output = {
    success: false,
    postData: req.body,
    result: null,
  }
  const sql =
    'UPDATE `member` (`email`, `name`, `nickname`, `password`, `phone`, `birthday`, `area_id`, `address`) WHERE member_id = 21 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  const [result] = await db.query(sql, [
    // member_id,
    email,
    name,
    nickname,
    phone,
    birthday,
    area,
    address,
  ])
  output.result = result
  output.success = !!result.changedRows
  res.json(output)
})

// 收藏列表
router.get('/collection/:mid', async (req, res) => {
  const mid = req.params.mid || ''
  console.log(mid)
  const output = {
    success: false,
    error: '',
    data: {},
  }

  try {
    const [rows] = await db.query(
      'SELECT e.exhibition_id, e.exhibition_name FROM collect c JOIN exhibition e ON c.exhibition_id = e.exhibition_id WHERE c.member_id = ?',
      [mid]
    )

    if (!rows.length) {
      output.error = '此會員沒有收藏任何展覽'
    } else {
      output.success = true
      output.data = rows
    }

    res.json(output)
  } catch (error) {
    output.error = '資料庫錯誤: ' + error.message
    res.json(output)
  }
})

export default router
