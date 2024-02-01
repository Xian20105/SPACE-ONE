import React from 'react'
import styles from '@/styles/collection.module.css'

export default function CollectionCard({ data }) {
  console.log('def', data)
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div className={styles.section}>
        <div className={styles.label}></div>
        <div style={{ marginRight: '20px' }}>{data.exhibition_id}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>|</div>
        <input value={data.exhibition_name} disabled />
      </div>
    </div>
  )
}
