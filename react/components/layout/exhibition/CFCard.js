import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/CFCard.module.css'
import ProgressBar from '@/components/layout/exhibition/ProgressBar'
import BlogFavIcon from '@/components/layout/exhibition/BlogFavIcon'
import { BiSolidHourglassTop } from 'react-icons/bi'

export default function CFCard({ exhibition, isLiked, handleLikedClick }) {
  //--- progress Bar狀態 ---
  const [currentAmount, setCurrentAmount] = useState() // 目前金額
  const [targetAmount, setTargetAmount] = useState() // 目標金額

  //--- 計算剩餘天數的狀態 ---
  const [daysRemaining, setDaysRemaining] = useState(0) //計算剩下天數

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAmount((prevAmount) =>
        prevAmount >= targetAmount ? 0 : prevAmount
      )
    }, 10)

    return () => clearInterval(interval)
  }, [targetAmount, currentAmount])
  // 計算進度百分比
  const progress = (currentAmount / targetAmount) * 100

  // --- 計算剩餘天數 ---
  useEffect(() => {
    if (exhibition && exhibition.end_time) {
      const endTime = new Date(exhibition.end_time).getTime()
      const currentTime = new Date().getTime()
      const timeDiff = endTime - currentTime
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
      setDaysRemaining(daysRemaining)
    }
  }, [exhibition])

  useEffect(() => {
    setCurrentAmount(exhibition.total_price)
    setTargetAmount(exhibition.exhibition_target)
    // console.log('eddie',exhibition.exhibition_photo.split(',')[0]);
  }, [exhibition])

  return (
    <div className={styles.CFCard}>
      {exhibition && (
        <div key={exhibition.exhibition_id}>
          <div role="presentation" className={styles.love}>
            <BlogFavIcon exhibition_id={exhibition.exhibition_id} />
          </div>
          <Link href={`/exhibition/cf/${exhibition.exhibition_id}`}>
            <Image
              variant="top"
              src={`/exhibition/${exhibition.exhibition_photo.split(',')[0]}`}
              alt="Sheep"
              width={300}
              height={300}
              style={{ borderRadius: 10, objectFit: 'cover' }}
            />
            <div className={styles.title}>
              <h2 className={styles.CardTitle}>{exhibition.exhibition_name}</h2>
            </div>
            <div className={styles.container}>
              <div className={styles.bar}>
                <ProgressBar
                  currentAmount={currentAmount}
                  targetAmount={targetAmount}
                />
              </div>
              <p className={styles.barText}>{progress.toFixed(0)}%</p>
            </div>
            <div className={styles.priceContainer}>
              <div>
                <p className={styles.priceText}>
                  {'$' + exhibition.total_price}
                </p>
              </div>
              <div className={styles.date}>
                <div className={styles.hourglass}>
                  <BiSolidHourglassTop
                    style={{ fontSize: 22, color: '#80999C' }}
                  />
                </div>
                <p className={styles.dayText}>{`${daysRemaining}天`}</p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
