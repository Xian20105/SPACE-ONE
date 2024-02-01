import { useEffect, useRef, useState } from 'react'
import styles from '@/styles/scrolltotop.module.css'
import { BiChevronUp } from 'react-icons/bi'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(function () {
    window.addEventListener('scroll', function (e) {
      // 滚动条滚动高度
      const scrollTop = document.documentElement.scrollTop
      // 可视区域高度
      const clentHeight = document.documentElement.clientHeight
      // 滚动内容高度
      const scrollHeight = document.documentElement.scrollHeight

      if (scrollTop > 600) {
        setShow(true)
      } else if(scrollTop==0){
        setShow(false)
      }
    })
  }, [])

  const tabRef = useRef(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setShow(false)
  }
  return (
    <>
      <div ref={tabRef}></div>
      <div onClick={scrollToTop} className={show?styles.btn:styles.hide}>
        <BiChevronUp size={36} />
      </div>
    </>
  )
}
