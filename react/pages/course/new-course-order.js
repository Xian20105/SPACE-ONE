import React from 'react'
import Header from '@/components/layout/header.js'
import Footer from '@/components/layout/footer.js'
import styles from '@/styles/new-course-order.module.css'
import Link from 'next/link'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// 後端
import { CS_NEW_ORDER_ONE } from '@/components/my-const'
import Head from 'next/head'

export default function NewCourseOrder() {
  const router = useRouter() // router 獲得動態路由
  const [data, setData] = useState([])

  // 向伺服器要資料（shin）
  // course_order_id
  const getNewCourseOrderData = async () => {
    try {
      const r = await fetch(CS_NEW_ORDER_ONE)
      console.log('一、', r)

      const d = await r.json()
      console.log('二、', d)

      setData(d)
      console.log('三、', d)
    } catch (ex) {}
  }

  useEffect(() => {
    getNewCourseOrderData()
  }, [])

  console.log('四、', data)

  return (
    <>
      <Head>
        <title>SPACE ONE</title>
      </Head>
      <Header />
      <div className={styles.main}>
        {/* 上方 結帳三步驟區 區塊 */}
        <div className={styles.progressBar}>
          <div className={styles.progress1}>
            <div className={styles.progressNumber1}>1</div>
            <div>購物車</div>
          </div>
          <div className={styles.progress2}>
            <div className={styles.progressNumber2}>2</div>
            <div>確認購買明細</div>
          </div>
          <div className={styles.progress3}>
            <div className={styles.progressNumber3}>✓</div>
            <div>完成購買</div>
          </div>
        </div>

        {/* 主要內容區塊 */}
        <div className={styles.orderSection}>
          <div className={styles.courseOrderOk}>課程訂單已成立！</div>
          {/* 只抓一筆 訂單編號 */}
          {data.length && (
            <div className={styles.courseOrderId}>
              訂單編號：230823202401221225{data[0].course_order_id}
            </div>
          )}

          <div className={styles.orderListSection}>
            {/* map 課程資料 */}
            {data.length &&
              data.map((v, i) => {
                return (
                  <div className={styles.oneOrderList} key={v.course_order_id}>
                    <Image
                      className={styles.coursePhoto}
                      src={`/course/images/${v.course_photo.split(',')[0]}`}
                      alt=""
                      width={200}
                      height={200}
                    />
                    <div className={styles.nameAndPrice}>
                      <div className={styles.courseName}>{v.course_name}</div>
                      <div className={styles.coursePrice}>
                        ＄{v.course_price}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>

          {/* 只抓一筆  總計 */}
          {data.length && (
            <div className={styles.totalTitleAndTotalNumber}>
              <div className={styles.courseOrderTotalTitle}>
                總計：
                <div className={styles.totalNumber}>＄{data[0].total}</div>
              </div>
            </div>
          )}

          {/* 返回課程列表 button */}
          <div className={styles.buttonContainer}>
            <button>
              <Link href={`/course`}>返回課程列表</Link>
            </button>
            {/* <button className={styles.orderButton}>
              <Link href={`/course/my-course-order`}>查看訂單</Link>
            </button> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
