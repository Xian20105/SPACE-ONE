import { useState } from 'react'
import { S_LIST } from '@/components/my-const'
import { useRouter } from 'next/router'

const loadSpaceItems = async (
  startCursor = 0, // 開始指標 startCursor / perpage + 1 = pageNow
  searchCriteria = {},
  perpage = 20,
  maxItems = 400
) => {
  const searchParams = new URLSearchParams(searchCriteria)
  console.log(searchCriteria, searchParams)
console.log(startCursor,perpage);
  // startCursor / perpage + 1 = pageNow
  const page = startCursor ? startCursor / perpage + 1 : 1
  // const r = await fetch(S_LIST + `?page=${page}?keyword=${keyword}`)
  const r = await fetch(S_LIST + `?page=${page}&${searchParams.toString()}`)
  // `?${usp.toString()}`

  const d = await r.json()

  console.log(d.rows)
  // 發生錯誤時，停止無限載入
  if (d.success !== true) {
    return { hasNextPage: false, data: [] }
  }

  const { rows, totalRows } = d
  // total 或 maxITEMS 控制最大載入資料筆數，不能超 maxITEMS 或 total
  if (totalRows >= startCursor + perpage && maxItems >= startCursor + perpage) {
    // 每次載入資料時，回傳 {hasNextPage: 是否有下一頁, data: 新加入的資料}
    return { hasNextPage: true, data: rows }
  } else {
    return { hasNextPage: false, data: [] }
  }
}

export default function useLoadSpaceItems(
  searchCriteria = {},
  perPage = 20,
  maxItems = 400
) {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [hasNextPage, setHasNextPage] = useState(true)
  const [error, setError] = useState()

  async function loadMore() {
    setLoading(true)
    try {
      const { data, hasNextPage: newHasNextPage } = await loadSpaceItems(
        items.length,
        searchCriteria,
        perPage,
        maxItems
      )
      console.log(perPage, maxItems, searchCriteria)

      setItems((current) => [...current, ...data])
      setHasNextPage(newHasNextPage)
      console.log(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { loading, items, hasNextPage, error, loadMore }
}