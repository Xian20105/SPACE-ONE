import express from 'express'
import db from '../utils/connect-mysql.js'
const router = express.Router()

// --- 加入收藏 ---

// 刪除收藏
router.delete('/api/delete-blog-fav', async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }
  const { member_id, exhibition_id } = req.body
  try {
    const sql = `
          DELETE FROM collect WHERE member_id = ? AND exhibition_id  = ?
        `
    console.log(`
    DELETE FROM collect WHERE member_id = ${member_id} AND exhibition_id  = ${exhibition_id}
    `)

    const [result] = await db.query(sql, [member_id, exhibition_id])

    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    console.log(ex)
  }

  return res.json(output)
})

// 加入收藏
router.post('/api/add-blog-fav', async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
  }
  const { member_id, exhibition_id } = req.body
  try {
    const sql = `
        INSERT INTO collect (member_id, exhibition_id ) VALUES (?,?)
        `
    const [result] = await db.query(sql, [member_id, exhibition_id])
    console.log(sql)

    output.result = result
    output.success = !!result.affectedRows
  } catch (ex) {
    console.log(ex)
  }

  return res.json(output)
})

// 取得收藏
router.get('/api/get-blog-fav', async (req, res) => {
  const member_id = +req.query.member_id

  console.log(member_id)
  const output = {
    success: false,
    courseFav: [],
  }
  try {
    const sql = `SELECT * FROM collect where member_id=?`
    const [result] = await db.query(sql, [member_id])

    // output.courseFav = result
    // output.success = true
    return res.json(result)
  } catch (ex) {
    console.log(ex)
  }
})

export default router
