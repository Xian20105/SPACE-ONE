import { useContext, useState } from 'react'

// 宣告要使用的context
import { createContext } from 'react'
import ProductCartContext from '@/context/product-cart-context'
export function CartProvider({ children }) {
  
  const [items, setItems] = useState([])
  const CartContext = createContext(null)
  
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

    for (let i = 0; i < items.length; i++) {
      total += items[i].subtotal
    }

    return total
  }

  // reduce (累加，歸納) 2 -> 1
  // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  const totalItems = items.reduce((acc, v) => acc + v.qty, 0)
  const totalPrice = items.reduce((acc, v) => acc + v.subtotal, 0)
  // const totalPrice = items.reduce((acc, v) => acc + v.qty*v.price, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        increment,
        decrement,
        remove,
        calTotalItems,
        calTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useProductCart() {
  return useContext(ProductCartContext)
}