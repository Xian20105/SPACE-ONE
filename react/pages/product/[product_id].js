import React from 'react';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AB_GET_ONE } from '@/components/my-const'
import Footer from '@/components/layout/footer.js'
import Header from '@/components/layout/header.js'
import styles from '@/styles/productInfo.module.css'
import Carousel from '@/components/layout/product/carousel'
import { FaLine, FaXTwitter } from 'react-icons/fa6'
import {
  BiLogoFacebookCircle,
  BiSolidCopyAlt,
  BiChevronDown,
} from 'react-icons/bi'
import Swal from 'sweetalert2'
// import { useProductCart } from '@/hooks/use-productCart.js'

export default function ABEdit() {
  const router = useRouter()
  const { product_id } = router.query
  const [data, setData] = useState({
    product_id: '',
    product_name: '',
    category_id: '',
    desc: '',
    spec_info: '',
    product_status_id: '',
    spec: '',
  })
  const [selectedOption, setSelectedOption] = useState('')
  const [specOptions, setSpecOptions] = useState([])
  const [qty, setQty] = useState(1)
  const [productPhotos, setProductPhotos] = useState([])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    localStorage.setItem('selectedOption', option)
  }
  useEffect(() => {
    const getProductData = async () => {
      try {
        const r = await fetch(AB_GET_ONE + `?product_id=${product_id}`)
        const d = await r.json()
        console.log('photo', d.data.product_photo)
        setData(d.data)
        let photoArray = d.data.product_photo.split(',')
        setProductPhotos(photoArray)
        // 照片

        // 將 spec 字串轉換為陣列
        const options = d.data.spec.split(',')
        setSpecOptions(options)
        // 將第一個選項設為預設值
        setSelectedOption(options[''])
        // 將預設選項存入 localStorage
        localStorage.setItem('selectedOption', options[''])
      } catch (ex) {
        console.error('Error fetching data:', ex)
      }
    }

    if (product_id) {
      getProductData()
    }
  }, [router.query.product_id])

  const addItem = (item) => {
    if (!selectedOption) {
      // 如果沒有選擇規格，顯示 ALERT 通知並返回
      Swal.fire({
        toast: true,
        width: 330,
        position: 'top',
        icon: 'error',
        iconColor: '#ff804a',
        title: '請選擇規格再加入購物車！',
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }

    if (!qty || qty < 1 || qty > 10) {
      Swal.fire({
        toast: true,
        width: 330,
        position: 'top',
        icon: 'error',
        iconColor: '#ff804a',
        title: '請選擇有效的數量再加入購物車！',
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }
    Swal.fire({
      toast: true,
      width: 300,
      position: 'top',
      icon: 'success',
      iconColor: '#ff804a',
      title: `${item.product_name} 已加入購物車`,
      showConfirmButton: false,
      timer: 1500,
    })

    // 檢查是否存在
    const storedItems = JSON.parse(localStorage.getItem('cart')) || []
    const existingItemIndex = storedItems.findIndex(
      (v) => v.product_id === item.product_id && v.spec === selectedOption
    )

    // 如果有找到
    if (existingItemIndex > -1) {
      // 更新數量，不是直接賦值 qty，而是將原本的 qty 與新增的 qty 相加
      storedItems[existingItemIndex].qty += qty
      storedItems[existingItemIndex].subtotal =
        item.price * storedItems[existingItemIndex].qty // 更新小計
      localStorage.setItem('cart', JSON.stringify(storedItems))
      return // 跳出函式，接下來的程式不執行
    }

    // 如果沒找到的話
    // 原本的商品資料物件中沒有數量(qty)，所以要加入 qty
    const newItem = {
      ...item,
      qty: qty,
      subtotal: item.price * qty,
      spec: selectedOption,
    }
    // 新增商品
    localStorage.setItem('cart', JSON.stringify([...storedItems, newItem]))
  }
  return (
    <>
      <Header />
      <div className={styles.main}>
        <div className={styles.section}>
          <div className={styles.listSection}>
            <div className={styles.left}>
              <div className={styles.photoContainer}>
                <Carousel productPhotos={productPhotos} />
              </div>
            </div>
            <div className={styles.right}>
              <h1>{data.product_name}</h1>
              <h1>$ {data.price}</h1>
              <div className={styles.line}></div>
              <div>
                <h3 style={{ color: '#80999C' }}>商品選項</h3>
              </div>
              <div className={styles.buttonContainer}>
                {/* specOptions => ['紅','白','藍','粉'] */}
                {specOptions.map((v, i) => (
                  <button
                    className={`${styles.button} ${
                      selectedOption === v ? styles.button3 : ''
                    }`}
                    key={i}
                    onClick={() => handleOptionSelect(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className={styles.buyContainer}>
                <div className={styles.quantity}>
                  <select
                    className={styles.quantity2}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {Array.from({ length: 10 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                  <BiChevronDown color="#80999C" size="24px" />
                </div>
                <button onClick={() => addItem(data)}>加入購物車</button>
                <div className={styles.button2}>
                  <button>直接購買</button>
                </div>
              </div>
              <div className={styles.text}>
                購買須知
                <BiChevronDown color="#80999C" size="24px" />
              </div>
              <div className={styles.text}>
                配送方式
                <BiChevronDown color="#80999C" size="24px" />
              </div>
              <div className={styles.text}>
                商品問答
                <BiChevronDown color="#80999C" size="24px" />
              </div>
              <div className={styles.shareContainer}>
                <FaLine />
                <BiLogoFacebookCircle />
                <FaXTwitter />|
                <div>
                  <BiSolidCopyAlt /> 複製連結
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.section2}>
          <div className={styles.infoSection}>
            <div className={styles.infoLeft}>
              <div className={styles.infoTitle}>
                <h3 style={{ color: '#80999C' }}>商品詳情</h3>
              </div>
              <div className={styles.content}>
                  {data.desc.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              {/* <div className={styles.infoText}>
                <h3 style={{ color: '#80999C' }}>規格資訊</h3>
              </div>
              <div>{data.spec_info}</div> */}
            </div>
            <div className={styles.infoRight}>
              <div className={styles.infoTitle}>
                <h3 style={{ color: '#80999C' }}>規格資訊</h3>
              </div>
              <div className={styles.content}>
                  {data.spec_info.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              {/* <div className={styles.infoText}>
                <h3 style={{ color: '#80999C' }}>相關產品</h3>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
