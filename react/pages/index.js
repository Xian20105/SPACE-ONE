import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '@/styles/home.module.css'
import { BiMap, BiUser, BiCategory } from 'react-icons/bi'
import { CITY_LIST, AREA_LIST } from '@/components/my-const'
import { useRouter } from 'next/router'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import Head from 'next/head'

export default function Home() {
  const [people, setPeople] = useState(1)
  const [city, setCity] = useState()
  const [cityName, setCityName] = useState('')
  const [cityValue, setCityValue] = useState(1)
  const [area, setArea] = useState()
  const [areaName, setAreaName] = useState('')
  const [areaValue, setAreaValue] = useState(0)
  const [category, setCategory] = useState(0)
  const [myForm, setMyForm] = useState({
    area: 0,
    category: 0,
    people: 0,
  })

  const router = useRouter()

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

  useEffect(() => {
    setMyForm({
      ...myForm,
      area: areaValue,
      category: category,
      people: people,
    })
  }, [area, category, people])

  const onSubmit = async () => {
    if ((myForm.area == 0) & (myForm.category == 0) & (myForm.people == 0)) {
      router.push('/space')
    } else {
      localStorage.setItem('space-search', JSON.stringify({ myForm }))
      router.push('/space')
    }
  }

  return (
    <>
      <Head>
        <title>SPACE ONE</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <div className={styles.top}>
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
                    // className={styles.slider}
                    onChange={(e) => {
                      setPeople(e.target.value)
                    }}
                  />
                </div>
              </div>
            </details>
            <div className={styles.filter_btn} onClick={onSubmit}>
              搜尋
            </div>
          </div>
          <Image
            src="/kv.jpg"
            alt=""
            width={1920}
            height={1280}
            className={styles.kv}
          />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}
