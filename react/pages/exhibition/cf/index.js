import React, { useState } from 'react'
import styles from '@/styles/exhibition-CFlist.module.css'
import { Layout } from '@/components/layout/layout'
// import Header from '@/components/layout/header'
// import Footer from '@/components/layout/footer'
import CateButton from '@/components/layout/exhibition/ex-cate-button'
import InfiniteScrollComponent from '@/components/layout/exhibition/InfiniteScroll'
import { PiFlowerTulipBold } from 'react-icons/pi'
import { RiCandleLine } from 'react-icons/ri'
import { TbNeedleThread } from 'react-icons/tb'
import { AiOutlineHome } from 'react-icons/ai'
import { GiSewingMachine } from 'react-icons/gi'

export default function CfList() {
  const [type, setType] = useState(0)

  return (
    <>
      <Layout>
        <div className={styles.cateButtonSection}>
          <div className={styles.cate}>
            <button onClick={() => setType(0)}>
              <CateButton text={'全部'} icon={<AiOutlineHome />} />
            </button>
            <button onClick={() => setType(1)}>
              <CateButton text={'縫紉'} icon={<GiSewingMachine />} />
            </button>
            <button onClick={() => setType(2)}>
              <CateButton text={'刺繡'} icon={<TbNeedleThread />} />
            </button>
            <button onClick={() => setType(3)}>
              <CateButton text={'花藝'} icon={<PiFlowerTulipBold />} />
            </button>
            <button onClick={() => setType(4)}>
              <CateButton text={'蠟燭'} icon={<RiCandleLine />} />
            </button>
          </div>
        </div>
        {/* <div className={styles.dropDown}>drop down menu</div> */}
        <div className={styles.section1}>
          <div className={styles.title1}>
            <p className={styles.CFtitle}>CROWDFUNDING</p>
            <p className={styles.CFsubtitle}>群眾募資</p>
          </div>
          <div className={styles.CFgroup}>
            <InfiniteScrollComponent
              type={type}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}
