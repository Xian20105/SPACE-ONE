import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from '@/styles/exhibition.module.css'
import { EX_LIST } from '@/components/my-const'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import Carousel from '@/components/layout/exhibition/Carousel'
import ExCard from '@/components/layout/exhibition/ExCard'
import CFCard from '@/components/layout/exhibition/CFCard'

export default function ExhibitionNews() {
  const [data, setData] = useState({})
  const router = useRouter()

  const getListData = async () => {
    let page = +router.query.page || 1
    if (page < 1) page = 1
    try {
      const r = await fetch(EX_LIST + `?page=${page}`)
      const d = await r.json()
      setData(d)
    } catch (ex) {
      console.error(ex)
    }
  }

  useEffect(() => {
    getListData()
  }, [router.query.page])

  const cardsElems = data.rows
    ? data.rows
        .slice(0, 9)
        .map((exhibition) => (
          <CFCard key={exhibition.exhibition_id} exhibition={exhibition} />
        ))
    : null

  return (
    <>
      <Header />
      <div>
        {/* <div className={styles.breadcrumbs}>
          <p style={{ fontSize: 16, color: '#487378' }}>
            首頁 展覽與募資 最新消息
          </p>
        </div> */}
        <div className={styles.wall}>
        <Carousel />
        </div>
      </div>
      <div className={styles.section1}>
        <div className={styles.title1}>
          <div className={styles.titleGroup}>
            <p className={styles.CFtitle}>CROWDFUNDING</p>
            <p className={styles.CFsubtitle}>群眾募資</p>
          </div>
        </div>
        <div className={styles.CFgroup}>{cardsElems}</div>
        <Link href={`/exhibition/cf`}>
          <button>view more</button>
        </Link>
      </div>
      <div className={styles.section2}>
        <div className={styles.ExCardTitle}>
          <div className={styles.title2}>
            <p className={styles.ExTitle}>N E W S</p>
            <p className={styles.ExSubtitle}>最新消息</p>
          </div>
        </div>
        <div className={styles.ExCardGroup}>
          {data.rows && <ExCard exhibitions={data.rows} />}
        </div>
      </div>
      <Footer />
    </>
  )
}
