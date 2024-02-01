import React from 'react'
// import { useContext } from 'react'
import { useState } from 'react'
import { EX_ADD } from '@/components/my-const'
import styles from '@/styles/Comment.module.css'
// import AuthContext from '@/context/AuthContext'

export default function Message({ eid, mid, getListData }) {
  // const { auth } = useContext(AuthContext)
  // console.log(auth, 'e')
  const [comment, setComment] = useState('')

  const [displayInfo, setDisplayInfo] = useState('')

  const changeHandler = (e) => {
    const { value } = e.target
    console.log({ value })
    setDisplayInfo('')

    setComment(value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const r = await fetch(EX_ADD, {
      method: 'POST',
      body: JSON.stringify({
        exhibition_id: eid,
        member_id: mid,
        comment,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await r.json()
    if (responseData.success) {
      setDisplayInfo('succ')
      // alert("新增成功");
      getListData(eid)
    } else {
      setDisplayInfo('fail')
      // alert("新增發生錯誤!!!");
    }
    // 清空留言欄
    setComment('')

    // 清空訊息狀態
    setTimeout(() => {
      setDisplayInfo('')
    }, 5000)
  }

  console.log('re-render---', new Date())
  return (
    <>
      <div className={styles.Ccontainer}>
        <div className={styles.commentGroup}>
          <form onSubmit={onSubmit}>
            {/* <input type="text" value={eid} />
            <input type="text" value={mid} /> */}

            <div className={styles.textGroup}>
              <textarea
                className={styles.comment}
                id="comment"
                name="comment"
                value={comment}
                onChange={changeHandler}
                placeholder="我想說..."
                style={{ fontSize: '16px', padding: '12px' }}
              ></textarea>
            </div>
            <div className={styles.alert}>
              {displayInfo ? (
                displayInfo === 'succ' ? (
                  <div className="alert alert-success" role="alert">
                    資料新增成功
                  </div>
                ) : (
                  <div className="alert alert-danger" role="alert">
                    新增發生錯誤!!!
                  </div>
                )
              ) : null}
            </div>

            <div className={styles.notice}>
              <div className={styles.send}>
                <button type="submit">送出</button>
              </div>
              <p>
                留言區為討論計畫內容用
                <br />
                請勿張貼廣告 個資 或其他違反使用條款的內容
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
