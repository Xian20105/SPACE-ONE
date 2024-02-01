import React from 'react'
import styles from '@/styles/cart.module.css'
import { useEffect, useState } from 'react'

export default function CartList({ items = [], increment, decrement, remove }) {

  console.log('一、cart-list: items:', items)
  // CartList 要接收items，並 map 出來
  return (
    <>
      <ul className={styles['list']}>
        {items.map((v, i) => {
          return (
            <li key={v.reward_id} className={styles['item']}>
              <div className={styles['w-400']}>{v.reward_name}</div>
              <div>{v.reward_price}</div>
              <div>
                <button
                  onClick={() => {
                    increment(items, v.reward_id)
                  }}
                >
                  +
                </button>
                <span>{v.qty}</span>
                <button
                  onClick={() => {
                    if (v.qty === 1) {
                      // 移除商品數量要為0的
                      remove(items, v.reward_id)
                      // alert('至少要買一樣商品')
                      return // 跳出函式，接下來的程式不執行
                    }
                    decrement(items, v.reward_id)
                  }}
                >
                  -
                </button>
              </div>
              <div>{v.subtotal}</div>
              <div>
                <button
                  onClick={() => {
                    remove(items, v.exhibition_id)
                  }}
                >
                  移除
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}