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

    const sql = `SELECT * FROM exhibition  ${where} ORDER BY exhibition_id DESC 
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
    res.render('exhibition/cf-no-admin', output)
  } else {
    res.render('exhibition/cf', output)
  }
})
//分類(測試版)
router.get('/api/get', async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }
  const type = req.query.type // 從 query string 中取得 type 參數
  const sql = `
    SELECT *
    FROM exhibition
    JOIN category ON exhibition.category_id = category.id
    WHERE category.name = ?`

  try {
    const [result] = await db.query(sql, [type])
    output.success = true
    output.data = result // 將查詢結果放入 output.data
  } catch (ex) {
    output.exception = ex
  }

  res.json(output) // 回傳 JSON 格式的 output
})

//JOIN其他表格
router.get('/api/:cf_id', async (req, res) => {
  const output = {
    success: false,
  }
  const cf_id = req.params.cf_id
  const sql =
    'SELECT * FROM exhibition e LEFT JOIN member m ON m.member_id=e.member_id WHERE e.exhibition_id= ?'
  const sql2 = 'SELECT * FROM exhibition_photo WHERE exhibition_id = ?'
  const sql3 =
    'SELECT message.*,member.name FROM message JOIN member ON message.member_id = member.member_id WHERE message.exhibition_id = ?'
  try {
    const [result] = await db.query(sql, [cf_id])
    const [photo] = await db.query(sql2, [cf_id])
    const [message] = await db.query(sql3, [cf_id])
    output.result = result[0]
    output.photo = photo[0]
    output.message = message
    output.success = true
  } catch (ex) {
    output.exception = ex
  }
  res.json(output)
})

//新增留言
router.post('/api/post', upload.none(), async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }
  const { exhibition_id, member_id, comment } = req.body
  const sql =
    'INSERT INTO `message`(`exhibition_id`, `member_id`, `comment`, `create_date`) VALUES (?, ?, ?, NOW() )'
  try {
    const [result] = await db.query(sql, [exhibition_id, member_id, comment])
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
