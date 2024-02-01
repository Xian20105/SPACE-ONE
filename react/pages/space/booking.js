import { Layout } from '@/components/layout/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import styles from '@/styles/booking.module.css'

import { S_ORDER_ADD } from '@/components/my-const'

export default function Booking() {
  const [myForm, setMyForm] = useState({
    uuid: uuidv4(),
    member_id: 0,
    space_id: '',
    start_time: '',
    time: '',
    time_rate: '',
  })
  const router = useRouter()
  const [displayInfo, setDisplayInfo] = useState('')

  const [space, setSpace] = useState('')
  const [cover, setCover] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    const str = JSON.parse(localStorage.getItem('space-order'))
    if (!str) {
      window.history.back()
    } else {
      setMyForm({
        ...myForm,
        member_id: str.myForm.member_id,
        space_id: str.myForm.space_id,
        start_time: str.myForm.start_time,
        time: str.myForm.time,
        time_rate: (str.myForm.time_rate * str.myForm.time) / 2,
      })
      setSpace(str.info.space)
      setCover(str.info.cover)
      setAddress(str.info.city + str.info.area + str.info.address)
    }
  }, [])

  const onSubmit = async () => {
    if (myForm.member_id == 0) {
      router.push('/login')
    } else {
      // localStorage.setItem('space-order', JSON.stringify({ info, myForm }))
      // router.push('/space/booking')
      const r = await fetch(S_ORDER_ADD, {
        method: 'POST',
        body: JSON.stringify(myForm),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const responseData = await r.json()
      if (responseData.success) {
        setDisplayInfo('succ')
        localStorage.removeItem('space-order')
        router.push('/space/succ')
      } else {
        setDisplayInfo('fail')
      }
    }
  }
  return (
    <Layout>
      <div className={styles.container}>
        <div>
          <img src={`/space/${cover}`} className={styles.img} />
          <h2>{space}</h2>
          <div>{address}</div>
        </div>
        <div>
          <div>預約日期：{dayjs(myForm.start_time).format('YYYY/MM/DD')}</div>
          <div>
            預約時段：{dayjs(myForm.start_time).format('hh:mm A')}
            {' 至 '}
            {dayjs(myForm.start_time)
              .add(myForm.time * 30, 'm')
              .format('hh:mm A')}
          </div>
        <div>空間費用：${(myForm.time_rate / myForm.time) * 2}/小時</div>
        </div>
        <div className={styles.price}>
          <div>合計 {myForm.time / 2} 小時</div>
          <div>付款金額：$ {myForm.time_rate}</div>
        </div>

        <button
          onClick={() => {
            onSubmit()
          }}
        >
          前往結賬
        </button>
      </div>
    </Layout>
  )
}
