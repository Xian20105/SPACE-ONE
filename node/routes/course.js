import express from 'express'
import db from '../utils/connect-mysql.js'
// import db from '../configs/db.js' //Eddy
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
  const perPage = 30 // 每頁幾筆
  let page = +req.query.page || 1 // 用戶決定要看第幾頁

  // keyword
  let keyword =
    req.query.keyword && typeof req.query.keyword === 'string'
      ? req.query.keyword.trim()
      : ''
  let keyword_ = db.escape(`%${keyword}%`) // 跳脫

  // category
  let category =
    req.query.category && typeof req.query.category === 'string'
      ? req.query.category
      : ''
  let category_ = db.escape(`%${category}%`) // 跳脫

  let qs = {} // 用來把 query string 的設定傳給 template

  /*
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
  */

  /* keyword - OK */
  // WHERE 1看作true
  let where = ` WHERE 1 `
  if (keyword) {
    //如果有 keyword，就把 keyword 放進qs
    qs.keyword = keyword
    where += ` AND ( \`course_name\` LIKE ${keyword_} ) `
  }

  /* category */
  if (category) {
    //如果有 category，就把 category 放進qs
    qs.category = category
    where += ` AND ( \`category_id\` LIKE ${category_} ) `
  }

  /*
  if (startDate) {
    qs.startDate = startDate
    where += ` AND birthday >= '${startDate}' `
  }
  if (endDate) {
    qs.endDate = endDate
    where += ` AND birthday <= '${endDate}' `
  }
  */

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

  const t_sql = `SELECT COUNT(1) totalRows FROM course ${where}`
  ;[[{ totalRows }]] = await db.query(t_sql)
  totalPages = Math.ceil(totalRows / perPage)
  if (totalRows > 0) {
    if (page > totalPages) {
      output.redirect = `?page=${totalPages}`
      output.info = `頁碼值大於總頁數`
      return { ...output, totalRows, totalPages }
    }

    const sql = `SELECT * FROM course ${where} ORDER BY course_id DESC 
    LIMIT ${(page - 1) * perPage}, ${perPage}`
    ;[rows] = await db.query(sql)
    output = { ...output, success: true, rows, totalRows, totalPages }
  }

  return output
}

router.get('/', async (req, res) => {
  res.locals.pageName = 'course-list'
  res.locals.title = '課程列表 | ' + res.locals.title
  const output = await getListData(req)
  if (output.redirect) {
    return res.redirect(output.redirect)
  }
  /*
  if (!req.session.admin) {
    res.render('address-book/list-no-admin', output)
  } else {
    res.render('address-book/list', output)
  }
  */
})

// 撈 列表頁 資料：設定一個GET路由, 當客戶端訪問 /api 時,調用 getListData 獲取參數
router.get('/api', async (req, res) => {
  res.json(await getListData(req))
})
/* 原
// 撈 詳細頁 單筆資料
// router.get('/detail/:course_id', async (req, res) => {   OK
router.get('/:course_id', async (req, res) => {
  const courseId = req.params.course_id
  // const courseId = req.query.course_id
  // 撈單筆資料sql
  // const sql = ` SELECT * FROM course WHERE course_id=?`
  const sql = ` SELECT * FROM course 
  join category on course.category_id = category.category_id
  join place on course.place_id = place.place_id
  join teacher on course.teacher_id = teacher.teacher_id
  WHERE course_id=?`
  const [rows] = await db.query(sql, [courseId])
  res.json(rows)
})
 */

/* 新-新得 */
// 撈 詳細頁 單筆資料
router.get('/:course_id', async (req, res) => {
  const output = {
    success: false,
  }
  const courseId = req.params.course_id
  // 撈單筆資料sql
  const sql = ` SELECT * FROM course 
  join category on course.category_id = category.category_id
  join place on course.place_id = place.place_id
  join teacher on course.teacher_id = teacher.teacher_id
  WHERE course_id=?`
  const sql2 = ` SELECT * FROM course_photo
  WHERE course_id=?`

  try {
    const [result] = await db.query(sql, [courseId])
    // const [photo] = await db.query(sql2, [courseId])

    output.result = result[0]
    // output.photo = photo[0]
    output.success = true
  } catch (ex) {
    output.exception = ex
  }
  res.json(output)
})

