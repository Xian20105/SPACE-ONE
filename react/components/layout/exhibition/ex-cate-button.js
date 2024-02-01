import React from 'react'
import styles from '@/styles/ex-cate-button.module.css'

export default function CateButton({ text = 'cateButton', icon }) {
  return (
    <>
      <div className={styles.cateButton}>
        <div className={styles.cateButtonCircle}>
          {icon && <span className={styles.cateButtonIcon}>{icon}</span>}
        </div>
        <div className={styles.cateButtonText}>{text}</div>
      </div>
    </>
  )
}
