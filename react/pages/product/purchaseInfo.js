import React, { useState } from 'react'
import Footer from '@/components/layout/footer.js'
import Header from '@/components/layout/header.js'
import styles from '@/styles/purchaseInfo.module.css'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

export default function ABAdd() {
  const router = useRouter()

  const [myForm, setMyForm] = useState({
    recipientName: '',
    contactNumber: '',
    city: '',
    district: '',
    postalCode: '',
    address: '',
  })

  const [formData, setFormData] = useState({
    recipientName: '',
    contactNumber: '',
    city: '',
    district: '',
    postalCode: '',
    address: '',
  })

  const [displayInfo, setDisplayInfo] = useState('') // "", "succ", "fail"
  const [paymentMethod, setPaymentMethod] = useState('') // 預設選擇信用卡付款
  const [orderNumber, setOrderNumber] = useState('')

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

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const changeHandler = (e, id) => {
    const { value } = e.target
    setDisplayInfo('')
    setMyForm({ ...myForm, [id]: value })
  }

  const handleQuickFill = () => {
    setMyForm({
      recipientName: 'John Doe',
      contactNumber: '0921-520-520',
      city: 'Example City',
      district: 'Example District',
      postalCode: '12345',
      address: '123 Main St',
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    
    const isFormValid = () => {
      return !Object.values(myForm).some((value) => value.trim() === '')
    }
    if (!isFormValid()) {
      Swal.fire({
        toast: true,
        width: 330,
        position: 'top',
        icon: 'error',
        iconColor: '#ff804a',
        title: '請填寫所有必填欄位',
        showConfirmButton: false,
        timer: 1500,
      });
      return; // 阻止表單進一步提交
    }
    
    if (!paymentMethod) {
      Swal.fire({
        toast: true,
        width: 330,
        position: 'top',
        icon: 'error',
        iconColor: '#ff804a',
        title: '請選擇付款方式',
        showConfirmButton: false,
        timer: 1500,
      })
      return // 阻止表單進一步提交
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
    const tempOrderNumber = generateOrderNumber()

    // 存入 localStorage
    localStorage.setItem('orderNumber', tempOrderNumber)
    localStorage.setItem('orderDatetime', formattedDatetime)
    localStorage.setItem('paymentMethod', paymentMethod)
    localStorage.setItem('myForm', JSON.stringify(myForm))
    

    setDisplayInfo('succ')
    router.push('/product/productOrder')
    Swal.fire({
      toast: true,
      width: 330,
      position: 'top',
      icon: 'success',
      iconColor: '#ff804a',
      title: '成功送出表單！',
      showConfirmButton: false,
      timer: 1500,
    })
  }
  return (
    <>
      <Header />
      <div className={styles.main}>
        <div className={styles.progressBar}>
          <div className={styles.progress1}>
            <div className={styles.progressNumber1}>1</div>
            <div>購物車</div>
          </div>
          <div className={styles.progress2}>
            <div className={styles.progressNumber2}>2</div>
            <div>填寫購買資訊</div>
          </div>
          <div className={styles.progress3}>
            <div className={styles.progressNumber3}>3</div>
            <div>完成訂單</div>
          </div>
        </div>
        <div className={styles.listSection}>
          <form onSubmit={onSubmit}>
            <div className={styles.optionsContainer}>
              <h3 style={{ color: '#80999C' }}>收件方式</h3>
              <div className={styles.categoryContainer}>
                <div className={styles.receiptContainer}>
                  <input
                    className={styles.receiptContainer2}
                    type="text"
                    placeholder="收件人姓名"
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
                <div className={styles.receiptContainer}>
                  <input
                    className={styles.receiptContainer3}
                    type="text"
                    placeholder="縣市"
                    value={myForm.city}
                    onChange={(e) => changeHandler(e, 'city')}
                  />
                  <input
                    className={styles.receiptContainer4}
                    type="text"
                    placeholder="鄉鎮市區"
                    value={myForm.district}
                    onChange={(e) => changeHandler(e, 'district')}
                  />
                  <div className={styles.receiptInfoB}>
                    <div>郵遞區號</div>
                    <input
                      className={styles.receiptContainer5}
                      type="text"
                      placeholder=""
                      value={myForm.postalCode}
                      onChange={(e) => changeHandler(e, 'postalCode')}
                    />
                  </div>
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
            <div className={styles.optionsContainer}>
              <h3 style={{ color: '#80999C' }}>付款方式</h3>
              <div className={styles.categoryContainer}>
                <div className={styles.optionsContent}>
                  <div className={styles.radioContainer}>
                    <input
                      type="radio"
                      name="radioGroup"
                      value="信用卡付款"
                      checked={paymentMethod === '信用卡付款'}
                      onChange={handlePaymentMethodChange}
                      style={{ cursor: 'pointer' }}
                    />

                    <div className={styles.radioTitle}>信用卡付款</div>
                    <div className={styles.radioText}>
                      台新、玉山享 3 期 / 6 期 / 零利率、可用銀聯卡、可用國外卡
                    </div>
                  </div>
                </div>
                <div className={styles.optionsContent}>
                  <div className={styles.radioContainer}>
                    <input
                      type="radio"
                      name="radioGroup"
                      value="ATM或銀行轉帳"
                      checked={paymentMethod === 'ATM或銀行轉帳'}
                      onChange={handlePaymentMethodChange}
                      style={{ cursor: 'pointer' }}
                    />
                    ATM或銀行轉帳
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button type="button" onClick={handleQuickFill}>
                一鍵輸入
              </button>
              <button type="submit">送出</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