// 撈 詳細頁 會員留言 的3筆資料
router.get('/member-comment/:course_id', async (req, res) => {
  const courseId = req.params.course_id

  const sql = ` SELECT * FROM course_order 
  JOIN member ON course_order.member_id = member.member_id
  JOIN course_order_detail ON course_order.course_order_id = course_order_detail.course_order_id
  JOIN course ON course_order_detail.course_id = course.course_id
  JOIN teacher_rating ON course_order_detail.course_order_detail_id = teacher_rating.course_order_detail_id
  WHERE course.course_id = ?
  ORDER BY course_order.course_order_id DESC LIMIT 3 `

  // WHERE course.teacher_id = ?

  const [rows] = await db.query(sql, [courseId])
  res.json(rows)
  console.log(rows)
})

// 新增 講師評價
router.get('/evaluation-add', async (req, res) => {
  res.render('course/evaluation-add')
})
// upload.none(), 先放這邊
router.post('/evaluation-add', async (req, res) => {
  console.log('+', req.body)
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  const { teacher_rating_id, comment } = req.body
  const sql =
    'INSERT INTO `teacher_rating`(`teacher_rating_id`, `comment`) VALUES (?, ?)'

  try {
    const [result] = await db.query(sql, [
      teacher_rating_id, //?????
      comment,
    ])
    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    output.exception = ex
  }

  res.json(output)
})

/*
// 撈 分類1:縫紉
router.get('/category1/api', async (req, res) => {
  const sql = ` SELECT * FROM course WHERE category_id = 1 `
  const [rows] = await db.query(sql)
  res.json(rows)
  console.log(rows)
})
// 撈 分類2:刺繡
router.get('/category2/api', async (req, res) => {
  const sql = ` SELECT * FROM course WHERE category_id = 2 `
  const [rows] = await db.query(sql)
  res.json(rows)
  console.log(rows)
})
*/

// 撈 猜你可能喜歡 資料
router.get('/maybe-like/api', async (req, res) => {
  const sql = ` SELECT * FROM course ORDER BY course_id DESC LIMIT 3 `
  const [rows] = await db.query(sql)
  res.json(rows)
  console.log(rows)
})

// 新增 create (課程訂單):
//  把購物車 localstorage post進訂單資料表 （course_order ＋ course_order_detail）
router.get('/order-add', async (req, res) => {
  res.render('course/order-add')
})
router.post('/order-add', async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  console.log('req.body', req.body)
  // test:const data = req.body
  //const { course_order_id, member_id, course_id } = req.body //看呈現的表單,有幾欄要填
  // test:console.log('req.body:', course_order_id)
  // test:output.course_order_id = course_order_id
  // test:output.success = true

  // step1.
  const sql =
    'INSERT INTO `course_order`(`course_order_id`,`member_id`, `total`) VALUES (NULL, ?, ?)'
  // 資料庫有幾欄,這裡就要有幾欄:VALUES (?, ?, ?, ?)
  // VALUES 也可以依據欄位,用預設值 (?, '2024-01-02', ?, 2580)
  //                                 ^^^^^^^^^^^也可以用dayjs設定一個假的值

  try {
    const [result] = await db.query(sql, [
      // 有幾個"問號"就要有幾個
      1, //member_id
      req.body.total,
      // course_id,
    ])

    output.result = result
    console.log('result.insertId', result.insertId)
    const insertId = result.insertId
    const items = req.body.items

    // step2.
    const sql2 =
      'INSERT INTO `course_order_detail`(`course_order_detail_id`,`course_order_id`,`course_id`) VALUES ?'

    const [result2] = await db.query(sql2, [
      items.map((item) => [0, insertId, item.course_id]),
    ])

    console.log('result2', result2)

    output.success = !!result.affectedRows
  } catch (ex) {
    output.exception = ex
  }

  res.json(output)
})

// 撈 最新一筆訂單 的單筆資料
router.get('/new-course-order/api', async (req, res) => {
  const courseOrderId = req.params.course_order_id
  // 撈 訂單最大值 的sql
  const sql = ` SELECT * FROM course_order 
  JOIN course_order_detail ON course_order.course_order_id = course_order_detail.course_order_id
  JOIN course ON course_order_detail.course_id = course.course_id
  WHERE course_order_detail.course_order_id = (
    SELECT MAX(course_order_detail.course_order_id) FROM course_order_detail)
  ORDER BY course_order.course_order_id DESC`
  // ORDER BY course_order_detail.course_order_id DESC`

  const [rows] = await db.query(sql, [courseOrderId])
  res.json(rows)
  console.log(rows)
})
/**/
// 撈 我的訂單 的全部資料 (依據會員)
router.get('/my-course-order/api', async (req, res) => {
  const output = {
    success: false,
  }
  // const courseOrderId = req.params.course_order_id
  const memberId = req.params.member_id
  // 撈 降冪訂單 的sql
  const sql = ` SELECT * FROM course_order
  JOIN member ON course_order.member_id = member.member_id
  JOIN course_order_detail ON course_order.course_order_id = course_order_detail.course_order_id
  JOIN course ON course_order_detail.course_id = course.course_id
  WHERE member.member_id=?
  ORDER BY course_order.course_order_id DESC`

  // course_order_detail.course_order_id = (
  //   SELECT MAX(course_order_detail.course_order_id) FROM course_order_detail)
  // ORDER BY course_order_detail.course_order_id DESC`

  const [rows] = await db.query(sql, [memberId])
  res.json(rows)
  console.log(rows)
})

