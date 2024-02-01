import React, { useState, useEffect } from 'react'
import styles from '@/styles/productCategory.module.css'
import { AB_LIST } from '@/components/my-const'

export default function Category({ onCategoryChange, setSelectedCategory }) {
  const [type, setType] = useState()

  // useEffect(() => {
  //   if (type !== undefined) {
  //     // getCategory(type)
  //     setSelectedCategory(type)
  //   }
  // }, [type])

  // const getCategory = async (selectedType) => {
  //   let r
  //   try {
  //     r = await fetch(AB_LIST + `/api/category/${selectedType}`)
  //     const d = await r.json()

  //     if (d && d.rows) {
  //       // 商品篩選邏輯
  //       const filteredData = d.rows.filter(
  //         (product) => product.category_id === selectedType
  //       )

  //       // 將選擇的分類和分類下的商品傳遞給父組件
  //       onCategoryChange({ category_id: selectedType, products: filteredData })
  //     } else {
  //       console.error('Invalid API response:', d)
  //     }
  //   } catch (ex) {
  //     console.error('Error fetching data:', ex)
  //     console.error('API response:', await r.text()) // log API response
  //   }
  // }

  return (
    <>
      <div>
        <h1>商品分類</h1>
      </div>
      <div>
      <button
          className={`${styles.category} ${type === 'all' ? styles.selected : ''}`}
          onClick={() => {
            setSelectedCategory('all');
            console.log('Button clicked. Type: all');
          }}
        >
          全部商品
        </button>
        <button
          className={`${styles.category} ${type === 1 ? styles.selected : ''}`}
          onClick={() => {
            setSelectedCategory(1)
            console.log('Button clicked. Type:', 1)
          }}
        >
          縫紉機
        </button>
        <button
          className={`${styles.category} ${type === 2 ? styles.selected : ''}`}
          onClick={() => {
            setSelectedCategory(2)
            console.log('Button clicked. Type:', 2)
          }}
        >
          縫紉周邊商品
        </button>
        <button
          className={`${styles.category} ${type === 3 ? styles.selected : ''}`}
          onClick={() => {
            setSelectedCategory(3)
            console.log('Button clicked. Type:', 3)
          }}
        >
          手作書籍
        </button>
      </div>
    </>
  )
}
