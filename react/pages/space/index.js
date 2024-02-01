import { useEffect, useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import styles from '@/styles/space.module.css'
import {
  BiMap,
  BiCalendar,
  BiUser,
  BiSliderAlt,
  BiX,
  BiCategory,
} from 'react-icons/bi'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import useLoadSpaceItems from '@/services/space'
import SpaceCard from '@/components/layout/space/space-card'
import Calendar from '@/components/layout/space/calendar'
import { Layout } from '@/components/layout/layout'
import { CITY_LIST, AREA_LIST } from '@/components/my-const'

export default function DIndex() {
  // const [data, setData] = useState({})
  const router = useRouter()
  const [perPage, setPerPage] = useState(20)
  const [cover, setCover] = useState()
  const [calendar, setCalendar] = useState('')
  const [people, setPeople] = useState(1)
  const [toggle, setToggle] = useState(false)
  const [startDate, setStartDate] = useState('請選擇日期')
  const [townshipIndex, setTownshipIndex] = useState(-1)
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState()
  const [cityName, setCityName] = useState('')
  const [cityValue, setCityValue] = useState(1)
  const [area, setArea] = useState()
  const [areaName, setAreaName] = useState('')
  const [areaValue, setAreaValue] = useState(0)
  const [category, setCategory] = useState(0)

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

  const [searchCriteria, setSearchCriteria] = useState({
    people: people,
    area: areaValue,
    category: category,
  })

  useEffect(() => {
    const str = JSON.parse(localStorage.getItem('space-search'))
    if (str) {
      setSearchCriteria({
        ...searchCriteria,
        area: str.myForm.area,
        category: str.myForm.category,
        people: str.myForm.people,
      })
    }
    localStorage.removeItem('space-search')
  }, [searchCriteria])

  const { loading, items, hasNextPage, error, loadMore } = useLoadSpaceItems(
    searchCriteria, // 搜尋條件
    perPage, // 每頁幾筆
    200 // 限制最大載入資料筆數 maxItems
  )

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: '0px 0px 400px 0px',
  })

  return (
    <>
      <Layout>
        {/* <Loader /> */}
        <div className={styles.filter}>
          <details className={styles.dropdown}>
            <summary className={styles.btn}>
              <div className={styles.label}>
                <BiMap size={20} className={styles.icon} />
                地點
              </div>
              <p className={styles.value}>
                {cityName ? cityName + areaName : '請選擇區域'}
              </p>
            </summary>
            <div className={styles.panel}>
              <div className={styles.area_container}>
                <div className={styles.city}>
                  {city &&
                    city.map((v) => (
                      <div
                        key={v.city_id}
                        value={v.city_id}
                        className={styles.city_item}
                        onClick={() => {
                          setCityValue(v.city_id)
                          setCityName(v.city)
                        }}
                      >
                        {v.city}
                      </div>
                    ))}
                </div>
                <div className={styles.area}>
                  {area &&
                    area.map((v) => {
                      return (
                        <>
                          {cityValue == v.city_id ? (
                            <div key={v.area_id} className={styles.area_item}>
                              <input
                                type="checkbox"
                                id={v.area_id}
                                value={v.zip}
                                onChange={() => {
                                  setCityName(v.city)
                                  setAreaValue(v.zip)
                                  setAreaName(v.area)
                                }}
                              />
                              <label htmlFor={v.area_id}>{v.area}</label>
                            </div>
                          ) : (
                            ''
                          )}
                        </>
                      )
                    })}
                </div>
              </div>
            </div>
          </details>
          <div className={styles.divider}></div>

          <details className={styles.dropdown}>
            <summary className={styles.btn}>
              <div className={styles.label}>
                <BiCategory size={20} />
                類別
              </div>
              <p className={styles.value}>
                {category == 0
                  ? '請選擇類別'
                  : category == 1
                  ? '縫紉'
                  : category == 2
                  ? '刺繡'
                  : category == 3
                  ? '花藝'
                  : '香氛蠟燭'}
              </p>
            </summary>
            <div className={styles.panel}>
              <div className={styles.category_container}>
                <div className={styles.category}>
                  <div className={styles.category_item}>
                    <input
                      id="category1"
                      type="checkbox"
                      onChange={() => {
                        setCategory(1)
                      }}
                    />
                    <label htmlFor="category1">縫紉</label>
                  </div>
                  <div className={styles.category_item}>
                    <input
                      id="category2"
                      type="checkbox"
                      onChange={() => {
                        setCategory(2)
                      }}
                    />
                    <label htmlFor="category2">刺繡</label>
                  </div>
                  <div className={styles.category_item}>
                    <input
                      id="category3"
                      type="checkbox"
                      onChange={() => {
                        setCategory(3)
                      }}
                    />
                    <label htmlFor="category3">花藝</label>
                  </div>
                  <div className={styles.category_item}>
                    <input
                      id="category4"
                      type="checkbox"
                      onChange={() => {
                        setCategory(4)
                      }}
                    />
                    <label htmlFor="category4">香氛蠟燭</label>
                  </div>
                </div>
              </div>
            </div>
          </details>
          <div className={styles.divider}></div>
          <details className={styles.dropdown}>
            <summary className={styles.btn}>
              <div className={styles.label}>
                <BiUser size={20} />
                人數
              </div>
              <p className={styles.value}>{people}+</p>
            </summary>
            <div className={styles.panel}>
              <div className={styles.people_container}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={people}
                  onChange={(e) => {
                    setPeople(e.target.value)
                  }}
                />
              </div>
            </div>
          </details>
        </div>
        <div className={styles.list}>
          {items.map((v, i) => {
            return (
              <>
                {(v.accommodate > people) &
                (areaValue == 0 || v.zip == areaValue) &
                (category == 0 || v.category_id == category) ? (
                  <div key={v.space_id}>
                    <SpaceCard
                      image={v.cover ? v.cover : 'preview.png'}
                      space_id={v.space_id}
                      people={v.accommodate}
                      title={v.space}
                      near={v.near}
                      price={v.time_rate}
                    />
                  </div>
                ) : (
                  ''
                )}
              </>
            )
          })}
          {(loading || hasNextPage) && (
            <div ref={sentryRef}>
              <div className={styles.loader}></div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