/* 收藏 */
// 取得 收藏狀態
router.get('/get-course-fav', async (req, res) => {
  const member_id = +req.query.member_id

  console.log(member_id)
  const output = {
    success: false,
    courseFav: [],
  }
  try {
    const sql = `SELECT * FROM course_collect where member_id=?; `
    const [result] = await db.query(sql, [member_id])

    // output.courseFav = result
    // output.success = true
    return res.json(result)
  } catch (ex) {
    console.log(ex)
  }
})
// 加入收藏
router.post('/add-course-fav', async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }
  const { member_id, course_id } = req.body
  try {
    const sql = `INSERT INTO course_collect (member_id, course_id) VALUES (?,?)`
    const [result] = await db.query(sql, [member_id, course_id])

    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    console.log(ex)
  }

  return res.json(output)
})
// 刪除收藏
router.delete('/delete-course-fav', async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }
  const { member_id, course_id } = req.body
  try {
    const sql = `
      DELETE FROM course_collect WHERE member_id = ? AND course_id = ?
    `
    console.log(`
DELETE FROM course_collect WHERE member_id = ${member_id} AND course_id = ${course_id}
`)

    const [result] = await db.query(sql, [member_id, course_id])

    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    console.log(ex)
  }

  return res.json(output)
})

// 新增 create:
// 瀏覽器訪問'/add'路徑時，他們會看到'course/add'中的內容
router.get('/add', async (req, res) => {
  res.render('course/add')
})
// upload.none(), 先放這邊
router.post('/add', async (req, res) => {
  console.log('eddie', req.body)
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }

  const { course_id, course_name, course_date, course_intro, course_price } =
    req.body
  const sql =
    'INSERT INTO `course`(`course_id`, `course_name`, `course_date`, `course_intro`, `course_price`) VALUES (?, ?, ?, ?, ? )'

  try {
    const [result] = await db.query(sql, [
      course_id, //?????
      course_name,
      course_date,
      course_intro,
      course_price,
    ])
    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    output.exception = ex
  }

  res.json(output)
})

/*
// 下面未完全確定!!!!!
router.get("/edit/:sid", async (req, res) => {
  const sid = +req.params.sid;
  res.locals.title = "編輯 | " + res.locals.title;

  const sql = `SELECT * FROM address_book WHERE sid=?`;
  const [rows] = await db.query(sql, [sid]);
  if (!rows.length) {
    return res.redirect(req.baseUrl);
  }
  const row = rows[0];
  row.birthday2 = dayjs(row.birthday).format("YYYY-MM-DD");

  res.render("address-book/edit", row);
});

// 取得單筆的資料
router.get("/api/edit/:sid", async (req, res) => {
  const sid = +req.params.sid;


  const sql = `SELECT * FROM address_book WHERE sid=?`;
  const [rows] = await db.query(sql, [sid]);
  if (!rows.length) {
    return res.json({success: false});
  }
  const row = rows[0];
  row.birthday = dayjs(row.birthday).format("YYYY-MM-DD");

  res.json({success: true, row});
});

router.put("/edit/:sid", async (req, res) => {
  const output = {
    success: false,
    postData: req.body,
    result: null,
  };
  // TODO: 表單資料檢查
  req.body.address = req.body.address.trim(); // 去除頭尾空白
  const sql = `UPDATE address_book SET ? WHERE sid=?`;
  const [result] = await db.query(sql, [req.body, req.body.sid]);
  output.result = result;
  output.success = !!result.changedRows;

  res.json(output);
});
*/

router.delete('/:course_id', async (req, res) => {
  const output = {
    success: false,
    result: null,
  }
  const course_id = +req.params.course_id
  if (!course_id || course_id < 1) {
    return res.json(output)
  }

  const sql = ` DELETE FROM course WHERE course_id=${course_id}`
  const [result] = await db.query(sql)
  output.result = result
  output.success = !!result.affectedRows
  res.json(output)
})

export default router
