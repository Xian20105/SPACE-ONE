import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/context/AuthContext'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import {
  PROFILE,
  M_EDIT_ONE,
  CITY_LIST,
  AREA_LIST,
} from '@/components/my-const'
import SubMenu from '@/components/layout/member/sub-menu'
import styles from '@/styles/profile.module.css'
import { Layout } from '@/components/layout/layout'
import Link from 'next/link'
import z from 'zod'

export default function Edit() {
  const [city, setCity] = useState()
  const [cityValue, setCityValue] = useState(1)
  const [area, setArea] = useState()
  const [displayInfo, setDisplayInfo] = useState('')

  const [myForm, setMyForm] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    phone: '',
    birthday: '',
    area: '',
    address: '',
  })
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
            // setData(result.data)
            console.log(result.data);
            setMyForm({ ...result.data })
          }
          console.log(auth.token)
        })
        .catch((ex) => console.log(ex))
    }
  }, [auth.token])

  useEffect(() => {
    fetch(CITY_LIST)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          console.log(data)
        } else {
          console.log(data)
          setCity([...data.rows])
        }
      })
      .catch((ex) => console.log(ex))
  }, [])

  useEffect(() => {
    fetch(AREA_LIST)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          console.log(data)
        } else {
          console.log(data)
          setArea([...data.rows])
        }
      })
      .catch((ex) => console.log(ex))
  }, [cityValue])

  const changeHandler = (e) => {
    const { name, id, value } = e.target
    console.log({ name, id, value })
    setDisplayInfo('')
    setMyForm({ ...myForm, [id]: value })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    // const emailSchema = z.coerce
    //   .string()
    //   .email({ message: '錯誤的 email 格式' })
    //   .safeParse(myForm.email)
    // console.log('emailSchema:', emailSchema.error.issues[0].message)

    const r = await fetch(M_EDIT_ONE + "/" + myForm.member_id, {
      method: 'POST',
      body: JSON.stringify(myForm),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await r.json()
    if (responseData.success) {
      setDisplayInfo('succ')
    } else {
      setDisplayInfo('fail')
    }
  }
  return (
    <>
      <Layout>
        <div className={styles.flex}>
          <SubMenu />
          <div className={styles.content}>
            <form onSubmit={onSubmit}>
              <div>
                <div className={styles.section}>
                  <div className={styles.label}>姓名：</div>
                  <input
                    id="name"
                    name="name"
                    onChange={changeHandler}
                    value={myForm.name}
                  />
                </div>
                <div className={styles.section}>
                  <div className={styles.label}>暱稱：</div>

                  <input
                    id="nickname"
                    name="nickname"
                    onChange={changeHandler}
                    value={myForm.nickname}
                  />
                </div>
                <div className={styles.section}>
                  <div className={styles.label}>email：</div>

                  <input
                    id="email"
                    name="email"
                    onChange={changeHandler}
                    value={myForm.email}
                  />
                </div>
                <div className={styles.section}>
                  <div className={styles.label}>電話：</div>

                  <input
                    id="phone"
                    name="phone"
                    type="number"
                    value={myForm.phone}
                  />
                </div>
                <div className={styles.section}>
                  <div className={styles.label}>生日：</div>

                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    onChange={changeHandler}
                    value={dayjs(myForm.birthday).format('YYYY-MM-DD')}
                  />
                </div>
                <div className={styles.section}>
                  <div className={styles.label}>地址：</div>
                  <div>
                    <select
                      onChange={(e) => {
                        setCityValue(e.target.value)
                      }}
                    >
                      {city &&
                        city.map((v) => {
                          return (
                            <>
                              {myForm.city == v.city ? (
                                <option
                                  key={v.city_id}
                                  value={v.city_id}
                                  selected
                                >
                                  {v.city}
                                </option>
                              ) : (
                                <option key={v.city_id} value={v.city_id}>
                                  {v.city}
                                </option>
                              )}
                            </>
                          )
                        })}
                    </select>
                    <select
                      id="area"
                      value={myForm.area}
                      onChange={changeHandler}
                    >
                      {area &&
                        area.map((v) => {
                          return (
                            <>
                              {cityValue == v.city_id ? (
                                <option key={v.area_id} value={v.zip}>
                                  {v.area}
                                </option>
                              ) : (
                                ''
                              )}
                            </>
                          )
                        })}
                    </select>
                  </div>
                  <input value={myForm.address} />
                </div>
              </div>
              {displayInfo ? (
                displayInfo === 'succ' ? (
                  <div class="alert alert-success" role="alert">
                    資料修改成功
                  </div>
                ) : (
                  <div class="alert alert-danger" role="alert">
                    資料沒有修改!!!
                  </div>
                )
              ) : null}
              <button>資料修改</button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}
