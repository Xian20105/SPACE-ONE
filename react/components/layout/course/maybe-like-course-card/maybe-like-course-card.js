import React from 'react'
import { useEffect, useState } from 'react'
import { CS_MAYBE_LIKE } from '@/components/my-const'

export default function MaybeLikeCourseCard() {
  const [data, setData] = useState([])

  const getMaybeLikeData = async () => {
    try {
      const r = await fetch(CS_MAYBE_LIKE)
      console.log('r', r)
      const d = await r.json()
      console.log('d', d)

      setData(d)
    } catch (ex) {}
  }

  useEffect(() => {
    getMaybeLikeData()
  }, [])

  console.log('data', data)

  return (
    <>
      {/* test */}
      <div>
        {data.rows &&
          data.rows.map((v, i) => {
            return (
              <div key={v.course_id}>
                <div>{v.course_id}</div>
                <div>{v.course_name}</div>
              </div>
            )
          })}
      </div>

      {/* 單張的卡片
      <div className={styles.cardSection}>
        <div className={styles.cards}>
          新德的一定要加 rows (rows 是固定的)
          {data.rows &&
            data.rows.map((v, i) => {
              return (
                <div className={styles.card} key={v.course_id}>
                  map的key一定要在最外層，不然會跳錯誤
                  要把卡片變成四個一排就用grid 或 flex
                  <Link href={`/course/${v.course_id}`}>
                    前端的路由是依照前端react course的資料夾進去，不要加detail
                    <img
                      className={styles.cardPhoto}
                      src="/course/images/test-01.png"
                      alt=""
                    />
                    <div className={styles.dateAndFavicon}>
                      <div className={styles.iconAndDateAndWeek}>
                        <DateIcon />
                        <div className={styles.date}>
                          {dayjs(v.course_date).format('YYYY/MM/DD HH:mm')}
                        </div>
                        <div> fri.</div>
                      </div>
                      <FavIcon />
                    </div>
                    <div className={styles.p3}>{v.course_name}</div>
                    <div className={styles.moneyIconAndPrice}>
                      <div className={styles.t2En}>$</div>
                      <div className={styles.t2En}>{v.course_price}</div>
                    </div>
                  </Link>
                </div>
              )
            })}
        </div>
      </div> */}
    </>
  )
}
