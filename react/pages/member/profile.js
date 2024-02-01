import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/context/AuthContext'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { PROFILE } from '@/components/my-const'
import SubMenu from '@/components/layout/member/sub-menu'
import styles from '@/styles/member.module.css'
import { Layout } from '@/components/layout/layout'
import Link from 'next/link'

export default function Profile() {
  const [data, setData] = useState({}) // 暫存取得的資料

  const { auth } = useContext(AuthContext)
  const router = useRouter()
  useEffect(() => {
    const isLogin = localStorage.getItem('auth-space')
    if (!isLogin) {
      window.history.back()
    } else {
      // if (!auth.token) {
      //   router.push('/')
      // } else {
      fetch(PROFILE, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + auth.token,
        },
      })
        .then((r) => r.json())
        .then((result) => {
          if (result.success) {
            setData(result.data)
          }
          console.log(auth.token)
        })
        .catch((ex) => console.log(ex))
    }
  }, [auth.token])


  return (
    <>
      <Layout>
        <div className={styles.flex}>
          <SubMenu />
          <div className={styles.content}>
            <div className={styles.profile_container}>
              <div className={styles.section}>
                <div className={styles.label}>姓名：</div>
                <input value={data.name} disabled />
              </div>
              <div className={styles.section}>
                <div className={styles.label}>暱稱：</div>

                <input value={data.nickname} disabled />
              </div>
              <div className={styles.section}>
                <div className={styles.label}>email：</div>

                <input value={data.email} disabled />
              </div>
              <div className={styles.section}>
                <div className={styles.label}>電話：</div>

                <input value={data.phone} disabled />
              </div>
              <div className={styles.section}>
                <div className={styles.label}>生日：</div>

                <input
                  type="date"
                  value={dayjs(data.birthday).format('YYYY-MM-DD')}
                  disabled
                />
              </div>
              <div className={styles.section}>
                <div className={styles.label}>地址：</div>

                <input
                  value={
                    data.zip +
                    ' ' +
                    data.city +
                    ' ' +
                    data.area +
                    ' ' +
                    data.address
                  }
                  disabled
                />
              </div>
            </div>
            <Link className={styles.button} href="/member/edit" >
              <button >資料修改</button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  )
}