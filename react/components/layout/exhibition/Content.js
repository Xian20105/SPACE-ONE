import Image from 'next/image'
import styles from '@/styles/exhibition-CFdetail.module.css'
import AddCard from '@/components/layout/exhibition/AddCard'

export default function CFcontent({ photo, data }) {
  const addElems = data.rows
    ? data.rows
        .slice(0, 3)
        .map((reward) => <AddCard key={reward.reward_id} reward={reward} />)
    : null
  return (
    <>
      <div id="content">
        <div className={styles.contentContainer}>
          <div className={styles.contentLeft}>
            <div className={styles.contentTitle}>{data.exhibition_name}</div>
            <p className={styles.downContentText}>{data.exhibition_desc}</p>
            <Image
              variant="top"
              src={`/exhibition/${photo[1]}`}
              alt="Sheep"
              width={1000}
              height={700}
              style={{ borderRadius: 10, objectFit: 'cover' }}
              priority
            />
            <p className={styles.downContentText}>{data.section_one}</p>
            <Image
              variant="top"
              src={`/exhibition/${photo[2]}`}
              alt="Sheep"
              width={1000}
              height={700}
              style={{ borderRadius: 10, objectFit: 'cover' }}
              priority
            />

            <p className={styles.downContentText}>{data.section_two}</p>
            <div className={styles.subtitle}>風險與挑戰</div>
            <div className={styles.rule}>
              ▪️
              產品顏色可能因燈光、螢幕設定或裝置呈現而有些許差異，實際顏色以實品為主。
              <br />
              ▪️
              募資結束後，我們將依下單順序陸續出貨到所有贊助者手中，後續進度將會持續更新。
              <br />
              ▪️
              計畫有眾多變數，本團隊會盡最大努力在預計時間內出貨，但仍可能有非預期事件（如：生產意外、清關延誤、物流延遲等）導致出貨延後。當您贊助此計畫即同意承擔此風險，並也接受各種可能延遲出貨之變因。
            </div>
          </div>
          {/* 右側卡片 */}
          {/* <AddCard /> */}
          {/* <div className={styles.containerRight}>{addElems}</div> */}
        </div>
      </div>
    </>
  )
}
