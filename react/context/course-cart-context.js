import React, { createContext, useEffect, useState } from 'react'

const CourseCartContext = createContext({})

export default CourseCartContext

// 登入狀態: 可以登入, 可以登出, 狀態資料(會員id, email, nickname, token)
export const initCourse = {
  course_id: 0,
  course_name: '',
  course_price: 0,
}

export const CourseCartContextProvider = ({ children }) => {
  const [course, setCourse] = useState(initCourse)

  useEffect(() => {
    const str = localStorage.getItem('space-one-course')

    if (str) {
      try {
        const data = JSON.parse(str)
        console.log(data)
        if (data.course_id) {
          const { course_id, course_name, course_price } = data
          setCourse({ course_id, course_name, course_price })
        }
      } catch (ex) {}
    } else {
    }
  }, [])

  /* && data.course_name
  // 登出
  const logout = () => {
    // 登出時, 清除 localStorage 的記錄
    localStorage.removeItem('space-one-course')
    setCourse(initCourse)
  }
  */

  return (
    <CourseCartContext.Provider value={{ course, setCourse }}>
      {children}
    </CourseCartContext.Provider>
  )
}
