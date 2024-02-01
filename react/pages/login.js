import { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LOGIN } from '@/components/my-const'
import AuthContext from '@/context/AuthContext'
import styles from '@/styles/login.module.css'
import { Layout } from '@/components/layout/layout'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAuth } = useContext(AuthContext)
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  const postForm = async (e) => {
    e.preventDefault()
    if (checked) {
      localStorage.setItem('remember-email', email)
      localStorage.setItem('remember-pass', password)
    } else {
      localStorage.removeItem('remember-email')
      localStorage.removeItem('remember-pass')
    }
    const r = await fetch(LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await r.json()
    console.log(data)
    if (data.success) {
      const { member_id, email, nickname, token } = data
      // 成功登入時, 寫入 localStorage 做長時間的狀態保存
      localStorage.setItem(
        'auth-space',
        JSON.stringify({ member_id, email, nickname, token })
      )
      setAuth({ member_id, email, nickname, token })
      // router.push('/')
      window.history.go(-3)
    }
  }

  useEffect(() => {
    const strEamil = localStorage.getItem('remember-email')
    const strPass = localStorage.getItem('remember-pass')
    if (strEamil) {
      setEmail(strEamil)
    }
    if (strPass) {
      setPassword(strPass)
      setChecked(true)
    }
  },[])
  return (
    <>
      <Layout>
        <form name="form" className={styles.form} onSubmit={postForm}>
        <h1 className={styles.title}>登入會員</h1>
          <div className={styles}>
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入email"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
            />
          </div>
          <div className={styles.password}>
            <div className="flex">
              <input
                type="checkbox"
                onChange={(e) => {
                  setChecked(checked ? false : true)
                }}
                checked={checked ? checked : ''}
              />{' '}
              記住密碼
            </div>
            <span className={styles.forgot}>忘記密碼？</span>
          </div>
          <button className={styles.button}>登入</button>
        <div className={styles.no_account}>
            還沒有帳號？
            <Link href="/register" className={styles.register}>
              {' '}
              註冊會員
            </Link>
        </div>
        </form>
      </Layout>
    </>
  )
}