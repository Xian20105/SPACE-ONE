import React from 'react'
import styles from '@/styles/star-icon.module.css'

import { BiSolidStar } from 'react-icons/bi'

export default function StarIcon() {
  return (
    <>
      <BiSolidStar className={styles.Star} />
    </>
  )
}
