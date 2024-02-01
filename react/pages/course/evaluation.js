import React, { useState } from 'react'
// import StarIcon from '@/components/layout/course/teacher-comment/user-comment/star-icon'
import Header from '@/components/layout/header.js'
import Footer from '@/components/layout/footer.js'
import styles from '@/styles/evaluation.module.css'
import Link from 'next/link'
// my-const 用
import { TCH_EVA_ADD } from '@/components/my-const'
import Head from 'next/head'

export default function Evaluation() {
  const [myForm, setMyForm] = useState({
    teacher_rating_id: 0,
    comment: '',
  })
  const [displayInfo, setDisplayInfo] = useState('') // "", "succ", "fail"

  const changeHandler = (e) => {
    const { name, id, value } = e.target
    console.log({ name, id, value })
    setDisplayInfo('')
    setMyForm({ ...myForm, [id]: value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const r = await fetch(TCH_EVA_ADD, {
      method: 'POST',
      body: JSON.stringify(myForm),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await r.json()
    if (responseData.success) {
      // setDisplayInfo('succ')
      alert('新增成功')
    } else {
      // setDisplayInfo('fail')
      alert('新增發生錯誤!!!')
    }
  }

  return (
    <>
      <Head>
        <title>SPACE ONE</title>
      </Head>
      <Header />
      <div className={styles.evaluationSection}>
        <div className={styles.bigTitle}>填寫講師建議</div>
        <p className={styles.titleText}>
          歡迎你給予鼓勵、提出建議，你的心得與想法，都將是尚未加入課程的同學們的最佳參考！
        </p>
        <div className={styles.writeSection}>
          <form name="form1" onSubmit={onSubmit}>
            <label htmlFor="comment" className={styles.smallTitle}>
              1
            </label>
            <textarea
              className={styles.textSection}
              name="comment"
              id="comment"
              cols="100"
              rows="30"
              value={myForm.comment}
              onChange={changeHandler}
            ></textarea>
            {/* <div className={styles.writeSectionTable}> */}
            {/* </div> */}

            {displayInfo ? (
              displayInfo === 'succ' ? (
                <div class="alert alert-success" role="alert">
                  資料新增成功
                </div>
              ) : (
                <div class="alert alert-danger" role="alert">
                  新增發生錯誤!!!
                </div>
              )
            ) : null}

            <div className={styles.twoButtons}>
              <button>
                <Link href={`/course/my-course-order`}>返回我的訂單</Link>
              </button>
              <button type="submit">
                <Link href={`/course`}>送出</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

// import React from 'react'
// import StarIcon from '@/components/layout/course/teacher-comment/user-comment/star-icon'

// export default function Evaluation() {
//   return (
//     <>
//       <div>填寫講師評價</div>
//       <div>
//         歡迎你給予鼓勵、提出建議，你的心得與想法，都將是尚未加入課程同學們的最佳參考！
//       </div>
//       <div>
//         <div>講師評分（點一下星星來評等，若未點選，則預設五顆星）</div>
//         <StarIcon />
//       </div>
//       <div>
//         <div>講師評價內容</div>
//         <textarea name="" id="" cols="30" rows="10"></textarea>
//       </div>
//     </>
//   )
// }
