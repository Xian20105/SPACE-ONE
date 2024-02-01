import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/context/AuthContext'
// import dayjs from 'dayjs'
import { COLLECTION } from '@/components/my-const'
import SubMenu from '@/components/layout/member/sub-menu'
import styles from '@/styles/collection.module.css'
import { Layout } from '@/components/layout/layout'
// import Link from 'next/link'
import CollectionCard from '@/components/layout/exhibition/CollectionCard'

export default function Collection() {
  const [data, setData] = useState({
    exhibition_id: '',
    exhibition_name: '',
  })

  console.log('abc', data)

  const { auth } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    const isLogin = localStorage.getItem('auth-space')
    const mid = auth.member_id
    if (!isLogin) {
      // window.history.back();
    } else {
      console.log(isLogin, 'eddie')
      fetch(
        `${COLLECTION}/${mid}`
        //   {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: 'Bearer ' + auth.token,
        //   },
        //   // 將 body 的內容放在這裡
        //   body: JSON.stringify({
        //     member_id: auth.member_id,
        //   }),
        // }
      )
        .then((r) => r.json())
        .then((result) => {
          console.log(result)
          if (result.success) {
            setData(result.data)
          }
        })
        .catch((ex) => console.log(ex))
    }
  }, [auth.member_id])

  return (
    <>
      <Layout>
        <div className={styles.flex}>
          <SubMenu />
          <div className={styles.content}>
            {data?.length > 0 &&
              data.map((v, i) => {
                return <CollectionCard key={i} data={v} />
              })}
          </div>
        </div>
      </Layout>
    </>
  )
}
