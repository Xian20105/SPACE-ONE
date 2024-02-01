import { useContext } from 'react'
import Link from 'next/link'
import styles from '@/styles/header.module.css'
import { BiCartAlt } from 'react-icons/bi'
import LogoLight from '../icons/logo-light'
import LogoDark from '../icons/logo-dark'

import AuthContext from '@/context/AuthContext'

export default function Header() {
  const { auth, logout } = useContext(AuthContext)

  const menuItem = [
    {
      id: 0,
      title: 'Space',
      href: '/space',
    },
    {
      id: 1,
      title: 'Exhibition',
      href: '/exhibition',
    },
    {
      id: 2,
      title: 'Course',
      href: '/course',
    },
    {
      id: 3,
      title: 'Product',
      href: '/product',
    },
  ]

  return (
    <div className={styles.header}>
      <Link href="/" className={styles.logo}>
        <LogoLight />
      </Link>
      <Link href="/" className={styles.logo_mobile}>
        <LogoDark type="mobile" />
      </Link>
      <div className={styles.nav}>
        
        <div className={styles.icon}>
          <Link href="/product/productCart">
            <BiCartAlt size={32} className={styles.cart} />
          </Link>
          <input
            type="checkbox"
            id="menu_toggle"
            className={styles.menu_toggle}
          />
          <label htmlFor="menu_toggle" className={styles.menu_button_container}>
            <div className={styles.menu_button}></div>
          </label>
          <ul className={styles.menu}>
          {menuItem.map((v, i) => {
            return (
              <li
                key={v.id}
                className={styles.menuitem}
                style={{ marginRight: i !== menuItem.length - 1 ? 25 : 0 }}
              >
                <Link href={v.href} className={styles.link}>
                  {v.title}
                </Link>
              </li>
            )
          })}
        </ul>
        </div>
        {auth.email ? (
          <>
            <Link href="/member/profile">
              <p className={styles.nickname}>{auth.nickname}</p>
            </Link>
            <button
              className={styles.login}
              onClick={(e) => {
                e.preventDefault()
                logout()
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className={styles.login}>Login</button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}