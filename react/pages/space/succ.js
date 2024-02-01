import React from 'react'
import styles from '@/styles/space_succ.module.css'
import Link from 'next/link'
import { Layout } from '@/components/layout/layout'

export default function NewCourseOrder() {
  return (
    <>
      <Layout>
        {/* 主要內容區塊 */}
        <div className={styles.orderSection}>
          <div className={styles.courseOrderOk}>訂單已成立！</div>

          <div className={styles.buttonContainer}>
            <button>
              <Link href={`/member/space-order`}>前往訂單</Link>
            </button>
          </div>
        </div>
      </Layout>
    </>
  )
}
