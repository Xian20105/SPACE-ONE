import React from 'react'
import Header from '@/components/layout/header.js'
import Footer from '@/components/layout/footer.js'
import styles from '@/styles/my-course-order.module.css'
import Link from 'next/link'
import dayjs from 'dayjs'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CS_MY_ORDER } from '@/components/my-const'
import Head from 'next/head'

export default function Cart() {
  const [data, setData] = useState([])
  const router = useRouter()

  const getMyCourseOrderData = async () => {
    let page = +router.query.page || 1

    try {
      // const r = await fetch(CS_LIST + `?page=${page}`) // 原本寫的
      const r = await fetch(CS_MY_ORDER + `?page=${page}`)
      console.log('r', r)

      const d = await r.json()
      console.log('d', d)

      setData(d)
    } catch (ex) {}
  }

  useEffect(() => {
    getMyCourseOrderData()
  }, [router.query.page])
  /*
  return () => {
      router.push('/course', undefined, { shallow: true })
    }
  */
  console.log(data)

  // 預處理資料，將相同的 course_order_id 分組
  const groupedData = {}
  data.forEach((item) => {
    if (!groupedData[item.course_order_id]) {
      groupedData[item.course_order_id] = []
    }
    groupedData[item.course_order_id].push(item)
  })

  return (
    <>
      <Head>
        <title>SPACE ONE</title>
      </Head>
      <Header />
      <div className={styles.main}>
        <div className={styles.Order}>訂單紀錄</div>

        {/* 主要內容區塊 */}
        <div className={styles.OrderSection}>
          {Object.keys(groupedData)
            .sort((a, b) => b - a) // 降冪排序
            .map((orderId) => {
              const orderItems = groupedData[orderId]

              // 計算總價格
              const total = orderItems.reduce(
                (accumulator, currentItem) =>
                  accumulator + currentItem.course_price,
                0
              )

              return (
                <div key={orderId} className={styles.mapKey}>
                  <div className={styles.updateTimeAndTotalPrice}>
                    <div className={styles.updateTime}>
                      訂單編號：2308232024012212{orderId}
                    </div>
                    <div className={styles.totalPrice}>
                      <div className={styles.title}>總計：＄</div>
                      <div className={styles.price}>{total}</div>
                    </div>
                  </div>

                  {/* 購買明細 */}
                  <div className={styles.shoppingDetail}>
                    {orderItems.map((v, i) => (
                      <div
                        key={v.course_order_id}
                        className={styles.courseCartListItem}
                      >
                        <div className={styles.textSection}>
                          {/* <div>{v.course_order_id}</div> */}
                          <Image
                            className={styles.coursePhoto}
                            src={`/course/images/${
                              v.course_photo.split(',')[0]
                            }`}
                            alt=""
                            width={200}
                            height={200}
                          />
                          <div className={styles.NameAndPrice}>
                            <div className={styles.courseName}>
                              {v.course_name}
                            </div>
                            <div className={styles.coursePrice}>
                              ＄ {v.course_price}
                            </div>
                          </div>
                          {/* 評價講師 button */}
                          <div className={styles.teacherButton}>
                            <button>
                              <Link href={`/course/evaluation`}>
                                填寫講師建議
                              </Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <hr></hr>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button>
          <Link href={`/course`}>返回課程列表</Link>
        </button>
      </div>
      <Footer />
    </>
  )
}

//   return (
//     <>
//       <Header />
//       <div className={styles.main}>
//         <div className={styles.Order}>訂單紀錄</div>

//         {/* <div className={styles.card} key={v.member_id}>
//           <div>{v.course_id}</div>
//           <div>{v.course_name}</div>
//           <Image
//             className={styles.coursePhoto}
//             src={`/course/images/${v.course_photo.split(',')[0]}`}
//             alt=""
//             width={200}
//             height={200}
//           />
//           <div>{v.course_price}</div>
//           <div>{dayjs(v.course_date).format('MM/DD')}</div>
//         </div> */}

//         {/* 主要內容區塊 */}
//         <div className={styles.OrderSection}>
//           <div className={styles.updateTimeAndTotalPrice}>
//             {/* <div className={styles.updateTime}>訂單成立時間：YYYY/MM/DD</div> */}
//             <div className={styles.updateTime}>
//               訂單編號：230823202401221225
//             </div>
//             <div className={styles.totalPrice}>
//               <div className={styles.title}>總計：＄</div>
//               <div className={styles.price}>?????</div>
//             </div>
//           </div>

//           {/* 購買明細 */}
//           <div className={styles.shoppingDetail}>
//             <div>
//               {/* 測試 */}
//               {data.length &&
//                 data.map((v, i) => {
//                   return (
//                     <div
//                       key={v.course_order_id}
//                       className={styles.courseCartListItem}
//                     >
//                       <div className={styles.textSection}>
//                         <div>{v.course_order_id}</div>
//                         <Image
//                           className={styles.coursePhoto}
//                           src={`/course/images/${v.course_photo.split(',')[0]}`}
//                           alt=""
//                           width={200}
//                           height={200}
//                         />
//                         <div className={styles.NameAndPrice}>
//                           <div className={styles.courseName}>
//                             {v.course_name}
//                           </div>
//                           <div className={styles.coursePrice}>
//                             ＄ {v.course_price}
//                           </div>
//                         </div>
//                         {/* 評價講師 button */}
//                         <div className={styles.teacherButton}>
//                           <button>
//                             <Link href={`/course/evaluation`}>給講師建議</Link>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   )
// }
