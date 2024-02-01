import React from 'react'
import styles from '@/styles/AddCard.module.css'
import Image from 'next/image'

export default function AddCard() {
  return (
    <>
      <div className={styles.addCardContainer}>
        <Image
          variant="top"
          src="/exhibition/1.jpeg"
          alt="Sheep"
          width={250}
          height={160}
          style={{ borderRadius: 10, objectFit: 'cover' }}
        />
        <div className={styles.textGroup}>
          <p className={styles.addCardText}>森林漫步｜雷射貼紙</p>
          <p className={styles.alreadyPrice}>$ 9,999</p>
          <div className={styles.sponsor}>被贊助5次</div>
        </div>

        <div className={styles.sponsorContent}>
          森林漫步貼紙一組（六入）
          <br />
          單日入場卷一份
        </div>
        <div className={styles.cardButton}>
          <button>贊助</button>
        </div>
      </div>
    </>
  )
}
