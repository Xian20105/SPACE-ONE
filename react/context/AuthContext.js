import { useRouter } from 'next/router'
import React, { createContext, useEffect, useReducer, useState } from 'react'

const AuthContext = createContext({})

export default AuthContext

// 登入狀態: 可以登入, 可以登出, 狀態資料(會員id, email, nickname, token)
export const initAuth = {
  member_id: '',
  email: '',
  nickname: '',
  token: '',
}

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initAuth)
  const router = useRouter()
  // course 收藏狀態
  const [courseFav, setCourseFav] = useState([])

  // 募資收藏狀態
  const [blogFav, setBlogFav] = useState([])

  useEffect(() => {
    const str = localStorage.getItem('auth-space') //名字要避免一樣
    if (str) {
      try {
        const data = JSON.parse(str)
        if (data.member_id && data.email) {
          const { member_id, email, nickname, token } = data
          setAuth({ member_id, email, nickname, token })
        }
      } catch (ex) {}
    } else {
      // router.push('/')
    }
  }, [])

  // 登出
  const logout = () => {
    localStorage.removeItem('auth-space')
    setAuth(initAuth)
    router.push('/')
  }

  // 得到會員 course 收藏紀錄,並加入狀態
  const handleGetCourseFav = async () => {
    try {
      const r = await fetch(
        `http://localhost:3005/course/get-course-fav?member_id=${auth.id}`
      )
      const d = await r.json()
      console.log(d)
      //if (d.success) {
      setCourseFav(d)
      //}
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    if (auth.id > 0) {
      handleGetCourseFav()
    } else {
      setCourseFav([])
    }
  }, [auth.member_id])

  // 得到會員募資收藏紀錄並加入狀態
  const handleGetBlogFav = async () => {
    try {
      const r = await fetch(
        `http://localhost:3005/exhibition/cfCollect/get-blog-fav?member_id=${auth.id}`
      )
      const d = await r.json()
      console.log(d)
      //if (d.success) {
      setBlogFav(d)
      //}
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    if (auth.id > 0) {
      handleGetBlogFav()
    } else {
      setBlogFav([])
    }
  }, [auth.member_id])

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        logout,
        courseFav,
        setCourseFav,
        blogFav,
        setBlogFav,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
