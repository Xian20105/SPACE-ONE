import express from 'express'
import db from '../utils/connect-mysql.js'
// import db from "./../utils/connect-mysql.js";
// import upload from "./../utils/upload-imgs.js";
// eslint-disable-next-line import/no-unresolved
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
  const perPage = 12 // 每頁幾筆
  let page = +req.query.page || 1 // 用戶決定要看第幾頁
  let category = +req.query.category || 'all'
  let filterCategory = ``
  // 種類
  switch (category) {
    case 'all':
      filterCategory += ``
      break
    default:
      filterCategory += `AND (\`category_id\` = ${category})`

      break
  }
  let orderByClause = '';

  switch (req.query.sort) {
    case 'price_asc':
      orderByClause = 'ORDER BY stock.price ASC';
      break;
    case 'price_desc':
      orderByClause = 'ORDER BY stock.price DESC';
      break;
    default:
      orderByClause = 'ORDER BY product.product_id ASC';
      break;
  }
  //搜尋關鍵字
  let keyword =
    req.query.keyword && typeof req.query.keyword === 'string'
      ? req.query.keyword.trim()
      : '';
  let keyword_ = db.escape(`%${keyword}%`);

  // 加入產品名稱搜尋條件
  if (keyword) {
    qs.keyword = keyword;
    where += ` AND (\`product_name\` LIKE ${keyword_}) `;
  }

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

  let where = ` WHERE 1 `;
  if (keyword) {
    qs.keyword = keyword;
    where += ` AND ( \`product_name\` LIKE ${keyword_} OR \`ASC\` LIKE ${keyword_} ) `;
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

  // console.log('eddie', filterCategory, where)

  const t_sql = `SELECT COUNT(1) totalRows FROM product ${where}`
  ;[[{ totalRows }]] = await db.query(t_sql)
  totalPages = Math.ceil(totalRows / perPage)
  if (totalRows > 0) {
    if (page > totalPages) {
      output.redirect = `?page=${totalPages}`
      output.info = `頁碼值大於總頁數`
      return { ...output, totalRows, totalPages }
    }

    const sql = `
    SELECT product.*, stock.*, product_photo.*
    FROM product
    INNER JOIN stock ON product.product_id = stock.product_id
    LEFT JOIN product_photo ON product.product_id = product_photo.product_id
    ${where} ${filterCategory}
    ${orderByClause}
    LIMIT ${(page - 1) * perPage}, ${perPage}`;
    ;[rows] = await db.query(sql)
    output = { ...output, success: true, rows, totalRows, totalPages }
  }

  return output
}

router.get('/', async (req, res) => {
  const { product_id } = req.query
  const sql = `
  SELECT product.*, stock.*, product_photo.*, member.member_id
  FROM product
  INNER JOIN stock ON product.product_id = stock.product_id
  LEFT JOIN product_photo ON product.product_id = product_photo.product_id
  LEFT JOIN member ON product.member_id = member.member_id
  WHERE product.product_id = '${product_id}'`
  const [rows] = await db.query(sql)
  console.log(rows[0])
  res.json({
    success: true,
    data: rows[0],
  })
  //

  // res.locals.pageproduct_name = 'ab-list'
  // res.locals.title = '列表 | ' + res.locals.title
  // const output = await getListData(req)
  // if (output.redirect) {
  //   return res.redirect(output.redirect)
  // }

  // if (!req.session.admin) {
  //   res.render('product/list-no-admin', output)
  // } else {
  //   res.render('product/list', output)
  // }
})

router.get('/api', async (req, res) => {
  res.json(await getListData(req))
  /*
  if(res.locals.jwt?.id){
    return res.json(await getListData(req));
  } else {
    return res.json({success: false, error: "沒有授權, 不能取得資料"});
  }
  */
})

router.get('/add', async (req, res) => {
  res.render('product/add')
})
// router.post('/add', upload.none(), async (req, res) => {
//   const output = {
//     success: false,
//     postData: req.body, // 除錯用
//   }

//   const { product_name, category_id, desc, discount, product_status_id } =
//     req.body
//   const sql =
//     'INSERT INTO `product`(`product_name`, `category_id`, `desc`, `discount`, `product_status_id`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW() )'

//   try {
//     const [result] = await db.query(sql, [
//       product_name,
//       category_id,
//       desc,
//       discount,
//       product_status_id,
//     ])
//     output.result = result
//     output.success = !!result.affectedRows
//   } catch (ex) {
//     output.exception = ex
//   }

//   /*
//   const sql = "INSERT INTO `product` SET ?";
//   // INSERT INTO `product` SET `product_name`='abc',
//   req.body.created_at = new Date();
//   const [result] = await db.query(sql, [req.body]);
//   */

//   // {
//   //   "fieldCount": 0,
//   //   "affectedRows": 1,  # 影響的列數
//   //   "insertId": 1021,   # 取得的 PK
//   //   "info": "",
//   //   "serverStatus": 2,
//   //   "warningStatus": 0,
//   //   "changedRows": 0    # 修改時真正有變動的資料筆數
//   // }

//   res.json(output)
// })

router.get('/edit/:product_id', async (req, res) => {
  const product_id = +req.params.product_id
  res.locals.title = '編輯 | ' + res.locals.title

  const sql = `SELECT product.*, stock.*
  FROM product
  INNER JOIN stock ON product.product_id = stock.product_id
  WHERE product.product_id = '${product_id}'`
  const [rows] = await db.query(sql)
  if (!rows.length) {
    return res.redirect(req.baseUrl)
  }
  const row = rows[0]
  row.discount2 = dayjs(row.discount).format('YYYY-MM-DD')

  res.render('product/edit', row)
})

// 取得單筆的資料
router.get('/api/edit/:product_id', async (req, res) => {
  const product_id = +req.params.product_id

  const sql = `SELECT * FROM product WHERE product_id=?`
  const [rows] = await db.query(sql, [product_id])
  if (!rows.length) {
    return res.json({ success: false })
  }
  const row = rows[0]
  row.discount = dayjs(row.discount).format('YYYY-MM-DD')

  res.json({ success: true, row })
})

router.put('/edit/:product_id', async (req, res) => {
  const output = {
    success: false,
    postData: req.body,
    result: null,
  }
  // TODO: 表單資料檢查
  req.body.product_status_id = req.body.product_status_id.trim() // 去除頭尾空白
  const sql = `UPDATE product SET ? WHERE product_id=?`
  const [result] = await db.query(sql, [req.body, req.body.product_id])
  output.result = result
  output.success = !!result.changedRows

  res.json(output)
})

router.delete('/:product_id', async (req, res) => {
  const output = {
    success: false,
    result: null,
  }
  const product_id = +req.params.product_id
  if (!product_id || product_id < 1) {
    return res.json(output)
  }

  const sql = ` DELETE FROM product WHERE product_id=${product_id}`
  const [result] = await db.query(sql)
  output.result = result
  output.success = !!result.affectedRows
  res.json(output)
})
export default router
