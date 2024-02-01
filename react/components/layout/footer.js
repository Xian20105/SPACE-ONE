import React from 'react'
import Link from 'next/link'
import styles from '@/styles/footer.module.css'
import LogoDark from '../icons/logo-dark'

export default function Footer() {
  const serviceItem = [
    {
      id: 0,
      item: '品牌願景',
      href: '#',
    },
    {
      id: 1,
      item: '暢遊方案',
      href: '#',
    },
    {
      id: 2,
      item: '加入合作',
      href: '#',
    },
    {
      id: 3,
      item: '常見問題',
      href: '#',
    },
  ]
  const memberItem = [
    {
      id: 0,
      item: '會員條款',
      href: '#',
    },
    {
      id: 1,
      item: '隱私保護政策',
      href: '#',
    },
    {
      id: 2,
      item: '加入合作',
      href: '#',
    },
    {
      id: 3,
      item: '常見問題',
      href: '#',
    },
  ]
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.top}>
          <div className={styles.logo}>
            <Link href="/">
              <LogoDark />
            </Link>
            <div>讓每次推開門都成為一段絕無僅有的美好時光</div>
          </div>
          <div className={styles.logo_mobile}>
            <Link href="/">
              <LogoDark type="mobile" />
            </Link>
          </div>
          <div className={styles.info}>
            <p className={styles.title}>SPACE ONE</p>
            <ul>
              <li>address: 台北市復興南路一段390號2樓</li>
              <li>tel: (02) 6631-6588</li>
              <li>mail: iservice@ispan.com.tw</li>
            </ul>
          </div>
          <div className={styles.content}>
            <div>
              <p className={styles.title}>Service</p>
              <ul>
                {serviceItem.map((v, i) => {
                  return (
                    <Link key={v.id} href={v.href}>
                      <li>{v.item}</li>
                    </Link>
                  )
                })}
              </ul>
            </div>
            <div>
              <p className={styles.title}>Member</p>
              <ul>
                {memberItem.map((v, i) => {
                  return (
                    <Link key={v.id} href={v.href}>
                      <li>{v.item}</li>
                    </Link>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        <p className={styles.copyright}>Copyright©2023 Space One</p>
      </div>
    </>
  )
}