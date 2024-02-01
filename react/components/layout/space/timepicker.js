import { useEffect } from 'react'
import data from '@/data/Time.json'
import dayjs from 'dayjs'

export default function TimePicker(props) {
  const now = dayjs()
  const today = dayjs(now).format('YYYY-MM-DD')

  const nowH = now.hour()
  
  const nowm = now.minute()

  //對應id
  const key = nowH * 2 + (nowm > 30 ? 2 : 1)

  // props.setDataFromChild(props.startTime)
  const handleChange = (e) => {
    props.setDataFromChild(e.target.value)
  }

  // useEffect(() => {}, [props])

  return (
    <>
      <select id="timepicker" onChange={handleChange}>
        {data.map((v) => {
          return (
            <>
              {(v.id >
                (props.startTime
                  ? props.startTime
                  : props.date == today
                  ? props.isEnd
                    ? key + 1
                    : key
                  : 0)) &
              (v.id > 16) &
              (v.id <= 45) ? (
                <option key={v.id} value={v.id}>
                  {v.time}
                </option>
              ) : (
                ''
              )}
            </>
          )
        })}
      </select>
    </>
  )
}
