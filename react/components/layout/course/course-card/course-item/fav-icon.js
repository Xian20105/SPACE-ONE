// 實心圖
import { BiSolidHeart } from 'react-icons/bi'
// 空心圖
import { BiHeart } from 'react-icons/bi'

export default function FavIcon({ handleToggleFav }) {
  //要記得引入
  return (
    <>
      <BiHeart />
      {/* <Image
        src={fav ? bookmarkIconFill : bookmarkIcon}
        alt=""
        onClick={() => {
          handleToggleFav(isbn)
        }}
      /> */}
    </>
  )
}
