import React from 'react'
import styles from '@/styles/Comment.module.css'

export default function User({ data }) {
  return (
    <div className={styles.container}>
      <div className={styles.userGroup}>
        <div className={styles.user}>{data.name}</div>
        <div className={styles.icon1}>贊助者</div>
      </div>
      <div className={styles.timeGroup}>
        <div className={styles.content}>{data.comment}</div>
        <div className={styles.time}>{data.create_date}</div>
      </div>
    </div>
  )
}
