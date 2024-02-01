import React from 'react'
import Footer from '@/components/layout/footer.js'
import Header from '@/components/layout/header.js'
import styles from '@/styles/productCart.module.css'
import CartList from '@/components/layout/product/cart/cart-list'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useProductCart } from '@/hooks/use-productCart'
import { BiCheckbox, BiPlusCircle, BiMinusCircle } from 'react-icons/bi'
import Swal from 'sweetalert2'

export default function ProductCart() {
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const router = useRouter()
  const [selectedShipping, setSelectedShipping] = useState('')

  useEffect(() => {
    const localData = localStorage.getItem('cart')
    const parsedData = JSON.parse(localData)
    setCartItems(parsedData || [])
    console.log(parsedData)
  }, [])

  useEffect(() => {
    // 在 cartItems 更新時，同步更新 localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])
  useEffect(() => {
    // 計算小計金額
    const subtotalAmount = cartItems.reduce(
      (acc, item) => acc + item.subtotal,
      0
    )
    // 設定小計金額狀態
    setSubtotal(subtotalAmount)
  }, [cartItems])

  const [items, setItems] = useState([])
  //數量增加
  const handleIncrement = (index) => {
    const newCartItems = [...cartItems]
    newCartItems[index].qty += 1
    newCartItems[index].subtotal =
      newCartItems[index].price * newCartItems[index].qty
    setCartItems(newCartItems)
  }
  //數量減少
  const handleDecrement = (index) => {
    const newCartItems = [...cartItems]
    if (newCartItems[index].qty === 1) {
      // 如果數量為 1，則刪除商品
      newCartItems.splice(index, 1)
      Swal.fire({
        toast: true,
        width: 330,
        position: 'top',
        icon: 'error',
        iconColor: '#ff804a',
        title: '商品已移除購物車',
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      // 否則減少數量
      newCartItems[index].qty -= 1
      newCartItems[index].subtotal =
        newCartItems[index].price * newCartItems[index].qty
    }
    setCartItems(newCartItems)
  }

  // 刪除商品，回傳新的陣列，符合id的商品不要
  const remove = (items, product_id) => {
    const newItems = items.filter((v, i) => {
      return v.product_id !== product_id
    })

    setItems(newItems)
  }

  // 增加數量，回傳新的陣列，符合id的商品數量+1
  const increment = (items, product_id) => {
    const newItems = items.map((v, i) => {
      if (v.product_id === product_id)
        return { ...v, qty: v.qty + 1, subtotal: v.price * (v.qty + 1) }
      else return v
    })

    setItems(newItems)
  }

  // 減少數量，回傳新的陣列，符合id的商品數量-1
  const decrement = (items, product_id) => {
    const newItems = items.map((v, i) => {
      if (v.product_id === product_id)
        return { ...v, qty: v.qty - 1, subtotal: v.price * (v.qty - 1) }
      else return v
    })

    setItems(newItems)
  }

  const addItem = (item) => {
    // 檢查是否存在
    const index = items.findIndex((v, i) => {
      return v.product_id === item.product_id
    })

    // 如果有找到
    if (index > -1) {
      // 數量+1
      increment(items, item.product_id)
      return // 跳出函式，接下來的程式不執行
    }

    // 以下是如果沒找到的話
    // 原本的商品資料物件中沒有數量(qty)，所以要加入qty
    const newItem = { ...item, qty: 1, subtotal: item.price }
    //1 2 3
    setItems([...items, newItem])
  }

  const calTotalItems = () => {
    let total = 0

    for (let i = 0; i < items.length; i++) {
      total += items[i].qty
    }

    return total
  }

  const calTotalPrice = () => {
    let total = 0

    // 取得 localStorage 中的資料
    const storedItems = JSON.parse(localStorage.getItem('cart')) || []

    for (let i = 0; i < storedItems.length; i++) {
      total += storedItems[i].subtotal
    }

    return total
  }
  // reduce (累加，歸納) 2 -> 1
  // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  const totalItems = items.reduce((acc, v) => acc + v.qty, 0)
  const totalPrice = items.reduce((acc, v) => acc + v.subtotal, 0)
  // const totalPrice = items.reduce((acc, v) => acc + v.qty*v.price, 0)

  const handleRadioChange = (event) => {
    const selectedOption = event.target.value
    let newTotalAmount = 0

    if (selectedOption === '超商取貨') {
      newTotalAmount = 60
    } else if (selectedOption === '宅配到府') {
      newTotalAmount = 100
    }

    // 設定總金額狀態
    setTotalAmount(newTotalAmount)

    // 設定選擇的配送方式
    setSelectedShipping(selectedOption)

    // 將選擇的配送方式存入 localStorage
    localStorage.setItem('selectedShipping', selectedOption)
  }
  //下一步按鈕
  const handleConfirmPurchase = () => {
    if (!totalAmount) {
      Swal.fire({
        toast: true,
        width: 300,
        position: 'top',
        icon: 'error',
        iconColor: '#ff804a',
        title: '請選擇配送方式',
        showConfirmButton: false,
        timer: 1500,
      })
      // 如果沒有 totalAmount，不執行路由導航
      return
    }
    localStorage.setItem('totalAmount', `${subtotal + totalAmount}`)
    // 在這裡進行路由導航
    router.push('/product/purchaseInfo')
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
          <div className={styles.cartContainer}>
            <div className={styles.cartTitle}>
              {/* <div>
                <input type="checkbox"></input>
              </div> */}
              <div className={styles.cartTitle2}>商品資訊</div>
              <div
                className={styles.cartTitle3}
                style={{ visibility: 'hidden' }}
              >
                單件價格
              </div>
              <div className={styles.cartTitle4}>單件價格</div>
              <div className={styles.cartTitle5}>數量</div>
              <div className={styles.cartTitle6}>小計</div>
            </div>
          </div>
          {cartItems.map((item, index) => (
            <div key={index} className={styles.cartText}>
              <CartList
                items={items}
                addItem={addItem}
                remove={remove}
                decrement={decrement}
              />
              {/* <div>
                <input type="checkbox"></input>
              </div> */}
              <div className={styles.photo}>
                <img
                  width="120px"
                  height="120px"
                  src={`/product/${item.product_photo.split(',')[0]}`}
                ></img>
              </div>
              <div className={styles.productNameContainer}>
                <div className={styles.productName}>{item.product_name}</div>
                <div className={styles.productDesc}>規格 - {item.spec}</div>
              </div>
              <div className={styles.productPrice}>$ {item.price}</div>
              <div className={styles.productQuantity}>
                <div>
                  <BiMinusCircle onClick={() => handleDecrement(index)} />
                </div>
                {item.qty}
                <div>
                  <BiPlusCircle onClick={() => handleIncrement(index)} />
                </div>
              </div>
              <div className={styles.productSubtotal}>$ {item.subtotal}</div>
            </div>
          ))}
          <div className={styles.totalSection}>
            <div className={styles.totalContainer}>
              <div className={styles.optionsContainer}>
                <h3 style={{ color: '#80999C' }}>配送方式</h3>
                <div className={styles.categoryContainer}>
                  <div className={styles.optionsContent}>
                    <div className={styles.radioContainer}>
                      <input
                        type="radio"
                        value="超商取貨"
                        name="radioGroup"
                        style={{ cursor: 'pointer' }}
                        onChange={handleRadioChange}
                        checked={selectedShipping === '超商取貨'}
                      ></input>
                      超商取貨
                    </div>
                  </div>
                  <div className={styles.optionsContent}>
                    <div className={styles.radioContainer}>
                      <input
                        type="radio"
                        value="宅配到府"
                        name="radioGroup"
                        style={{ cursor: 'pointer' }}
                        onChange={handleRadioChange}
                        checked={selectedShipping === '宅配到府'}
                      ></input>
                      宅配到府
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.cartSubtotal}>
                <div>商品合計 ${subtotal}</div>
              </div>
              <div className={styles.freight}>
                <div>運費 ${totalAmount}</div>
              </div>
              <div className={styles.total}>
                <div>總金額 ${subtotal + totalAmount} </div>
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button>繼續購物</button>
            <div className={styles.button2}>
              <button onClick={handleConfirmPurchase}>下一步</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
