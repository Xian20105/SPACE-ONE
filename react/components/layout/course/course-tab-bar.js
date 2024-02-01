import React from 'react'
import styles from '@/styles/course-tab-bar.module.css'

export default function CourseTabBar({ text = 'CourseTabBar' }) {
  return (
    <>
      <div className={styles.courseTabBar}>{text}</div>
    </>
  )
}
