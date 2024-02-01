import React from 'react'
import styles from '@/styles/CFCard.module.css'

const ProgressBar = (props) => {
  const { currentAmount, targetAmount } = props
  const percentage = (currentAmount / targetAmount) * 100

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.filler}
        style={{ width: `${percentage}%`, backgroundColor: '#80999C' }}
      />
      {/* <p className={styles.progressText}>{`${percentage.toFixed(0)}%`}</p> */}
    </div>
  )
}

export default ProgressBar
