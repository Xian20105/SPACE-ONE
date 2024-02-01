import styles from '@/styles/Toggle.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { EX_GET_ONE } from '@/components/my-const'
import ExTabBar from '@/components/layout/exhibition/ExTabBar'

const Toggle = ({ onContentTabClick, onCommentTabClick }) => {
  // router 獲得動態路由
  const router = useRouter()
  const [data, setData] = useState({
    exhibition_id: 0,
    exhibition_name: '',
    start_time: '',
    end_time: '',
    exhibition_intro: '',
    exhibition_target: 0,
    total_price: 0,
  })

  // 向伺服器要資料
  const getListData = async () => {
    console.log('router.query:', router.query)
    let page = +router.query.page || 1
    if (page < 1) page = 1
    try {
      const r = await fetch(EX_GET_ONE + `?cf_id=${router.query.exhibition_id}`)
      const d = await r.json()

      setData(d)
    } catch (ex) {}
  }

  // useEffect(() => {
  //   const cf_id = +router.query.exhibition_id
  //   console.log({ cf_id, raw: router.query.exhibition_id })
  //   if (router.query.exhibition_id !== undefined) {
  //     if (!cf_id) {
  //       router.push('/exhibition/cf')
  //     } else {
  //       getListData(cf_id)
  //     }
  //   }
  // }, [router.query.exhibition_id])

  useEffect(() => {
    getListData()
  }, [router.query.exhibition_id])

  return (
    <div className={styles.tabBarContainer}>
      <div className={styles.tabBar}>
        <ExTabBar text={'內容'} onClick={onContentTabClick} />
      </div>
      <div>
        <ExTabBar text={'留言'} onClick={onCommentTabClick} />
      </div>
    </div>
  )
}

export default Toggle
