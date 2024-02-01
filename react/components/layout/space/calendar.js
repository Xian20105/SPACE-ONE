import { useEffect, useState } from 'react'
import styles from '@/styles/calendar.module.css'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import dayjs from 'dayjs'

// chunk - 依size分成子陣列，ex. chunk([1, 2, 3, 4, 5], 2) -> [[1,2],[3,4],[5]]
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )

export default function Calendar(props) {
  // const [myYear, setMyYear] = useState(2022)
  // const [myMonth, setMyMonth] = useState(2)

  // 一開始未選中日期

  // 呈現yearAndMonth
  const now = new Date()
  const now1 = dayjs()

  // 要得到今天的西元年使用Date物件的getFullYear()，要得到月份使用getMonth()(注意回傳為 0~11)
  const nowY = now.getFullYear()

  // nowM =1-12
  const nowM = now.getMonth() + 1 //注意回傳為 0~11

  // nowD
  const nowD = now.getDate()

  const [selectY, setSelectY] = useState(nowY)
  const [selectM, setSelectM] = useState(nowM)

  // 呈現標題
  const weekDayList = ['日', '一', '二', '三', '四', '五', '六']

  // 本月有幾天
  // (上個月的最後一天是幾號)
  const days = new Date(selectY, selectM, 0).getDate()

  // 這個月的第一天是星期幾(0-6) (月份為0-11)
  const firstDay = new Date(selectY, selectM - 1, 1).getDay()

  //------ 以下開始產生資料陣列
  // 最前面塞入空白字串的陣列
  const emptyData = Array(firstDay).fill('')

  // 有值的陣列1 ~ days
  // 如何建立一個陣列包含1...N數字
  // https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
  const valueData = Array(days)
    .fill('')
    .map((v, i) => i + 1)

  // 合併兩陣列為一長陣列
  const allData = [...emptyData, ...valueData]
  //------ 以下準備呈現在網頁上
  const allDataChunks = chunk(allData, 7)

  const test1 = dayjs(selectY + '-' + selectM + '-' + nowD).format('YYYY-MM-DD')
  const test2 = dayjs(Date(selectY, selectM, nowD)).format('YYYY-MM-DD')

  const today = dayjs(now).format('YYYY-MM-DD')
  // props.setDataFromChild(today)
  useEffect(() => {}, [props])
  const [myDate, setMyDate] = useState(today)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <BiChevronLeft
            size={32}
            color={'#80999C'}
            style={
              dayjs(selectY + '-' + selectM).format('YYYY-MM') >= today
                ? { cursor: 'pointer' }
                : { opacity: 0.3 }
            }
            onClick={() => {
              if (dayjs(selectY + '-' + selectM).format('YYYY-MM') >= today) {
                selectM == 1
                  ? (setSelectM(12), setSelectY(selectY - 1))
                  : setSelectM(selectM - 1)
              }
            }}
          />
          <div id="yearAndMonth">{`${selectY}年${selectM}月`}</div>
          <BiChevronRight
            size={32}
            color={'#80999C'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              selectM == 12
                ? (setSelectM(1), setSelectY(selectY + 1))
                : setSelectM(selectM + 1)
            }}
          />
        </div>
        <table>
          <thead id="title">
            <tr className={styles.week}>
              {weekDayList.map(function (v, i) {
                return (
                  <th key={i} className={styles.week_column}>
                    {v}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody id="data">
            {allDataChunks.map((v, i) => {
              return (
                <tr key={i}>
                  {v.map((item, idx) => (
                    <td
                      key={idx}
                      onClick={() => {
                        if (item) {
                          // setMyDate(item)
                          setMyDate(
                            dayjs(selectY + '-' + selectM + '-' + item).format(
                              'YYYY-MM-DD'
                            )
                          )

                          props.setDataFromChild(
                            selectY + '-' + selectM + '-' + item
                          )
                        }
                      }}
                      className={`${
                        dayjs(selectY + '-' + selectM + '-' + item).format(
                          'YYYY-MM-DD'
                        ) === today
                          ? styles.today
                          : ''
                      } ${
                        (item != '') &
                        (dayjs(selectY + '-' + selectM + '-' + item).format(
                          'YYYY-MM-DD'
                        ) >=
                          today)
                          ? styles.date_column
                          : styles.past_date
                      } ${
                        (item != '') &
                        (dayjs(selectY + '-' + selectM + '-' + item).format(
                          'YYYY-MM-DD'
                        ) >=
                          today) &
                        (myDate ===
                          dayjs(selectY + '-' + selectM + '-' + item).format(
                            'YYYY-MM-DD'
                          ))
                          ? styles.select_date
                          : ''
                      }
                    `}
                    >
                      {item}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
