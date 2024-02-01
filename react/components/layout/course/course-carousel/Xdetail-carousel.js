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

export default function DetailCarousel() {
  // export default function App() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  return (
    <>
      {/* 大圖 */}
      <Swiper
        style={{
          '--swiper-navigation-color': '#80999C',
          '--swiper-pagination-color': '#80999C',
          margin: '20px',
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        a
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src="/course/test-02.png" width={500} height={500} />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="https://swiperjs.com/demos/images/nature-2.jpg"
            width={500}
            height={500}
          />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src="/course/test-02.png" width={500} height={500} />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="https://swiperjs.com/demos/images/nature-4.jpg"
            width={500}
            height={500}
          />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="https://swiperjs.com/demos/images/nature-4.jpg"
            width={500}
            height={500}
          />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="https://swiperjs.com/demos/images/nature-4.jpg"
            width={500}
            height={500}
          />
        </SwiperSlide>
      </Swiper>

      {/* 小圖 */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-1.jpg"
            width={120}
            height={120}
          />
        </SwiperSlide>
        <SwiperSlide>
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
        </SwiperSlide>
      </Swiper>
    </>
  )
}
