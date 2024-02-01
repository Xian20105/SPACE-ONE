import React from 'react'
import styles from '@/styles/cart-list.module.css'
import Image from 'next/image'

import { useEffect, useState } from 'react'

export default function CartList({ items = [], remove, type = [] }) {
  // export default function CartList({ items, remove }) {
  console.log('一、cart-list: items:', items)
  // CartList 要接收items，並 map 出來

  return (
    <>
      <div className={styles.courseCartList}>
        {items.map((v, i) => {
          return (
            <div key={v.course_id} className={styles.courseCartListItem}>
              <div className={styles.textSection}>
                <Image
                  className={styles.coursePhoto}
                  src={`/course/images/${v.course_photo.split(',')[0]}`}
                  alt=""
                  width={200}
                  height={200}
                />
                <div className={styles.NameAndPrice}>
                  <div className={styles.courseName}>{v.course_name}</div>
                  <div className={styles.coursePrice}>＄ {v.course_price}</div>
                </div>
                <div className={styles.removeButton}>
                  {/* 用以下判斷狀態，判斷"remove的button"呈現，或是不呈現 */}
                  {type === 'cart' ? (
                    <button
                      onClick={() => {
                        remove(items, v.course_id)
                      }}
                    >
                      移除
                    </button>
                  ) : (
                    []
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
