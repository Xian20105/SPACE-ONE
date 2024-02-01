import { useEffect, useState } from 'react'
import { M_ADD, CITY_LIST, AREA_LIST } from '@/components/my-const'
import styles from '@/styles/register.module.css'
import { Layout } from '@/components/layout/layout'
import { z } from 'zod'
import { useRouter } from 'next/router'

export default function Register() {
  const [city, setCity] = useState()
  const [cityValue, setCityValue] = useState(1)
  const [area, setArea] = useState()
  const [areaValue, setAreaValue] = useState()

  const [displayInfo, setDisplayInfo] = useState('')

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [ckPassword, setCkPassword] = useState('')
  const [ckPasswordError, setCkPasswordError] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [nickname, setNickName] = useState('')
  const [birthday, setBirthday] =useState()
  const [address, setAddress] = useState('')

  const router = useRouter()

  const [myForm, setMyForm] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    check_password: '',
    phone: '',
    birthday: '',
    area: '',
    address: '',
  })

  const quickInput = () => {
    setEmail('test0123@gmail.com')
    setName('Lucky')
    setNickName('Lucky')
    setPassword('a123456')
    setCkPassword('a123456')
    setPhone('0912345678')
    setBirthday('2024-01-20')
    setAreaValue('106')
    setAddress('台北市大安區新生北路一段100號2樓')
  }

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

  const checkEmail = (email) => {
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    if (!email) {
      setEmailError('email為必填')
    } else if (email !== '' && email.search(emailRule) === -1) {
      setEmailError('email必須符合格式')
    } else {
      setEmailError('')
    }
  }

  const checkName = (name) => {
    if (name === '') {
      setNameError('姓名為必填欄位')
    } else {
      setNameError('')
    }
  }

  const checkPassword = (password) => {
    const passwordRule = /^(?=.*[a-zA-Z])(?=.*\d).{1,14}$/
    if (password === '') {
      setPasswordError('密碼為必填欄位')
    } else if (password !== '' && password.search(passwordRule) === -1) {
      setPasswordError('密碼必須符合格式')
    } else {
      setPasswordError('')
    }
  }

  const checkCkPassword = (ckPassword) => {
    if (ckPassword === '') {
      setCkPasswordError('確認密碼為必填欄位')
    } else if (ckPassword !== password) {
      setCkPasswordError('確認密碼必須與密碼一致')
    } else {
      setCkPasswordError('')
    }
  }

  const checkPhone = (phone) => {
    const phoneRule = /^09\d{8}$/
    if (phone === '') {
      setPhoneError('.手機為必填欄位')
    } else if (phone !== '' && phone.search(phoneRule) === -1) {
      setPhoneError('手機必須符合格式')
    } else {
      setPhoneError('')
    }
  }

  // const changeHandler = (e) => {
  //   const { name, id, value } = e.target
  //   console.log({ name, id, value })
  //   setDisplayInfo('')
  //   setMyForm({ ...myForm, [id]: value })
  // }
  // console.log(myForm)
  const onSubmit = async (e) => {
    e.preventDefault()

    let isPass = true
    // 檢查格式
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    if (!email) {
      isPass = false
      setEmailError('email為必填')
    } else if (email !== '' && email.search(emailRule) === -1) {
      isPass = false
      setEmailError('email必須符合格式')
    } else {
      setEmailError('')
    }

    if (name === '') {
      isPass = false
      setNameError('姓名為必填欄位')
    } else {
      setNameError('')
    }

    const passwordRule = /^(?=.*[a-zA-Z])(?=.*\d).{1,14}$/
    if (password === '') {
      isPass = false
      setPasswordError('密碼為必填欄位')
    } else if (password !== '' && password.search(passwordRule) === -1) {
      isPass = false
      setPasswordError('密碼必須包含英文及數字')
    } else {
      setPasswordError('')
    }

    if (ckPassword === '') {
      isPass = false
      setCkPasswordError('確認密碼為必填欄位')
    } else if (ckPassword != password) {
      isPass = false
      setCkPasswordError('確認密碼必須與密碼一致')
    } else {
      setCkPasswordError('')
    }

    const phoneRule = /^09\d{8}$/
    if (phone === '') {
      isPass = false
      setPhoneError('手機為必填欄位')
    } else if (phone !== '' && phone.search(phoneRule) === -1) {
      isPass = false
      setPhoneError('手機必須符合格式')
    } else {
      setPhoneError('')
    }

    const r = await fetch(M_ADD, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        name: name,
        nickname: nickname,
        password: password,
        phone: phone,
        birthday: birthday,
        area: areaValue,
        address: address,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await r.json()
    if (responseData.success) {
      setDisplayInfo('succ')
      router.push('/login')
    } else {
      setDisplayInfo('fail')
    }
  }
  return (
    <>
      <Layout>
        <h1>註冊會員</h1>
        <div onClick={quickInput} className={styles.qi}></div>
        <form name="form" className={styles.form} onSubmit={onSubmit}>
          <div className={styles}>
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                checkEmail(e.target.value)
                setEmail(e.target.value)
              }}
              placeholder="請輸入email"
              className={styles.input}
            />
            <div className={styles.error}>{emailError}</div>
          </div>
          <div>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                checkName(e.target.value)
                setName(e.target.value)
              }}
              placeholder="請輸入姓名"
              className={styles.input}
            />
            <div className={styles.error}>{nameError}</div>
          </div>

          <input
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => {
                setNickName(e.target.value)
              }}
            placeholder="請輸入暱稱"
            className={styles.input}
          />
          <div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                checkPassword(e.target.value)
                setPassword(e.target.value)
              }}
              placeholder="請輸入密碼"
              className={styles.input}
            />
            <div className={styles.error}>{passwordError}</div>
          </div>
          <div>
            <input
              id="check_password"
              name="check_password"
              type="password"
              value={ckPassword}
              onChange={(e) => {
                checkCkPassword(e.target.value)
                setCkPassword(e.target.value)
              }}
              placeholder="請再次輸入密碼"
              className={styles.input}
            />
            <div className={styles.error}>{ckPasswordError}</div>
          </div>
          <div>
            <input
              id="phone"
              name="phone"
              type="number"
              value={phone}
              onChange={(e) => {
                checkPhone(e.target.value)
                setPhone(e.target.value)
              }}
              placeholder="請輸入電話"
              className={styles.input}

            />
            <div className={styles.error}>{phoneError}</div>

          </div>
          <div>
            <input
              id="birthday"
              name="birthday"
              type="date"
              value={myForm.birthday}
              onChange={(e) => {
                setBirthday(e.target.value)
              }}
              placeholder="請輸入生日"
              className={styles.input}

            />
          </div>
          <div className={styles.select}>
            <select
              onChange={(e) => {
                setCityValue(e.target.value)
              }}
            >
              {city &&
                city.map((v) => {
                  return (
                    <option key={v.city_id} value={v.city_id}>
                      {v.city}
                    </option>
                  )
                })}
            </select>
            <select id="area">
              {area &&
                area.map((v) => {
                  return (
                    <>
                      {cityValue == v.city_id ? (
                        <option key={v.area_id} value={v.zip}>
                          {v.area}
                        </option>
                      ) : (
                        ''
                      )}
                    </>
                  )
                })}
            </select>
          </div>
          <div>
            <input
              id="address"
              name="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
              }}
              placeholder="請輸入地址"
              className={styles.input}
            />
          </div>
          <button className={styles.button}>註冊</button>
        </form>
      </Layout>
    </>
  )
}
