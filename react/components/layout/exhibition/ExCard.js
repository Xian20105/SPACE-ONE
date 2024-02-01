import { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/ExCard.module.css'
import ExCardText from './ExCardText'

export default function ExCard({ exhibitions = [] }) {
  const handleMouseEnter = (data) => {
    setPhotoSrc(data.exhibition_photo.split(',')[0])
  }

  const handleMouseLeave = () => {
    setPhotoSrc(exhibitions[0]?.exhibition_photo.split(',')[0])
  }

  // 截取前三個
  const displayedExhibitions = exhibitions.slice(0, 3)

  // 圖片狀態
  const [photoSrc, setPhotoSrc] = useState(
    exhibitions[0]?.exhibition_photo.split(',')[0]
  )

  return (
    <div className={styles.ExCard}>
      <Image
        className={styles.ExCardImg}
        src={`/exhibition/${photoSrc}`}
        alt="img"
        width={450}
        height={300}
      />
      <div className={styles.textGroup}>
        {displayedExhibitions.map((exhibition) => (
          <ExCardText
            key={exhibition.exhibition_id}
            exhibition={exhibition}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  )
}
