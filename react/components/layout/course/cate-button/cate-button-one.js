import React from 'react'
import styles from '@/styles/cate-button.module.css'
import { useEffect, useState } from 'react'
import { CS_CATE_ONE } from '@/components/my-const'

export default function CateButtonOne({ text = '01.縫紉' }) {
  const [data, setData] = useState([])

  const getCateOneData = async () => {
    const r = await fetch(CS_CATE_ONE)
    console.log('CateButtonOne-r', r)
    const d = await r.json()
    console.log('CateButtonOne-d', d)

    setData(d)
  }

  /*
  useEffect(() => {
    getCateOneData()
  }, [])
  */

  console.log('CateButtonOne-data', data)

  return (
    <>
      {/* test */}
      <div
        onClick={() => {
          getCateOneData()
        }}
        className={styles.cateButton}
      >
        <div className={styles.cateButtonCircle}>
          <div className={styles.cateButtonIcon}></div>
          {/* test */}
          <div>
            {data.length &&
              data.map((v, i) => {
                return (
                  <div key={v.course_id}>
                    <div>測試撈course_id:{v.course_id}</div>
                    <div>course_name:{v.course_name}</div>
                  </div>
                )
              })}
          </div>
        </div>
        <div className={styles.cateButtonText}>{text}</div>
      </div>
    </>
  )
}
