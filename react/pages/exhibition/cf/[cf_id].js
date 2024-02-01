import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
// import { useCart } from '@/hooks/use-exhibition-cart'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import Image from 'next/image'
import styles from '@/styles/exhibition-CFdetail.module.css'
import { EX_GET_ONE } from '@/components/my-const'
import Counter from '@/components/layout/exhibition/Counter'
import Toggle from '@/components/layout/exhibition/Toggle'
import ProgressBar from '@/components/layout/exhibition/ProgressBar'
import Comment from '@/components/layout/exhibition/Comment'
import Content from '@/components/layout/exhibition/Content'
// import { BiHeart, BiSolidHeart } from 'react-icons/bi'
import { Sticky, StickyContainer } from 'react-sticky'
import BlogFavIcon from '@/components/layout/exhibition/BlogFavIcon'
import AuthContext from '@/context/AuthContext.js'

export default function CFcontent() {
  //--- 加入購物車 ---
  // const { addItem } = useCart()

  //--- 回覆留言 ---
  const { auth } = useContext(AuthContext)
  const [mid, setMid] = useState(auth.member_id) //（）內填入你要auth的什麼

  //--- 收藏狀態 ---
  const [isLiked, setLiked] = useState(false)
  const handleLikedClick = () => {
    setLiked(!isLiked)
  }
  //--- 切換內容狀態 ---
  const [isContentVisible, setContentVisible] = useState(true)
  const [isCommentVisible, setCommentVisible] = useState(false)

  const handleContentTabClick = () => {
    setContentVisible(true)
    setCommentVisible(false)
  }

  const handleCommentTabClick = () => {
    setContentVisible(false)
    setCommentVisible(true)
  }

  //--- progress bar狀態 ---
  const [currentAmount, setCurrentAmount] = useState() // 目前金額
  const [targetAmount, setTargetAmount] = useState() // 目標金額

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAmount((prevAmount) =>
        prevAmount >= targetAmount ? 0 : prevAmount
      )
    }, 10)
    // 在 currentAmount 達到 targetAmount 時清除 interval
    if (currentAmount >= targetAmount) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [targetAmount, currentAmount])

  const progress = (currentAmount / targetAmount) * 100

  //--- router 獲得動態路由 ---
  const router = useRouter()
  const [data, setData] = useState({
    exhibition_id: '',
    exhibition_name: '',
    start_time: '',
    end_time: '',
    exhibition_intro: '',
    exhibition_target: 0,
    exhibition_people: 0,
    total_price: 0,
    exhibition_desc: '',
    section_one: '',
    section_two: '',
    name: '',
  })

  //  --- 照片 ---
  const [photo, setPhoto] = useState({ exhibition_photo: [] })
  // --- 留言 ---
  const [message, setMessage] = useState([])
  //--- 上方日期切割 ---
  const formattedStartDate = formatDate(data.start_time)
  const formattedEndDate = formatDate(data.end_time)

  function formatDate(dateString) {
    try {
      const dateObject = new Date(dateString)
      return dateObject.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch (error) {
      console.error('Invalid date format:', dateString)
      return 'Invalid Date'
    }
  }

  //留言日期切割
  // const formattedCreateDate = formatCreateDate(message.create_date)
  // console.log(message)

  // 留言日期切割
  // function formatCreateDate(dateString) {
  //   try {
  //     const dateObject = new Date(dateString)
  //     const now = new Date()
  //     const timeDiff = now - dateObject

  //     // 如果時間差小於一天，只顯示小時
  //     if (timeDiff < 24 * 60 * 60 * 1000) {
  //       const hours = dateObject.getHours()
  //       const minutes = dateObject.getMinutes()
  //       const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`
  //       return formattedTime
  //     }

  //     // 超過一天，顯示西元年月日
  //     return dateObject.toLocaleString('en-US', {
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //     })
  //   } catch (error) {
  //     console.error('Invalid date format:', dateString)
  //     return 'Invalid Date'
  //   }
  // }

  //留言
  const [myForm, setMyForm] = useState({
    message_id: 0,
    exhibition_id: '',
    member_id: '',
    comment: '',
  })

  useEffect(() => {
    console.log(myForm)
  }, [myForm])

  const getListData = async (exhibition_id) => {
    try {
      const r = await fetch(EX_GET_ONE + `/${exhibition_id}`)
      const d = await r.json()
      setData(d.result)
      console.log('d.result:', d.result)
      setPhoto(d.photo.exhibition_photo.split(','))
      setMessage(d.message)
      setMessage((prevMessages) =>
        prevMessages.sort((a, b) => {
          const dateA = new Date(a.create_date)
          const dateB = new Date(b.create_date)
          return dateB - dateA // 由新到舊排序
        })
      )

      setMyForm((prevForm) => ({
        ...prevForm,
        exhibition_id: d.result.exhibition_id,
        member_id: d.result.member_id,
        message_id: d.message.message_id,
      }))
      setCurrentAmount(d.result.total_price)
      setTargetAmount(d.result.exhibition_target)
      setMyForm((prevForm) => ({
        ...prevForm,
        exhibition_id: d.result.exhibition_id,
        member_id: d.result.member_id,
        message_id: d.message.message_id,
      }))
      // console.log('123', d.result)
    } catch (ex) {
      console.error(ex)
    }
  }
  //向伺服器要資料
  useEffect(() => {
    const exhibition_id = router.query.cf_id
    if (exhibition_id !== undefined) {
      const cf_id = String(exhibition_id)
      // console.log({ cf_id, raw: exhibition_id })

      if (!cf_id) {
        router.push('/exhibition/cf')
      } else {
        getListData(cf_id)
      }
    }
    //回覆留言
    // setMid(AuthContext.member_id)
    // console.log('123', router.query.cf_id, exhibition_id)
  }, [router.query.cf_id])

  return (
    <>
      <Header />
      <div className={styles.section1}>
        <div className={styles.img}>
          <Image
            variant="top"
            src={`/exhibition/${photo[0]}`}
            alt="Sheep"
            width={800}
            height={600}
            style={{ borderRadius: 10, objectFit: 'cover', marginLeft: 30 }}
            priority
          />
        </div>
        <div className={styles.rightContent}>
          <div className={styles.TopContainer}>
            <div className={styles.proposer}>
              <div className={styles.proposerGroup}>
                <p className={styles.proposerText}>提案人</p>
                <p className={styles.proposerTextC}>{data.name}</p>
              </div>
              <div
                role="presentation"
                onClick={handleLikedClick}
                className={styles.love}
              >
                <BlogFavIcon exhibition_id={data.exhibition_id} />
                {/* {isLiked ? (
                  <BiSolidHeart style={{ fontSize: 30, color: '#80999C' }} />
                ) : (
                  <BiHeart style={{ fontSize: 30, color: '#80999C' }} />
                )} */}
              </div>
            </div>
            <p className={styles.title}>{data.exhibition_name}</p>
          </div>
          <div className={styles.priceGroup}>
            {/* ’目前募資人數‘應該要從order表單撈進來並且更新,不能寫在展覽表單內 */}
            <p className={styles.price}>$ {currentAmount}</p>
            <div className={styles.container}>
              <div className={styles.bar}>
                <ProgressBar
                  currentAmount={currentAmount}
                  targetAmount={targetAmount}
                />
              </div>
              <p className={styles.barText}>{progress.toFixed(0)}%</p>
            </div>
            <p className={styles.target}>目標金額 $ {targetAmount}</p>
          </div>
          <div className={styles.textArea}>
            <p className={styles.text1}>{data.exhibition_intro}</p>
          </div>
          <div className={styles.info}>
            <div className={styles.text2}>
              <div className={styles.counter}>
                <Counter endTimeProp={data.end_time} />
              </div>
              {/* ’贊助人次‘應該要從order表單撈進來並且更新,不能寫在展覽表單內 */}
              <p>贊助人次 {data.exhibition_people}人</p>
              <p>
                募資日期 {formattedStartDate} - {formattedEndDate}
              </p>
            </div>
          </div>
          <div className={styles.bigButton}>
            <button
            // onClick={() => {
            //   addItem(data)
            // }}
            >
              <p>贊助計畫</p>
            </button>
          </div>
        </div>
      </div>

      {/* 中間tabBar */}
      <StickyContainer>
        <div>
          <Sticky topOffset={-8} className={styles.sticky}>
            {({ style }) => (
              <div style={{ ...style, width: '100%', zIndex: 1000 }}>
                <Toggle
                  onContentTabClick={handleContentTabClick}
                  onCommentTabClick={handleCommentTabClick}
                />
              </div>
            )}
          </Sticky>

          {/* 內容區塊 */}
          {/* 判斷 現在使用者是點擊內容還是留言 
          iScomment ? <comment /> : <content />
          */}
          {isContentVisible && <Content photo={photo} data={data} />}
          {isCommentVisible && (
            <Comment
              message={message}
              myForm={myForm}
              eid={router.query.cf_id}
              mid={mid}
              getListData={getListData}
            />
          )}
        </div>
      </StickyContainer>
      <Footer />
    </>
  )
}
