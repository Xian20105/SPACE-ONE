import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  S_GET_ONE,
  S_LIST_PHOTO,
  P_LIST_PHOTO,
  S_ORDER_ADD,
  S_GET_ORDER,
  D_LIST,
} from '@/components/my-const'
// import GoogleMapReact from 'google-map-react'
import Image from 'next/image'
import Calendar from '@/components/layout/space/calendar'
import DeviceCard from '@/components/layout/space/device-card'
import styles from '@/styles/spaceDetail.module.css'
import { Layout } from '@/components/layout/layout'
import TimePicker from '@/components/layout/space/timepicker'
import data from '@/data/Time.json'
import dayjs from 'dayjs'
import AuthContext from '@/context/AuthContext'
import { BiX, BiErrorCircle } from 'react-icons/bi'
import { apiKey } from '@/configs/googleApi'

export default function SDetail() {
  const [info, setInfo] = useState({})
  const [photo, setPhoto] = useState([])
  const [placePhoto, setPlacePhoto] = useState([])
  const [device, setDevice] = useState([])
  const [place, setPlace] = useState('')
  const [book, setBook] = useState([])

  const [startDate, setStartDate] = useState(
    dayjs(dayjs()).format('YYYY-MM-DD')
  )
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(1)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [myForm, setMyForm] = useState({
    member_id: 0,
    space_id: '',
    start_time: '',
    time: '',
    time_rate: '',
  })
  const [displayInfo, setDisplayInfo] = useState('')

  const { auth } = useContext(AuthContext)

  const router = useRouter()

  // const [lat, setLat] = useState(25.033198)
  // const [lng, setLng] = useState(121.543575)

  useEffect(() => {
    const space_id = router.query.space_id
    if (router.query.space_id !== undefined) {
      if (!space_id) {
        router.push('/space')
      } else {
        fetch(S_GET_ONE + '/' + space_id)
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) {
              router.push('/space') // 沒拿到資料, 跳到列表頁
            } else {
              console.log(data)
              setInfo({ ...data.row })
              setPlace(data.row.place_id)
            }
          })
          .catch((ex) => console.log(ex))
      }
      if (!space_id) {
        router.push('/space')
      } else {
        fetch(S_LIST_PHOTO + '/' + space_id)
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) {
              router.push('/space') // 沒拿到資料, 跳到列表頁
            } else {
              console.log(data)
              setPhoto([...data.rows])
            }
          })
          .catch((ex) => console.log(ex))
      }
    }
  }, [router.query.space_id])

  // useEffect(() => {
  //   fetch(S_GET_ORDER)
  //     .then((r) => r.json())
  //     .then((data) => {
  //       if (!data.success) {
  //         console.log(data)
  //       } else {
  //         console.log(data)
  //         setBook([...data.rows])
  //       }
  //     })
  //     .catch((ex) => console.log(ex))
  // }, [])

  const handleStart = () => {
    data.map((v) => {
      if (v.id == startTime) return setStart(startDate + ' ' + v.time)
    })
  }

  const handleEnd = () => {
    if (end != '') {
      data.map((v) => {
        if (v.id == endTime) return setEnd(startDate + ' ' + v.time)
      })
    }
  }

  const onSubmit = async () => {
    if (myForm.member_id == 0) {
      router.push('/login')
    } else {
      localStorage.setItem('space-order', JSON.stringify({ info, myForm }))
      router.push('/space/booking')
    }
  }

  // useEffect(() => {
  //   if (place) {
  //     getDevice()
  //     fetch(P_LIST_PHOTO + '/' + place)
  //       .then((r) => r.json())
  //       .then((data) => {
  //         if (!data.success) {
  //           router.push('/space') // 沒拿到資料, 跳到列表頁
  //         } else {
  //           console.log(data)
  //           setPlacePhoto([...data.rows])
  //         }
  //       })
  //       .catch((ex) => console.log(ex))
  //   }
  // }, [place])

  useEffect(() => {
    handleStart()
    handleEnd()
  }, [startDate, startTime, end])

  useEffect(() => {
    setMyForm({
      ...myForm,
      member_id: auth.member_id,
      space_id: info.space_id,
      start_time: dayjs(start).format('YYYY-MM-DD HH:mm'),
      time: +(endTime === 1 ? 1 : endTime - startTime),
      time_rate: info.time_rate,
    })
    console.log(
      endTime,
      startDate,
      start,
      dayjs('2024-01-01 01:00 PM').format('YYYY-MM-DD HH-mm'),
      endTime === 1 ? 1 : endTime - startTime
    )
  }, [start, end, endTime])

  // useEffect(() => {
  //   if (book.space_id == router.query.space_id) {
  //     console.log(123)
  //   }
  // }, [startDate])

  return (
    <>
      <Layout>
        <div className={styles.photo}>
          <a href="#photo" className={styles.more_photo}>
            顯示更多照片
          </a>
          <div className={styles.grid}>
            {photo.map((v, i) => {
              return (
                <>
                  {i === 0 ? (
                    <div className={styles.item1}>
                      <img key={i} src={`/space/${v.space_photo}`} />
                    </div>
                  ) : (
                    ''
                  )}
                  {i === 1 ? (
                    <div className={styles.item2}>
                      <img key={i} src={`/space/${v.space_photo}`} />
                    </div>
                  ) : (
                    ''
                  )}
                  {i === 2 ? (
                    <div className={styles.item3}>
                      <img key={i} src={`/space/${v.space_photo}`} />
                    </div>
                  ) : (
                    ''
                  )}
                </>
              )
            })}
          </div>
        </div>
        <div id="photo" className={styles.modal}>
          <div className={styles.modal__content}>
            {photo.map((v, i) => {
              return <img key={i} src={`/space/${v.space_photo}`} />
            })}
            {placePhoto.map((v, i) => {
              return <img key={i} src={`/space/${v.place_photo}`} />
            })}
            <a href="#" className={styles.modal__close}>
              <BiX size={36} color={'#80999C'} />
            </a>
          </div>
        </div>
        <div className={styles.flex}>
          <div className={styles.booking}>
            <div>
              <h1>{info.space}</h1>
              <div>
                地址：{info.city}
                {info.area}
                {info.address}
              </div>
            </div>
            <div className={styles.select_time}>
              {/* <div>日期{startDate}</div> */}
              <div className={styles.date}>
                <Calendar setDataFromChild={setStartDate} />
              </div>
              <div>
                <div className={styles.price}>
                  <BiErrorCircle
                    size={24}
                    color={'#80999C'}
                    style={{ marginRight: '10px' }}
                  />
                  每小時 ${info.time_rate}
                </div>
                <div className={styles.time}>
                  <div>
                    <div className={styles.timepicker}>開始時間</div>
                    <TimePicker
                      setDataFromChild={setStartTime}
                      date={startDate}
                    />
                  </div>
                  <div>
                    <div className={styles.timepicker}>結束時間</div>
                    <TimePicker
                      setDataFromChild={setEndTime}
                      date={startDate}
                      startTime={startTime}
                      isEnd="true"
                    />
                  </div>
                </div>
                <div className={styles.booking_footer}>
                  <div className={styles.price}>
                    合計： $
                    {((endTime === 1 ? 1 : endTime - startTime) *
                      info.time_rate) /
                      2}
                  </div>
                  <button
                    onClick={() => {
                      onSubmit()
                    }}
                  >
                    立刻預約
                  </button>
                </div>
              </div>
            </div>
          </div>

          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${info.city}${info.area}${info.place_address}(${info.space})&language=en`}
            width="500"
            height="500"
            frameborder="0"
            // allowfullscreen
            className={styles.map}
          ></iframe>
        </div>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>適合類型</h3>
            <div>空間類型：{info.category}</div>
          </div>
          <div className={styles.section}>
            <h3>空間容納</h3>
            <div>容納人數：{info.accommodate}</div>
          </div>
          <div className={styles.section}>
            <h3>基本設備</h3>
            <div className={styles.device}>
              <div className={styles.device_item}>
                <Image
                  src="/space/icon_whiteboard.png"
                  width={32}
                  height={32}
                  className={styles.device_icon}
                  alt=""
                />
                白板
              </div>
              <div className={styles.device_item}>
                <Image
                  src="/space/icon_table.png"
                  width={32}
                  height={32}
                  className={styles.device_icon}
                  alt=""
                />
                桌子
              </div>
              <div className={styles.device_item}>
                <Image
                  src="/space/icon_chair.png"
                  width={32}
                  height={32}
                  className={styles.device_icon}
                  alt=""
                />
                10 張椅子
              </div>
              <div className={styles.device_item}>
                <Image
                  src="/space/icon_wifi.png"
                  width={32}
                  height={32}
                  className={styles.device_icon}
                  alt=""
                />
                WIFI
              </div>
              <div className={styles.device_item}>
                <Image
                  src="/space/icon_power_outlet.png"
                  width={32}
                  height={32}
                  className={styles.device_icon}
                  alt=""
                />
                插座 10 個(另加延長線*2)
              </div>
              <div className={styles.device_item}>
                <Image
                  src="/space/icon_projection.png"
                  width={32}
                  height={32}
                  className={styles.device_icon}
                  alt=""
                />
                投影機
              </div>
              <div className={styles.device_item}>
                <Image
                  src="/space/icon_toilet.png"
                  width={32}
                  height={32}
                  className={styles.device_icon}
                  alt=""
                />
                廁所
              </div>
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(photo, null, 4)}</pre> */}
      </Layout>
    </>
  )
}
