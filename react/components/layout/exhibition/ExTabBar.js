import React from 'react'
import styles from '@/styles/ExTabBar.module.css'

export default function ExTabBar({ text, onClick }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick()
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex="0"
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.ExTabBar}>{text}</div>
      </div>
    </>
  )
}
