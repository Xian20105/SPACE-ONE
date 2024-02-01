import express from 'express'
import db from '../utils/connect-mysql.js'
import upload from '../utils/upload-imgs.js'
import dayjs from 'dayjs'

const router = express.Router()

router.use((req, res, next) => {
  const u = req.url.split('?')[0] // 只要路徑
  console.log({ u })
  if (req.method === 'GET' && u === '/') {
    return next()
  }
  /*
    if (!req.session.admin) {
      return res.redirect("/login");
    } */
  next()
})

const getListData = async (req) => {
  const perPage = 20 // 每頁幾筆
  let page = +req.query.page || 1 // 用戶決定要看第幾頁
  let keyword =
    req.query.keyword && typeof req.query.keyword === 'string'
      ? req.query.keyword.trim()
      : ''
  let keyword_ = db.escape(`%${keyword}%`)

  let qs = {} // 用來把 query string 的設定傳給 template
  // 起始的日期
  let startDate = req.query.startDate ? req.query.startDate.trim() : ''
  const startDateD = dayjs(startDate)
  if (startDateD.isValid()) {
    startDate = startDateD.format('YYYY-MM-DD')
  } else {
    startDate = ''
  }

  // 結束的日期
  let endDate = req.query.endDate ? req.query.endDate.trim() : ''
  const endDateD = dayjs(endDate)
  if (endDateD.isValid()) {
    endDate = endDateD.format('YYYY-MM-DD')
  } else {
    endDate = ''
  }

  let where = ` WHERE 1 `
  if (keyword) {
    qs.keyword = keyword
    where += ` AND ( \`exhibition_name\` LIKE ${keyword_}  `
  }
  if (startDate) {
    qs.startDate = startDate
    where += ` AND start_time >= '${startDate}' `
  }
  if (endDate) {
    qs.endDate = endDate
    where += ` AND end_time <= '${endDate}' `
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

  const t_sql = `SELECT COUNT(1) totalRows FROM exhibition ${where}`
  ;[[{ totalRows }]] = await db.query(t_sql)
  totalPages = Math.ceil(totalRows / perPage)
  if (totalRows > 0) {
    if (page > totalPages) {
      output.redirect = `?page=${totalPages}`
      output.info = `頁碼值大於總頁數`
      return { ...output, totalRows, totalPages }
    }

    const sql = `SELECT * FROM exhibition INNER JOIN exhibition_photo ON exhibition.exhibition_id = exhibition_photo.exhibition_id ${where} ORDER BY exhibition.exhibition_id DESC 
    LIMIT ${(page - 1) * perPage}, ${perPage}`
    ;[rows] = await db.query(sql)
    output = { ...output, success: true, rows, totalRows, totalPages }
  }

  return output
}

router.get('/', async (req, res) => {
  res.locals.pageName = 'ex-list'
  res.locals.title = '列表 | ' + res.locals.title
  const output = await getListData(req)
  if (output.redirect) {
    return res.redirect(output.redirect)
  }

  if (!req.session.admin) {
    res.render('exhibition/list-no-admin', output)
  } else {
    res.render('exhibition/list', output)
  }
})

router.get('/api', async (req, res) => {
  res.json(await getListData(req))
})

const getListDataType = async (req) => {
  let perPage = 12
  let page = +req.query.page || 1
  let type = req.query.type // 類別

  let keyword =
    req.query.keyword && typeof req.query.keyword === 'string'
      ? req.query.keyword.trim()
      : ''
  let keyword_ = db.escape(`%${keyword}%`)

  let qs = {}

  //開始data
  let startDate = req.query.startDate ? req.query.startDate.trim() : ''
  const startDateD = dayjs(startDate)
  if (startDateD.isValid()) {
    startDate = startDateD.format('YYYY-MM-DD')
  } else {
    startDate = ''
  }

  //結束date
  let endDate = req.query.endDate ? req.query.endDate.trim() : ''
  const endDateD = dayjs(endDate)
  if (endDateD.isValid()) {
    endDate = endDateD.format('YYYY-MM-DD')
  } else {
    endDate = ''
  }

  let where = ` WHERE 1 `
  if (type && type !== '0') {
    where += ` AND category = '${type}' `
  }
  if (keyword) {
    qs.keyword = keyword
    where += ` AND ( \`exhibition_name\` LIKE ${keyword_} ) `
  }
  if (startDate) {
    qs.startDate = startDate
    where += ` AND start_time >= '${startDate}' `
  }
  if (endDate) {
    qs.endDate = endDate
    where += ` AND end_time <= '${endDate}' `
  }

  const count_sql = `SELECT COUNT(1) as count FROM exhibition ${where}`
  const [[{ count }]] = await db.query(count_sql)

  if (count < 12) {
    perPage = count
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
    output.info = `Page number is less than 1`
    return output
  }

  const t_sql = `SELECT COUNT(1) totalRows FROM exhibition ${where}`
  ;[[{ totalRows }]] = await db.query(t_sql)
  totalPages = Math.ceil(totalRows / perPage)

  if (totalRows > 0) {
    if (page > totalPages) {
      output.redirect = `?page=${totalPages}`
      output.info = `Page number exceeds total pages`
      return { ...output, totalRows, totalPages }
    }

    const sql = `SELECT * FROM exhibition INNER JOIN exhibition_photo ON exhibition.exhibition_id = exhibition_photo.exhibition_id ${where} ORDER BY exhibition.exhibition_id DESC 
    LIMIT ${(page - 1) * perPage}, ${perPage}`
    ;[rows] = await db.query(sql)
    output = { ...output, success: true, rows, totalRows, totalPages }
  }

  return output
}

//瀑布流的API
router.get('/api/fall', async (req, res) => {
  const output = {
    success: false,
  }

  let baseSql =
    'SELECT e.*, ep.* FROM exhibition e LEFT JOIN exhibition_photo ep ON e.exhibition_id = ep.exhibition_id'
  const type = req.query.type
  const order = parseInt(req.query.order) || 1 // Default to order 1 if not specified
  const limit = 6 // Number of records per batch
  const offset = (order - 1) * limit // Calculate the offset based on the order

  // Check if type is defined and is one of the expected values
  if (type !== undefined) {
    if (type === '0') {
      // If type is 0, the original SQL query will be used to get all data
    } else if (['1', '2', '3', '4'].includes(type)) {
      // If type is 1, 2, 3, or 4, modify the SQL query to filter by category
      baseSql += ` WHERE e.category = ${parseInt(type)}`
    } else {
      // If type is not one of the expected values, return an error response
      return res.status(400).json({ error: 'Invalid type parameter' })
    }
  }

  // Add LIMIT and OFFSET clauses to paginate results based on the order
  baseSql += ` LIMIT ${limit} OFFSET ${offset}`

  try {
    const [result] = await db.query(baseSql)
    output.result = result
    output.success = true // Set success to true if query executes successfully
  } catch (ex) {
    output.exception = ex
  }
  res.json(output)
})

// router.get('/add', async (req, res) => {
//   res.render('exhibition/add')
// })
// eslint-disable-next-line no-undef
router.post('/add', upload.none(), async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  const { exhibition_name, start_time, end_time, exhibition_intro } = req.body
  const sql =
    'INSERT INTO `exhibition`(`exhibition_name`, `start_time`, `end_time`, `exhibition_intro`) VALUES (?, ?, ?, ?)'

  try {
    const [result] = await db.query(sql, [
      exhibition_name,
      start_time,
      end_time,
      exhibition_intro,
    ])
    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    output.exception = ex
  }

  res.json(output)
})

