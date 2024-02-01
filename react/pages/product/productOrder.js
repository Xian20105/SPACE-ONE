import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import React from 'react'
import Footer from '@/components/layout/footer.js'
import Header from '@/components/layout/header.js'
import styles from '@/styles/productOrder.module.css'
import { BiChevronDown } from 'react-icons/bi'
export default function PurchaseInfo() {
  const [cartData, setCartData] = useState([])
  const [myFormData, setMyFormData] = useState(null)
  const [totalAmount, setTotalAmount] = useState(null)
  const [orderDatetime, setOrderDatetime] = useState(null)
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedShipping, setSelectedShipping] = useState(''); // 追蹤收貨方式
  const [selectedPayment, setSelectedPayment] = useState(''); 
  const router = useRouter()

  const handleContinueShopping = () => {
    // 清空 localStorage
    localStorage.removeItem('orderNumber');
    localStorage.removeItem('orderDatetime');
    localStorage.removeItem('cart');
    localStorage.removeItem('myForm');
    localStorage.removeItem('totalAmount');
    localStorage.removeItem('selectedShipping');
    localStorage.removeItem('paymentMethod');
  
    // 導航到 /product
    router.push('/product');
  }
  useEffect(() => {
    // 從 localStorage 中讀取訂單編號
    const storedOrderNumber = localStorage.getItem('orderNumber')
    setOrderNumber(storedOrderNumber)
  }, [])

  useEffect(() => {
    // 從 localStorage 中讀取 orderDatetime 資料
    const storedOrderDatetime = localStorage.getItem('orderDatetime')
    setOrderDatetime(storedOrderDatetime)

    // 從 localStorage 中讀取 cart 資料
    const storedCartData = JSON.parse(localStorage.getItem('cart'))
    setCartData(storedCartData)

    // 從 localStorage 中讀取 myForm 資料
    const storedMyFormData = JSON.parse(localStorage.getItem('myForm'))
    setMyFormData(storedMyFormData)

    // 從 localStorage 中讀取 totalAmount 資料
    const storedTotalAmount = localStorage.getItem('totalAmount')
    setTotalAmount(storedTotalAmount)
    
    // 從 localStorage 中讀取 selectedShipping 資料
    const storedSelectedShipping = localStorage.getItem('selectedShipping');
    setSelectedShipping(storedSelectedShipping);

    // 從 localStorage 中讀取 selectedPayment 資料
    const storedSelectedPayment = localStorage.getItem('paymentMethod');
  setSelectedPayment(storedSelectedPayment);

  console.log("Selected Payment:", storedSelectedPayment); // 確保這行正確顯示值
  }, [])

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
          <p>訂單編號 : {orderNumber}</p>
          <div className={styles.Section1}>
            <div className={styles.orderInfo}>
              <div className={styles.orderText}>訂單成立 : {orderDatetime}</div>
              <div className={styles.orderText}>取貨方式 : {selectedShipping}</div>
              <div className={styles.orderText}>
                訂購人 : {myFormData?.recipientName}
              </div>
            </div>
            <div className={styles.orderInfo}>
              <div className={styles.orderText}>{selectedPayment}</div>
              <div className={styles.orderTotal}>實付金額 : {totalAmount}</div>
              <div className={styles.orderText}>
                電話號碼 :{' '}
                {myFormData?.contactNumber &&
                  `${myFormData.contactNumber.substring(
                    0,
                    myFormData.contactNumber.length - 5
                  )}*****`}
              </div>
            </div>
          </div>
          <div className={styles.Section2}>
            <div className={styles.orderTitle}>
              <div className={styles.orderTitle2}>商品明細</div>
              <div className={styles.orderTitle3}></div>
              <div className={styles.orderTitle4}>單件價格</div>
              <div className={styles.orderTitle5}>數量</div>
              <div className={styles.orderTitle6}>小計</div>
            </div>
            <div className={styles.productText}>
              {cartData.map((item, index) => (
                <div key={index} className={styles.productText}>
                  <div className={styles.productText2}>
                    <div className={styles.photoContainer}><img
                  width="120px"
                  height="120px"
                  src={`/product/${item.product_photo.split(',')[0]}`}
                ></img></div>
                    
                      <div className={styles.productName}>
                        {item.product_name}
                      </div>
                      {/* <div className={styles.productDesc}>{item.desc}</div>
                  <div className={styles.productSpec}>{item.spec}</div> */}
                   
                    <div className={styles.productPrice}>$ {item.price}</div>
                    <div className={styles.productQuantity}>{item.qty}</div>
                    <div className={styles.productSubtotal}>
                      {item.subtotal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <div className={styles.Section3}>
            <div>
              <h3 style={{ color: '#80999C' }}>價格明細</h3>
            </div>
            <div className={styles.details}>
              <div>課程名稱</div>
              <div>購買方案</div>
              <div>售價</div>
              <div>實付價格</div>
            </div>
            <div className={styles.detailsContent}>
              <div className={styles.detailsContent1}>手作教學</div>
              <div className={styles.detailsContent2}>募資方案</div>
              <div className={styles.detailsContent3}>$ 8,000</div>
              <div className={styles.detailsContent4}>$ 8,000</div>
            </div>
          </div> */}
          <div className={styles.buttonContainer}>
            <button onClick={handleContinueShopping}>繼續購物</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
