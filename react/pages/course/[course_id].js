import React from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
// import DefaultLayout from '@/components/layout/default-layout'
import styles from '@/styles/course-detail.module.css'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

// icons
import { BiCalendar } from 'react-icons/bi'
import { BiTimeFive } from 'react-icons/bi'
import { BiMap } from 'react-icons/bi'
import { BiUser } from 'react-icons/bi'
import { BiSolidUser } from 'react-icons/bi'
import { FaLine } from 'react-icons/fa6' //用fa6
import { BiLogoFacebookCircle } from 'react-icons/bi'
import { FaXTwitter } from 'react-icons/fa6' //用fa6
import { BiSolidCopyAlt } from 'react-icons/bi'
// 實心圖
import { BiSolidHeart } from 'react-icons/bi'
// 空心圖
import { BiHeart } from 'react-icons/bi'

// components
import FavIcon from '@/components/layout/course/course-card/course-item/fav-icon'
import CourseCard from '@/components/layout/course/course-card/course-card'
// import MaybeLikeCourseCard from '@/components/layout/course/maybe-like-course-card/maybe-like-course-card'
import TeacherComment from '@/components/layout/course/teacher-comment/teacher-comment'
// import CourseFavIcon from '@/components/layout/course/course-fav-icon'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '@/hooks/use-cart'

// 後端
import { CS_DETAIL_ONE } from '@/components/my-const'
import { CS_COMMENT_THREE } from '@/components/my-const'
import Head from 'next/head'

