import { useState, useEffect, useRef } from 'react'

export default function Counter({ endTimeProp }) {
  const spanRef = useRef()
  const endTime = new Date(endTimeProp)
  // 定義計算剩餘時間的function
  function calculateTimeLeft() {
    const now = new Date()

    //const：在宣告時必須立即賦予初始值，而且“不能”再重新賦值。
    //let：在宣告時可以不賦予初始值，之後再賦值。

    let different = endTime - now
    let timeLeft = {}

    if (different > 0) {
      timeLeft = {
        days: Math.floor(different / (1000 * 60 * 60 * 24)),
        hours: Math.floor((different / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((different / (1000 * 60)) % 60),
        seconds: Math.floor((different / 1000) % 60),
      }
    }
    return timeLeft
  }

  // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  // 更新剩餘時間
  useEffect(() => {
    let id = setInterval(() => {
      // setTimeLeft(calculateTimeLeft())
      const timeLeft = calculateTimeLeft()
      console.log(timeLeft)
      spanRef.current.innerHTML = `${timeLeft.days}天 ${timeLeft.hours}時 ${timeLeft.minutes}分 ${timeLeft.seconds}秒`
    }, 1000)
    // 清除定時器
    return () => {
      clearInterval(id)
    }
  }, [endTime])

  return (
    <>
      {/* <h1>
        活動正在進行：{new Date().toLocaleString()}
      </h1> */}
      <div>
        距離結束時間{' '}
        <span ref={spanRef}>
          {/* {timeLeft.days}天 {timeLeft.hours}時 {timeLeft.minutes}分{' '}
          {timeLeft.seconds}秒 */}
        </span>
      </div>
    </>
  )
}
