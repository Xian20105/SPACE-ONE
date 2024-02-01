import React from 'react'
import styles from '@/styles/productList.module.css'
import { BiCartAlt, BiHeart } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'

const ProductCard = ({ product }) => {
  const [selectedOption, setSelectedOption] = useState('')
  const [specOptions, setSpecOptions] = useState([])

  const [data, setData] = useState({})

  useEffect(() => {
    // 取得商品數據的現有 useEffect 邏輯

    // 假設 `product.spec` 包含規格資訊，並以逗號分隔
    const options = product.spec.split(',')

    // 在選項前加入 "請選擇規格"
    const optionsWithPlaceholder = ['請選擇規格', ...options]
    setSpecOptions(optionsWithPlaceholder)

    // 將第一個選項設為預設值
    setSelectedOption(optionsWithPlaceholder[0])

    // 將預設選項存入 localStorage
    localStorage.setItem('selectedOption', optionsWithPlaceholder[0])
  }, [product])

  // 選擇規格的事件處理函數
  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    localStorage.setItem('selectedOption', option)
  }

  // 將商品添加到購物車的函數
  const addToCart = (product) => {
    if (selectedOption === '請選擇規格') {
      Swal.fire({
        toast: true,
        width: 330,
        position: 'top',
        icon: 'error',
        iconColor: '#ff804a',
        title: '請選擇有效的規格再加入購物車！',
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }

    // 從 localStorage 中取得現有的購物車項目
    const storedItems = JSON.parse(localStorage.getItem('cart')) || []

    // 檢查產品是否已經在購物車中
    const existingItemIndex = storedItems.findIndex(
      (item) =>
        item.product_id === product.product_id && item.spec === selectedOption
    )

    if (existingItemIndex > -1) {
      // 如果產品已經在購物車中，更新數量
      storedItems[existingItemIndex].qty += 1
    } else {
      // 如果產品不在購物車中，以數量 1 添加
      storedItems.push({
        ...product,
        spec: selectedOption,
        qty: 1,
        subtotal: product.price,
      })
    }

    // 將更新後的購物車項目再次存儲到 localStorage 中
    localStorage.setItem('cart', JSON.stringify(storedItems))

    // 可選：顯示通知或執行其他操作
    Swal.fire({
      toast: true,
      width: 330,
      position: 'top',
      icon: 'success',
      iconColor: '#ff804a',
      title: `${product.product_name} 已加入購物車`,
      showConfirmButton: false,
      timer: 1500,
    })
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.productCard}>
        <Link href={`/product/${product.product_id}`} passHref legacyBehavior>
          <a className={styles.productText}>
            <div className={styles.productIMG}>
              {/* 如果product_photo有多張照片 => product.product_photo.split(',')[0] */}
              <img
                src={`/product/${product.product_photo.split(',')[0]}`}
                width={225}
                height={225}
                alt={product.product_name}
                style={{ borderRadius: 10 }}
              />
            </div>
            <div>{product.product_name}</div>
          </a>
        </Link>

        <select
          className={styles.selectContainer}
          value={selectedOption}
          onChange={(e) => handleOptionSelect(e.target.value)}
        >
          {specOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className={styles.productIcon}>
          <div style={{ color: '#487378', fontSize: '24px' }}>
            ${product.price}
          </div>
          <div>
            {/* <BiHeart color="#80999C" size="24px" /> */}
            <BiCartAlt
              onClick={() => addToCart(product)}
              color="#80999C"
              size="24px"
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