export default function CourseDetail() {
  const { addItem, addItemAndChangePage } = useCart()
  const router = useRouter() // router 獲得動態路由
  const [data, setData] = useState({})
  const [comment, setComment] = useState([])
  const [fav, setFav] = useState(false) // fav-icon初始未收藏

  const toggleFav = () => {
    if (fav) {
      // 当前是收藏状态，即将取消收藏
      Swal.fire({
        toast: true,
        width: 300,
        position: 'top',
        icon: 'error',
        iconColor: '#80999C',
        title: '已將課程移除收藏',
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      // 当前未收藏，即将添加到收藏
      Swal.fire({
        toast: true,
        width: 300,
        position: 'top',
        icon: 'success',
        iconColor: '#ff804a',
        title: '課程已加入收藏',
        showConfirmButton: false,
        timer: 1500,
      })
    }
    setFav(!fav)
  }

  /* shin edit: [] ( 因為 data 是陣列，所以預設值不可以是下方物件 )
  {
    course_id: 0,
    course_name: '',
    course_date: '',
    course_intro: '',
    course_price: 0,
  }
  */
  // 照片
  let coursePhoto = data?.course_photo ? data.course_photo.split(',') : []
  const [mainPhoto, setMainPhoto] = useState([])

  console.log(mainPhoto)

  // 向伺服器要資料（shin）: 主要內容
  // course_id
  const getDetailData = async () => {
    console.log('一、router.query:', router.query)
    // let page = +router.query.page || 1
    // if (page < 1) page = 1

    try {
      const r = await fetch(CS_DETAIL_ONE + '/' + router.query.course_id)
      console.log('二、', r)

      const d = await r.json()
      console.log('三、', d)

      console.log('四、router.query:', router.query)

      setData(d.result)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 向伺服器要資料: 評論comment
  const getCommentData = async () => {
    try {
      const r = await fetch(CS_COMMENT_THREE + '/' + router.query.course_id)
      console.log('二、', r)

      const d = await r.json()
      console.log('三、', d)

      console.log('四、router.query:', router.query)

      setComment(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getDetailData()
    getCommentData()
  }, [router.query.course_id])

  // react 要寫保護機制，確保data資料有撈到，再去設定setMainPhoto
  useEffect(() => {
    setMainPhoto(coursePhoto[0])
  }, [data])

  console.log('五、router.query.course_id:', router.query.course_id)
  console.log('六、router.query:', router.query)
  // shin edit: .course_id
  // (要依據的是 router.query.course_id ( router.query.course_id:8 )，所以不可以是 router.query ( { router.query.course_id:8 } ))

  console.log('七、Data:', data)
  console.log('八、Comment:', comment)

  return (
    <>
      <Head>
        <title>SPACE ONE</title>
      </Head>
      <div>
        <Header />

        {/* <div>CourseList</div> */}

        {/* 麵包屑區塊 */}
        {/* <div>麵包屑區塊</div> */}

        {/* 主要資訊區 */}
        <div className={styles.main}>
          <div className="container">
            {/* <div className={styles.mapSection}> */}
            {data?.course_id && (
              <div className={styles.mapKey}>
                {/* sectionA：上方課程資訊 區塊 */}
                <div className={styles.sectionA}>
                  {/* 圖片區 */}
                  {coursePhoto.length && (
                    <div className={styles.coursePhotos}>
                      <Image
                        className={styles.cardPhoto}
                        // src={`/course/images/${
                        //   coursePhoto[0] ? mainPhoto : coursePhoto[0]
                        // }`}
                        src={`/course/images/${mainPhoto}`}
                        alt=""
                        width={500}
                        height={500}
                      />
                      <div className={styles.twoPhotos}>
                        <div
                          className={styles.leftPhoto}
                          onMouseEnter={() => setMainPhoto(coursePhoto[1])}
                          onMouseLeave={() => setMainPhoto(coursePhoto[0])}
                        >
                          <Image
                            className={styles.cardPhoto}
                            src={`/course/images/${coursePhoto[1]}`}
                            alt=""
                            width={238}
                            height={238}
                          />
                        </div>
                        <div
                          className={styles.rightPhoto}
                          onMouseEnter={() => setMainPhoto(coursePhoto[2])}
                          onMouseLeave={() => setMainPhoto(coursePhoto[0])}
                        >
                          <Image
                            className={styles.cardPhoto}
                            src={`/course/images/${coursePhoto[2]}`}
                            alt=""
                            width={238}
                            height={238}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* <div className={styles.carousel}>換圖輪播區</div> */}

                  {/* 文字介紹區 */}
                  <div className={styles.intro}>
                    <div
                      className={styles.cateIcon + ' ' + styles.colorDefault}
                    >
                      {data.category}
                    </div>
                    <div className={styles.h2 + ' ' + styles.courseName}>
                      {data.course_name}
                    </div>
                    <div
                      className={
                        styles.p6 +
                        ' ' +
                        styles.colorGary1 +
                        ' ' +
                        styles.courseIntro
                      }
                    >
                      {data.course_intro}
                    </div>

                    {/* 詳細資訊 */}
                    <div
                      className={
                        styles.info +
                        ' ' +
                        styles.t5En +
                        ' ' +
                        styles.colorBlack
                      }
                    >
                      {/* 日期 & 時間 */}
                      <div className={styles.dateAndTime}>
                        <div className={styles.date}>
                          <BiCalendar className={styles.infoIconStyle} />
                          {/* <div>12/25{dayjs(data.course_date).format("YYYY-MM-DD")}</div> */}
                          <div>
                            課程日期 ｜{' '}
                            {dayjs(data.course_date).format('MM/DD')}
                          </div>
                        </div>
                        <div className={styles.time}>
                          <BiTimeFive className={styles.infoIconStyle} />
                          <div>
                            課程開始時間 ｜{' '}
                            {dayjs(data.course_date).format('HH:mm')}
                          </div>
                        </div>
                      </div>
                      {/* 地點 */}
                      <div className={styles.location}>
                        <BiMap className={styles.infoIconStyle} />
                        <div>
                          課程地點 ｜ {data.place_name} - {data.address}
                        </div>
                      </div>
                      {/* 名額 */}
                      <div className={styles.peopleCount}>
                        <div className={styles.stillPeople}>
                          <BiUser className={styles.infoIconStyle} />
                          <div>剩餘名額 ｜</div>
                          <div
                            className={styles.colorDefault + ' ' + styles.t4En}
                          >
                            6
                          </div>
                        </div>
                        <div>／</div>
                        <div className={styles.totalPeople}>
                          <BiSolidUser className={styles.infoIconStyle} />
                          <div>總名額 ｜</div>
                          <div
                            className={styles.colorDefault + ' ' + styles.t4En}
                          >
                            {data.course_people}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 價格 & 收藏按鈕 */}
                    <div className={styles.priceAndFavicon}>
                      <div
                        className={
                          styles.moneyIconAndPrice +
                          ' ' +
                          styles.t2En +
                          ' ' +
                          styles.colorDark
                        }
                      >
                        <div>$</div>
                        <div>{data.course_price}</div>
                      </div>
                      <div className={styles.favicon}>
                        {/* <FavIcon /> */}
                        <div
                          role="presentation"
                          onClick={toggleFav}
                          style={{ cursor: 'pointer' }}
                        >
                          {fav ? <BiSolidHeart /> : <BiHeart />}
                        </div>
                      </div>
                    </div>
                    {/* 加入購物車按鈕 & 立即結帳按鈕 */}
                    <div className={styles.cartButtonAndBuyButton}>
                      <div className={styles.cartButton}>
                        {/* 加入購物車按鈕Button */}
                        <button
                          onClick={() => {
                            addItem(data)
                            console.log(data)
                          }}
                        >
                          加入購物車
                        </button>
                      </div>

                      {/* <Link href={`/course/course-cart`}>立即結帳</Link> */}

                      <div className={styles.cartButtonTwo}>
                        {/* 立即結帳 按鈕Button */}
                        <Link href={`/course/course-cart`}>
                          <button
                            onClick={() => {
                              addItemAndChangePage(data)
                              console.log(data)
                            }}
                          >
                            立即結帳
                          </button>
                        </Link>
                      </div>
                    </div>
                    {/* 社群分享 */}
                    {/* 
                    <div className={styles.shareIcons}>
                      <Link href="#">
                        <FaLine className={styles.shareIconsMargin} />
                      </Link>
                      <Link href="#">
                        <BiLogoFacebookCircle
                          className={styles.shareIconsMargin}
                        />
                      </Link>
                      <Link href="#">
                        <FaXTwitter className={styles.shareIconsMargin} />
                      </Link>
                      <div className={styles.shareIconsMargin}> | </div>
                      <Link href="#">
                        <div className={styles.copyLink}>
                          <BiSolidCopyAlt className={styles.shareIconsMargin} />
                          <div
                            className={styles.p6 + ' ' + styles.colorDefault}
                          >
                            複製連結
                          </div>
                        </div>
                      </Link>
                    </div>
                    */}
                  </div>
                </div>

                {/* sectionB：中間文字區 區塊 */}
                <div className={styles.sectionB}>
                  {/* 課程資訊（時間+地點） */}
                  <div>
                    <div className={styles.h3 + ' ' + styles.colorDefault}>
                      課程資訊
                    </div>
                    <ul className={styles.courseInfomationUL}>
                      <li>講師：{data.teacher_name}</li>
                      <li>
                        日期：{dayjs(data.course_date).format('YYYY/MM/DD')}
                      </li>
                      <li>
                        時間：{dayjs(data.course_date).format('HH:mm')} 開始
                      </li>
                      <li>時數：3 hr</li>
                      <li>
                        地點：{data.place_name} - {data.address}
                      </li>
                      <li>費用：${data.course_price}</li>

                      {/* <li>設備請於結帳時自行租借！</li> */}
                    </ul>
                  </div>

                  {/* 課程介紹（課程技巧+內容） */}
                  <div>
                    <div className={styles.h3 + ' ' + styles.colorDefault}>
                      課程介紹
                    </div>
                    <div>
                      {/* <div className={styles.h5}>課程技巧</div> */}
                      <div className={styles.courseIntroduceUL}>
                        {data.course_intro}
                      </div>
                      {/*<img
                        className={styles.coursePhoto}
                        src="/course/images/test-01.png"
                        alt=""
                      />*/}
                      <Image
                        className={styles.coursePhoto}
                        src={`/course/images/${coursePhoto[1]}`}
                        alt=""
                        width={500}
                        height={500}
                      />
                      <div></div>
                    </div>
                  </div>

                  {/* 教學單位／講師介紹 */}
                  <div className={styles.organizeAndTeacherSection}>
                    <div className={styles.h3 + ' ' + styles.colorDefault}>
                      教學單位／講師介紹
                    </div>
                    <div className={styles.teacherAndComment}>
                      <TeacherComment
                        teacher_name={data.teacher_name}
                        teacher_intro={data.teacher_intro}
                        teacher_photo={data.teacher_photo}
                        course_name={data.course_name}
                      />
                      {/* 評論區塊 */}
                      <div className={styles.comment}>
                        <div className={styles.h5}>給講師的建議</div>

                        {comment.length > 0 ? (
                          comment.map((v, i) => {
                            return (
                              <div key={v.course_order_id}>
                                <div className={styles.commentPhotoAndText}>
                                  <div className={styles.commentTextSection}>
                                    <div
                                      className={styles.userNameAndCreateDate}
                                    >
                                      <div className={styles.userName}>
                                        {v.member_name}
                                      </div>
                                      <div className={styles.studentCourseName}>
                                        上過的課｜{v.course_name}
                                      </div>
                                      <div className={styles.colorGary1}>
                                        {dayjs(v.last_update).format(
                                          'YYYY / MM / DD'
                                        )}
                                      </div>
                                    </div>
                                    <div className={styles.userStars}></div>
                                    <div className={styles.userCommentText}>
                                      {v.comment}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <p>尚無評價紀錄</p>
                        )}

                        {/* {comment.length &&
                          comment.map((v, i) => {
                            return (
                              <div key={v.course_order_id}>
                                <div className={styles.commentPhotoAndText}>
                                  <div className={styles.commentTextSection}>
                                    <div
                                      className={styles.userNameAndCreateDate}
                                    >
                                      <div className={styles.userName}>
                                        {v.member_name}
                                      </div>
                                      <div className={styles.colorGary1}>
                                        {dayjs(v.last_update).format(
                                          'YYYY / MM / DD'
                                        )}
                                      </div>
                                    </div>
                                    <div className={styles.userStars}></div>
                                    <div className={styles.userCommentText}>
                                      {v.comment}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })} */}
                      </div>
                    </div>
                  </div>

                  {/* 注意事項（Q&A）  */}
                  <div className={styles.notice}>
                    <div className={styles.h3 + ' ' + styles.colorDefault}>
                      注意事項（Q&A）
                    </div>
                    <ul>
                      <li>7 - 12歲學童須家長（監護人）全程陪同操作</li>
                      <li>65 - 80歲的長者須家人（監護人）全程陪同操作</li>
                      <li>視力嚴重模糊或有情緒障礙的朋友恕不開放參加課程</li>
                      <li>
                        附加服務項目如：電鍍、雷射刻字、鑲石可以現場決定再加購，但沒辦法於體驗當日帶回家，需要
                        5 - 7 個工作天，每一種附加項目皆須各別的 5 - 7
                        個工作天，如同時選擇兩個以上，工作時程須再累加
                      </li>
                      <li>
                        請避免穿太寬鬆的衣服，並穿包覆性良好的鞋子（不建議穿拖鞋／涼鞋），如果有留長髮請稍微綁一下，若留長指甲請在操作時注意自身安全
                      </li>
                      <li>請務必遵守簡介中防疫溫馨提醒</li>
                      <li>
                        天候影響：原則上不受天候影響；若有颱風等不可抗拒之天候因素，以縣市政府公佈之停班停課標準為依據，體驗者可以改期體驗或辦理退費，若體驗前或當天都無任何告知，視同放棄體驗，恕不退款
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
        {/* sectionC：下方猜你可能喜歡 區塊
        <div className={styles.sectionC}>
          <div className={styles.maybeLike}>猜你可能喜歡</div>
          <CourseCard />
          <MaybeLikeCourseCard />
          {/* <Link href={`/cs-1213/product/detail?pid=1`}>
                      {product.name}/{product.price}
                    </Link> 
        </div>*/}
        <Footer />
      </div>
    </>
  )
}