router.get('/edit/:exhibition_id', async (req, res) => {
  const exhibition_id = +req.params.exhibition_id
  res.locals.title = '編輯 | ' + res.locals.title

  const sql = `SELECT * FROM exhibition WHERE exhibition_id=?`
  const [rows] = await db.query(sql, [exhibition_id])
  if (!rows.length) {
    return res.redirect(req.baseUrl)
  }
  const row = rows[0]
  row.start_time = dayjs(row.start_time).format('YYYY-MM-DD')

  res.render('exhibition/edit', row)
})

// 取得單筆的資料
router.get('/api/edit/:exhibition_id', async (req, res) => {
  const exhibition_id = +req.params.exhibition_id

  const sql = `SELECT * FROM exhibition WHERE exhibition_id=?`
  const [rows] = await db.query(sql, [exhibition_id])
  if (!rows.length) {
    return res.json({ success: false })
  }
  const row = rows[0]
  row.start_time = dayjs(row.start_time).format('YYYY-MM-DD')

  res.json({ success: true, row })
})

router.put('/edit/:exhibition_id', async (req, res) => {
  const output = {
    success: false,
    postData: req.body,
    result: null,
  }
  // TODO: 表單資料檢查
  // req.body.exhibition_intro = req.body.exhibition_intro.trim(); // 去除頭尾空白
  const sql = `UPDATE exhibition SET ? WHERE exhibition_id=?`
  const [result] = await db.query(sql, [req.body, req.body.exhibition_id])
  output.result = result
  output.success = !!result.changedRows

  res.json(output)
})

router.delete('/:exhibition_id', async (req, res) => {
  const output = {
    success: false,
    result: null,
  }
  const exhibition_id = +req.params.exhibition_id
  if (!exhibition_id || exhibition_id < 1) {
    return res.json(output)
  }

  const sql = ` DELETE FROM exhibition WHERE exhibition_id=${exhibition_id}`
  const [result] = await db.query(sql)
  output.result = result
  output.success = !!result.affectedRows
  res.json(output)
})
export default router
