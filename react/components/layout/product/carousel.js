import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// import required modules
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'

export default function App({ productPhotos }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const ProductCard = ({ product }) => {}
  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#80999C',
          '--swiper-pagination-color': '#80999C',
          margin: '20px',
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {productPhotos.map((v) => {
          return (
            <SwiperSlide
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              key={v}
            >
              <img src={`/product/${v}`} width={500} height={500} />
            </SwiperSlide>
          )
        })}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={1}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {productPhotos.map((v) => {
          return (
            <SwiperSlide key={v}>
              <img src={`/product/${v}`} width={120} height={120} />
            </SwiperSlide>
          )
        })}
        {/* <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-2.jpg"
            width={120}
            height={120}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-3.jpg"
            width={120}
            height={120}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-3.jpg"
            width={120}
            height={120}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-3.jpg"
            width={120}
            height={120}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-3.jpg"
            width={120}
            height={120}
          />
        </SwiperSlide> */}
      </Swiper>
    </>
  )
}
