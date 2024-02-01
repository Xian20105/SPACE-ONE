import React from 'react'
import Header from '@/components/layout/header.js'
import Footer from '@/components/layout/footer.js'
import styles from '@/styles/course-checkout.module.css'
import Link from 'next/link'
import CartList from '@/components/layout/course/cart/cart-list'

import { useState } from 'react'
import { useRouter } from 'next/router'

// hooks
import { useCart } from '@/hooks/use-cart'
import Head from 'next/head'

// import { BiCheckbox, BiPlusCircle, BiMinusCircle } from 'react-icons/bi'
export default function Cart() {
  const { items, getCourseItemsData, remove, calTotalItems, calTotalPrice } =
    useCart()
  console.log('一、cart: items:', items)

  const total = calTotalPrice()

  const router = useRouter()
  const [myForm, setMyForm] = useState({
    recipientName: '',
    contactNumber: '',
    // city: '',
    // district: '',
    // postalCode: '',
    address: '',
  })

  const [formData, setFormData] = useState({
    recipientName: '',
    contactNumber: '',
    // city: '',
    // district: '',
    // postalCode: '',
    address: '',
  })

  // const [paymentMethod, setPaymentMethod] = useState('creditCard') // 預設選擇信用卡付款
  // const [orderNumber, setOrderNumber] = useState('')

  /*
  const generateOrderNumber = () => {
    const now = new Date()
    const formattedDatetime = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`
    return `P${formattedDatetime}`
  }
  */

  // const handlePaymentMethodChange = (e) => {
  //   setPaymentMethod(e.target.value)
  // }

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target
  //   setFormData((prevData) => ({ ...prevData, [name]: value }))
  // }

  const changeHandler = (e, id) => {
    const { value } = e.target
    setMyForm({ ...myForm, [id]: value })
  }

  const handleQuickFill = () => {
    setMyForm({
      recipientName: 'Lucky',
      contactNumber: '0912-345-678',
      // city: 'Example City',
      // district: 'Example District',
      // postalCode: '12345',
      address: '台北市大安區新生北路一段100號2樓',
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const isFormValid = () => {
      return !Object.values(myForm).some((value) => value.trim() === '')
    }

    if (!isFormValid()) {
      alert('請填寫所有必填欄位！')
      return
    }

    const currentDatetime = new Date()
    const formattedDatetime = `${currentDatetime.getFullYear()}-${(
      currentDatetime.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${currentDatetime
      .getDate()
      .toString()
      .padStart(2, '0')} ${currentDatetime
      .getHours()
      .toString()
      .padStart(2, '0')}:${currentDatetime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`

    // 生成臨時訂單編號
    // const tempOrderNumber = generateOrderNumber()

    // 存入 localStorage
    // localStorage.setItem('orderNumber', tempOrderNumber)
    // localStorage.setItem('orderDatetime', formattedDatetime)
    // localStorage.setItem('paymentMethod', paymentMethod)
    // localStorage.setItem('myForm', JSON.stringify(myForm))

    // setDisplayInfo('succ')
    // router.push('/product/productOrder')
    alert('成功送出表單！')
  }

  return (
    <>
    <Head>
        <title>SPACE ONE</title>
      </Head>
      <Header />
      <div className={styles.main}>
        {/* 上方 結帳三步驟區 區塊 */}
        <div className={styles.progressBar}>
          <div className={styles.progress1}>
            <div className={styles.progressNumber1}>1</div>
            <div>購物車</div>
          </div>
          <div className={styles.progress2}>
            <div className={styles.progressNumber2}>2</div>
            <div>確認購買明細</div>
          </div>
          <div className={styles.progress3}>
            <div className={styles.progressNumber3}>3</div>
            <div>完成購買</div>
          </div>
        </div>

        {/* 主要內容區塊 */}
        <div className={styles.listSection}>
          {/* 購買明細 */}
          <div className={styles.shoppingDetail}>
            <div className={styles.sectionTitle}>購買明細</div>
            {/* 表內文 */}
            <div className={styles.cartText}>
              <div className={styles.cart}>
                <CartList items={items} remove={remove} />
              </div>
            </div>
          </div>

          {/* 總數+總價 */}
          <div className={styles.totalSection}>
            <div className={styles.totalContainer}>
              <div className={styles.total}>
                課程總數：
                <div className={styles.totalNumber}>{calTotalItems()}</div>
              </div>
              <div className={styles.total}>
                總計：
                <div className={styles.totalNumber}>＄ {calTotalPrice()}</div>
              </div>
            </div>
          </div>

          {/* 付款方式 */}
          <div className={styles.paymentDetail}>
            <div className={styles.sectionTitle}>付款方式</div>
            <div className={styles.allPaymentRadio}>
              <div className={styles.radioGroup}>
                <input
                  className={styles.radioStyle}
                  type="radio"
                  id="html"
                  name="fav_language"
                  value="HTML"
                />
                <div className={styles.paymentText}>信用卡一次付清</div>
              </div>
              <div className={styles.radioGroup}>
                <input
                  type="radio"
                  id="html"
                  name="fav_language"
                  value="HTML"
                />
                <div className={styles.paymentText}>信用卡分期付款</div>
              </div>
              <div className={styles.radioGroup}>
                <input
                  type="radio"
                  id="html"
                  name="fav_language"
                  value="HTML"
                />
                <div className={styles.paymentText}>LINE Pay</div>
              </div>
              <div className={styles.radioGroup}>
                <input
                  type="radio"
                  id="html"
                  name="fav_language"
                  value="HTML"
                />
                <div className={styles.paymentText}>ATM轉帳</div>
              </div>
            </div>
          </div>

          {/* 帶入上次資料 */}
          <div className={styles.peopleDetail}>
            <form onSubmit={onSubmit}>
              <div className={styles.optionsContainer}>
                <h3 className={styles.sectionTitle}>聯絡人資訊</h3>
                <div className={styles.categoryContainer}>
                  <div className={styles.receiptContainer}>
                    <input
                      className={styles.receiptContainer2}
                      type="text"
                      placeholder="姓名"
                      value={myForm.recipientName}
                      onChange={(e) => changeHandler(e, 'recipientName')}
                    />
                    <input
                      className={styles.receiptContainer2}
                      type="text"
                      placeholder="聯絡電話"
                      value={myForm.contactNumber}
                      onChange={(e) => changeHandler(e, 'contactNumber')}
                    />
                  </div>
                  <input
                    className={styles.receiptContainer2}
                    type="text"
                    placeholder="地址"
                    value={myForm.address}
                    onChange={(e) => changeHandler(e, 'address')}
                  />
                </div>
              </div>

              <div className={styles.buttonContainer}>
                <button
                  className={styles.peopleInfoButton}
                  type="button"
                  onClick={handleQuickFill}
                >
                  帶入上次資訊
                </button>
              </div>
            </form>
          </div>

          {/* 同意並送出結帳button */}
          <div className={styles.buttonContainerTwo}>
            <div className={styles.button2}>
              <button onClick={(e) => getCourseItemsData(e, items, total)}>
                同意並送出結帳
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
