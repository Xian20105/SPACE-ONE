import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/context/AuthContext'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { S_GET_ORDER_ONE } from '@/components/my-const'
import SubMenu from '@/components/layout/member/sub-menu'
import styles from '@/styles/member.module.css'
import { Layout } from '@/components/layout/layout'

export default function SpaceOrder() {
  const [data, setData] = useState([]) // 暫存取得的資料

  const { auth } = useContext(AuthContext)
  useEffect(() => {
    const isLogin = localStorage.getItem('auth-space')
    if (!isLogin) {
      window.history.back()
    } else {
      fetch(S_GET_ORDER_ONE, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + auth.token,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.success) {
            console.log('error')
          } else {
            console.log(data)
            setData([...data.rows])
          }
        })
        .catch((ex) => console.log(ex))
    }
  }, [])

  return (
    <>
      <Layout>
        <div className={styles.flex}>
          <SubMenu />
          <div className={styles.content}>
            <div className={styles.container}>
              {data.length > -1 ? '' : '目前沒有訂單'}
              {data.length > -1 &&
                data.map((v, i) => {
                  return (
                    <div key={i} className={styles.list}>
                        <img src={`/space/${v.cover}`} className={styles.img} />
                      <div className={styles.info}>
                        <div>{v.space}</div>
                        {dayjs(v.start_time).format('YYYY/MM/DD')} <br/>{dayjs(v.start_time).format('hh:mm A')}{' '}至{' '}
                        {dayjs(v.start_time)
                          .add(v.time * 30, 'm')
                          .format('hh:mm A')}
                      </div>
                      <div className={styles.info}>
                        <div>訂單編號：SS{dayjs(v.timestamp).format('YYYYMMDD')+v.uuid.substr(0,5)}</div>
                        <div>
                          訂單日期：
                          {dayjs(v.timestamp).format('YYYY/MM/DD hh:mm A')}
                        </div>
                        {/* <div>{i + 1}</div> */}
                        <div>訂單金額： ${v.time_rate}</div>
                      </div>
                    </div>
                  )
                })}
              {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
