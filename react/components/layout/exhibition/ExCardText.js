import React from 'react'
import styles from '@/styles/ExCard.module.css'

export default function ExCardText({ exhibition, onMouseEnter, onMouseLeave }) {
  const formattedDate = formatExhibitionDate(exhibition.start_time)

  function formatExhibitionDate(dateString) {
    try {
      const dateObject = new Date(dateString)
      return dateObject.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    } catch (error) {
      console.error('Invalid date format:', dateString)
      return 'Invalid Date'
    }
  }

  return (
    <>
      <div
        className={styles.TextSection}
        onMouseEnter={() => onMouseEnter(exhibition)}
        onMouseLeave={onMouseLeave}
      >
        <p className={styles.date}>{formattedDate}</p>
        <p className={styles.content}>{exhibition.exhibition_intro}</p>
        <div className={styles.SolidLine}></div>
      </div>
    </>
  )
}
