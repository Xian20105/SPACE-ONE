import * as fs from 'fs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import createError from 'http-errors'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import session from 'express-session'
import db from './utils/connect-mysql.js'
import memberRouter from './routes/member.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import courseRouter from './routes/course.js'
import deviceRouter from './routes/device.js'
import spaceRouter from './routes/space.js'
//引進展覽路由
import exhibitionRouter from './routes/exhibition.js'
import productRouter from './routes/product.js'
import cityRouter from './routes/city.js'
import cfRouter from './routes/cf.js'
import cfCollectRouter from './routes/cfCollectRouter.js'

// 使用檔案的session store，存在sessions資料夾
import sessionFileStore from 'session-file-store'
const FileStore = sessionFileStore(session)

// 修正 ESM 中的 __dirname 與 windows os 中的 ESM dynamic import
import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
import { extendLog } from '#utils/tool.js'
import 'colors'
extendLog()

// 建立 Express 應用程式
const app = express()
app.use(express.json())

// cors設定，參數為必要，注意不要只寫`app.use(cors())`
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://localhost:9000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

app.use('/course', courseRouter) // +:定義課程路由
app.use(express.urlencoded({ extended: true }))

// 展覽路由設定
app.use('/exhibition', exhibitionRouter)
app.use('/exhibition/cf', cfRouter)
app.use('/cfCollect', cfCollectRouter)

// 視圖引擎設定
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// 記錄HTTP要求
app.use(logger('dev'))
// 剖析 POST 與 PUT 要求的JSON格式資料

// 剖折 Cookie 標頭與增加至 req.cookies
app.use(cookieParser())
// 在 public 的目錄，提供影像、CSS 等靜態檔案
app.use(express.static(path.join(__dirname, 'public')))

// fileStore的選項 session-cookie使用
const fileStoreOptions = { logFn: function () {} }
app.use(
  session({
    store: new FileStore(fileStoreOptions), // 使用檔案記錄session
    name: 'SESSION_ID', // cookie名稱，儲存在瀏覽器裡
    secret: '67f71af4602195de2450faeb6f8856c0', // 安全字串，應用一個高安全字串
    cookie: {
      maxAge: 30 * 86400000, // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session保存30天
    },
    resave: false,
    saveUninitialized: false,
  })
)
// 自訂頂層 middleware
app.use((req, res, next) => {
  const auth = req.get('Authorization')
  if (auth && auth.indexOf('Bearer ') === 0) {
    const token = auth.slice(7) // 去掉 "Bearer "
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      console.log({ payload })
      res.locals.jwt = payload
    } catch (ex) {
      console.log(ex)
    }
  }
  next()
})

app.use('/member', memberRouter)
app.use('/space', spaceRouter)
app.use('/device', deviceRouter)
app.use('/city', cityRouter)

app.post('/login-jwt', async (req, res) => {
  const output = {
    success: false,
    code: 0,
    postData: req.body,
    email: '',
    nickname: '',
    token: '',
  }
  //資料檢查
  if (!req.body.email || !req.body.password) {
    output.code = 410
    return res.json(output)
  }
  const sql = 'SELECT * FROM member WHERE email=?'
  const [rows] = await db.query(sql, [req.body.email])

  //帳號檢查
  if (!rows.length) {
    output.code = 400
    return res.json(output)
  }
  const row = rows[0]
  const pass = await bcrypt.compare(req.body.password, row.password)
  //密碼檢查
  if (!pass) {
    output.code = 420
    return res.json(output)
  }

  output.code = 200
  output.success = true

  output.member_id = row.member_id
  output.email = row.email
  output.nickname = row.nickname
  output.token = jwt.sign(
    { member_id: row.member_id, email: row.email },
    process.env.JWT_SECRET
  )

  res.json(output)
})

app.use('/product', productRouter)
// 載入routes中的各路由檔案，並套用api路由 START
const apiPath = '/api' // 預設路由
const routePath = path.join(__dirname, 'routes')
const filenames = await fs.promises.readdir(routePath)

for (const filename of filenames) {
  const item = await import(pathToFileURL(path.join(routePath, filename)))
  const slug = filename.split('.')[0]
  //記得處理
  // app.use(`${apiPath}/${slug === 'index' ? '' : slug}`, item.default)
}
// 載入routes中的各路由檔案，並套用api路由 END

// 捕抓404錯誤處理
app.use(function (req, res, next) {
  next(createError(404))
})

// 錯誤處理函式
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // 更改為錯誤訊息預設為JSON格式
  res.status(500).send({ error: err })
})

export default app
