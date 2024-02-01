import React from 'react'
import styles from '@/styles/cate-button.module.css'

export default function CateButton({ text = '全部課程' }) {
  return (
    <>
      <div className={styles.cateButton}>
        <div className={styles.cateButtonCircle}>
          <div className={styles.cateButtonIcon}></div>
        </div>
        <div className={styles.cateButtonText}>{text}</div>
      </div>
    </>
  )
}
