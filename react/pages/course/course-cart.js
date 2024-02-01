import React from 'react'
import Header from '@/components/layout/header.js'
import Footer from '@/components/layout/footer.js'
import styles from '@/styles/course-cart.module.css'
import Link from 'next/link'
import CartList from '@/components/layout/course/cart/cart-list'

import { useState } from 'react'

// hooks
import { useCart } from '@/hooks/use-cart'
import Head from 'next/head'

// import { BiCheckbox, BiPlusCircle, BiMinusCircle } from 'react-icons/bi'
export default function Cart() {
  const { items, getCourseItemsData, remove, calTotalItems, calTotalPrice } =
    useCart()
  console.log('一、cart: items:', items)

  const total = calTotalPrice()

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
          {/* 表頭 */}
          {/* <div className={styles.cartContainer}>
            <div className={styles.cartTitle}>
              <div>課程名稱</div>
              <div>課程價格</div>
            </div>
          </div> */}

          {/* 表內文 */}
          <div className={styles.cartText}>
            <div>
              <div className={styles['cart']}>
                {/* 在course-cart的檔案裡，傳 type={'cart'} 把"remove的button"呈現出來 */}
                <CartList items={items} remove={remove} type={'cart'} />
              </div>
            </div>
          </div>

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
          <div className={styles.buttonContainer}>
            <div className={styles.button1}>
              <button>
                <Link href={`/course`}>繼續逛逛</Link>
              </button>
            </div>
            <div className={styles.button2}>
              <button>
                <Link href={`/course/course-checkout`}>來去結帳</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
