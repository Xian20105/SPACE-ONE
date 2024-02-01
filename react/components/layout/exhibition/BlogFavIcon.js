import React from 'react'
import { BiHeart, BiSolidHeart } from 'react-icons/bi'
import AuthContext from '@/context/AuthContext'
import { BLOG_FAV_ADD, BLOG_FAV_REMOVE } from '@/components/my-const'
import { useContext } from 'react'
import Swal from 'sweetalert2'

export default function BlogFavIcon({ exhibition_id }) {
  const { auth, blogFav, setBlogFav } = useContext(AuthContext)

  const isFavorited =
    Array.isArray(blogFav) &&
    blogFav.some((fav) => fav.exhibition_id === exhibition_id)
  const handleToggleFav = () => {
    // 更新前端的收藏狀態
    setBlogFav((prevFav) => {
      if (prevFav.some((v) => v.exhibition_id === exhibition_id)) {
        // 如果已經在收藏中，則移除
        return prevFav.filter((v) => v.exhibition_id !== exhibition_id)
      } else {
        // 否則添加
        return [...prevFav, { exhibition_id }]
      }
    })
  }
  //  新增收藏到資料庫
  const handleAddFav = async () => {
    try {
      const r = await fetch(BLOG_FAV_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.member_id,
          exhibition_id: exhibition_id,
        }),
      })
      const data = await r.json()
      if (data.success) {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleToggleFav()
        Swal.fire({
          toast: true,
          width: 300,
          position: 'top',
          icon: 'success',
          iconColor: '#ff804a',
          title: '加入收藏成功',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  // 移除資料庫收藏
  const handleRemoveFav = async () => {
    try {
      const r = await fetch(BLOG_FAV_REMOVE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.member_id,
          exhibition_id: exhibition_id,
        }),
      })
      const data = await r.json()
      if (data.success) {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleToggleFav()
        Swal.fire({
          toast: true,
          width: 300,
          position: 'top',
          icon: 'error',
          iconColor: '#ff804a',
          title: '已將展覽取消收藏',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <>
      {auth.member_id > 0 && (
        <div
          onClick={(event) =>
            isFavorited ? handleRemoveFav(event) : handleAddFav(event)
          }
        >
          {isFavorited ? (
            <BiSolidHeart size={35} color="#80999C" />
          ) : (
            <BiHeart size={35} color="#80999C" />
          )}
        </div>
      )}
    </>
  )
}
