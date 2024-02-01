import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

// 宣告要使用的context
import { createContext } from 'react'
const CartContext = createContext(null)
// const CartContext = createContext('')

import CourseCartContext from '@/context/course-cart-context'

// my-const 用
import { CS_ORDER_ADD } from '@/components/my-const'
console.log('零、CS_ORDER_ADD', CS_ORDER_ADD)

// export function CartProvider({ children }) {
export function CartProvider({ children }) {
  const router = useRouter() // router 獲得動態路由

  // 初始化 items 為空陣列
  const [items, setItems] = useState([])
  console.log('一、use-cart: items', items)

  /* fetch  CS_ORDER_ADD 用 */
  const [courseOrder, setCourseOrder] = useState({
    course_order_id: 0,
    member_id: 0,
    course_id: 0,
  })

  console.log('二、use-cart:courseOrder', courseOrder)

  const [displayInfo, setDisplayInfo] = useState('') // "", "succ", "fail"

  const getCourseItemsData = async (e, items, total) => {
    e.preventDefault()
    console.log('items eee',items);
    console.log('total eee',total);
    const r = await fetch(CS_ORDER_ADD, {
      method: 'POST',
      body: JSON.stringify({ items, total }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const responseData = await r.json()

    if (responseData.success) {
      // setDisplayInfo('succ')
      // alert('課程訂單已成立！')
      Swal.fire({
        toast: true,
        width: 300,
        position: 'top',
        icon: 'success',
        iconColor: '#ff804a',
        title: '課程訂單已成立！',
        showConfirmButton: false,
        timer: 1500,
      })

      // 加跳轉畫面 router.push
      router.push('./new-course-order')

      // 加入訂單資料表就清空購物車
      localStorage.removeItem('space-one-course')
    } else {
      // setDisplayInfo('fail')
      // alert('成立課程訂單發生錯誤!!!')
      Swal.fire({
        toast: true,
        width: 300,
        position: 'top',
        icon: 'error',
        iconColor: '#80999C',
        title: '成立課程訂單發生錯誤!!!',
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  // 如果localStorage 有長度,就把 localStorage 設定到購物車裡面（維持購物車裡的課程商品）
  useEffect(() => {
    // if (localStorage.length) {
    let data = []
    const localData = localStorage.getItem('space-one-course')
    if (localData) {
      try {
        data = JSON.parse(localData)
      } catch (ex) {}
      if (!Array.isArray(data)) {
        data = []
      }
    }
    setItems(data)
    // }
  }, [])

  const { setCourse } = useContext(CourseCartContext)

  // 用函式更新 localStorage
  const updateLocalStorage = (newCourse) => {
    localStorage.setItem('space-one-course', JSON.stringify(newCourse))
  }

  // 刪除商品，回傳新的陣列，符合id的商品不要
  const remove = (items, course_id) => {
    const newItems = items.filter((v, i) => {
      return v.course_id !== course_id
    })
    setItems(newItems)
    updateLocalStorage(newItems) // 更新 localStorage
    console.log('use-cart二、newItems:', newItems)
  }

  // 加入購物車 Button
  const addItem = (item) => {
    // 檢查是否存在
    const index = items.findIndex((v, i) => {
      return v.course_id === item.course_id
    })
    console.log(item)
    console.log(index)

    /* */
    // 如果有找到
    if (index > -1) {
      // 數量+1
      // increment(items, item.id)
      // alert('課程已在購物車了')
      Swal.fire({
        toast: true,
        width: 300,
        position: 'top',
        icon: 'error',
        iconColor: '#80999C',
        title: '課程已在購物車了',
        showConfirmButton: false,
        timer: 1500,
      })
      return // 跳出函式，接下來的程式不執行
    }

    // 以下是如果沒找到的話
    // 原本的商品資料物件中沒有數量(qty)，所以要加入qty
    const newItem = { ...item, qty: 1, subtotal: item.course_price }
    //1 2 3
    setItems([...items, newItem])
    updateLocalStorage([...items, newItem]) // 更新 localStorage

    // alert('已將課程加進購物車')
    Swal.fire({
      toast: true,
      width: 300,
      position: 'top',
      icon: 'success',
      iconColor: '#ff804a',
      title: '已將課程加進購物車',
      showConfirmButton: false,
      timer: 1500,
    })
    console.log('use-cart三、newItems:', [...items, newItem])
  }

  // 立即結帳 Button
  const addItemAndChangePage = (item) => {
    // 檢查是否存在
    const index = items.findIndex((v, i) => {
      return v.course_id === item.course_id
    })
    console.log(item)
    console.log(index)

    /**/
    // 如果有找到
    if (index > -1) {
      // 數量+1
      // increment(items, item.id)
      // alert('重複新增')

      return // 跳出函式，接下來的程式不執行
    }

    // 以下是如果沒找到的話
    // 原本的商品資料物件中沒有數量(qty)，所以要加入qty
    const newItem = { ...item, qty: 1, subtotal: item.course_price }
    //1 2 3
    setItems([...items, newItem])
    updateLocalStorage([...items, newItem]) // 更新 localStorage
    // alert('已將課程加進購物車')
    Swal.fire({
      toast: true,
      width: 300,
      position: 'top',
      icon: 'success',
      iconColor: '#ff804a',
      title: '已將課程加進購物車',
      showConfirmButton: false,
      timer: 1500,
    })
    console.log('use-cart三、newItems:', [...items, newItem])
  }

  // 總量
  const calTotalItems = () => {
    let total = 0
    for (let i = 0; i < items.length; i++) {
      total += items[i].qty
    }
    return total
  }

  // 總價
  const calTotalPrice = () => {
    let total = 0
    for (let i = 0; i < items.length; i++) {
      total += items[i].subtotal
    }
    return total
  }

  return (
    <CartContext.Provider
      value={{
        items,
        getCourseItemsData,
        addItem,
        addItemAndChangePage,
        remove,
        calTotalItems,
        calTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
