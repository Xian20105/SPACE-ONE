import React from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

import styles from '@/styles/course.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { CS_LIST } from '@/components/my-const'

// components
import CateButton from '@/components/layout/course/cate-button/cate-button'
import CateButtonOne from '@/components/layout/course/cate-button/cate-button-one'
import CourseListCarousel from '@/components/layout/course/course-carousel/course-list-carousel'
import CourseCard from '@/components/layout/course/course-card/course-card'
import Head from 'next/head'

export default function CourseIndex() {
  const [data, setData] = useState([])
  const router = useRouter()

  const getListData = async () => {
    const usp = new URLSearchParams(router.query)
    console.log('index.js的usp:', usp)
    console.log('router.query:', router.query)

    let page = +router.query.page || 1

    // 關鍵字搜尋
    let keyword = router.query.keyword || ''

    if (page < 1) page = 1
    try {
      // const r = await fetch(CS_LIST + `?page=${page}`) // 原本寫的
      const r = await fetch(CS_LIST + `?${usp.toString()}`)
      console.log('r', r)

      const d = await r.json()
      console.log('d', d)

      setData(d)
    } catch (ex) {}
  }

  useEffect(() => {
    getListData()
  }, [router.query.page, router.query.keyword, router.query.category])
  /*
  return () => {
      router.push('/course', undefined, { shallow: true })
    }
  */
  console.log(data)
  console.log(router.query.page)
  console.log(router.query.keyword)
  console.log(router.query.category)

  return (
    <>
    <Head>
        <title>SPACE ONE</title>
      </Head>
      <Header />
      {/* <div>CourseIndex</div> */}

      {/* 麵包屑區塊 */}
      {/* <div>麵包屑區塊</div> */}

      {/* 換圖輪播區塊 */}
      <div className={styles.courseListCarousel}>

      <CourseListCarousel />
      </div>

      {/* 課程類別
      <div className={styles.cateButtonSection}>
        <div className={styles.cate}>
          <Link href="#">
            <CateButton
              onClick={(e) => {
                router.push(
                  {
                    pathname: '/course',
                    query: { ...router.query, category_id: 1 },
                  },
                  undefined,
                  { scroll: false }
                )
              }}
            />
          </Link>

          <CateButtonOne />

          <Link href="#"></Link>
          <Link href="#">
            <CateButton text={'刺繡'} />
          </Link>
          <Link href="#">
            <CateButton text={'花藝'} />
          </Link>
          <Link href="#">
            <CateButton text={'蠟燭'} />
          </Link>
        </div>
      </div> */}

      {/* 主要內容區塊 */}
      <div className={styles.main}>
        <div className="container">
          {/* 大標 & 搜尋 & 排序 & tabBar */}
          <div className={styles.titleSection}>
            <div className={styles.bigTitle}>
              <div className={styles.t2En + ' ' + styles.colorDefault}>
                C O U R S E
              </div>
              <div className={styles.p5}>課程</div>
            </div>
            <div className={styles.searchAndSort}>
              {/* 搜尋 */}
              {/* <input type="text" placeholder="搜尋商品的Components" /> */}
              <input
                type="text"
                className={styles.csSearch}
                id="csSearch"
                placeholder="請輸入課程關鍵字"
                name="keyword"
                // value={router.query.keyword}
                onChange={(e) => {
                  router.push(
                    {
                      pathname: '/course',
                      query: { ...router.query, keyword: e.target.value },
                    },
                    undefined,
                    { scroll: false }
                  )
                }}
              />

              {/* 排序 */}
              {/* <input type="text" placeholder="排序方式的Components" /> */}
            </div>
          </div>

          {/* 課程卡片們 */}
          <div className={styles.cardSection}>
            <div className={styles.cards}>
              {/* 要加 rows (rows 是固定的) */}
              {data.rows &&
                data.rows.map((v, i) => {
                  return (
                    <div className={styles.card} key={v.course_id}>
                      {/* 前端的路由是依照前端react course的資料夾進去，不要加detail */}
                      <CourseCard
                        course_id={v.course_id}
                        course_date={dayjs(v.course_date).format('MM/DD')}
                        course_name={v.course_name}
                        course_price={v.course_price}
                        course_photo={v.course_photo}
                      />
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
