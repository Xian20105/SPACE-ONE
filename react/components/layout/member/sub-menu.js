import React from 'react'
import Link from 'next/link'
import styles from '@/styles/submenu.module.css'

export default function SubMenu() {
  const menuItem = [
    {
      id: 0,
      title: '會員資料',
      href: '/member/profile',
    },
    {
      id: 1,
      title: '空間預訂',
      href: '/member/space-order',
    },
    {
      id: 2,
      title: '展覽收藏',
      href: '/member/collection',
    },
    {
      id: 2,
      title: '課程訂單',
      href: '/course/my-course-order',
    },
  ]
  return (
    <div className={styles.submenu}>
      <h2>會員中心</h2>
      {menuItem.map((v, i) => {
        return (
          <Link key={v.id} href={v.href}>
            <div className={styles.menuitem}>{v.title}</div>
          </Link>
        )
      })}
    </div>
  )
}
