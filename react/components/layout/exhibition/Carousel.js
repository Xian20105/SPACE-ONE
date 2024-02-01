import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import 'swiper/css/scrollbar'
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules'

export default function Carousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
      <SwiperSlide>
        <Image
          src="/exhibition/B2.JPG"
          alt="Sheep"
          width={1920}
          height={650}
          style={{  objectFit: 'cover'}}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/exhibition/B3.avif"
          alt="Sheep"
          width={1920}
          height={650}
          style={{  objectFit: 'cover' }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/exhibition/B1.jpeg"
          alt="Sheep"
          width={1920}
          height={650}
          style={{ objectFit: 'cover' }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/exhibition/B4.avif"
          alt="Sheep"
          width={1920}
          height={650}
          style={{  objectFit: 'cover'  }}
        />
      </SwiperSlide>
    </Swiper>
  )
}
