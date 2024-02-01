import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import 'swiper/css/scrollbar'
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules'

export default function CourseListCarousel() {
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
          src="/course/images/c-b-1.jpg"
          alt="Sheep"
          objectFit="cover"
          width={1074}
          height={600}
          style={{ width: '100%', objectFit: 'cover' }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/course/images/c-b-2.jpeg"
          alt="Sheep"
          width={1074}
          height={600}
          style={{ width: '100%', objectFit: 'cover' }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/course/images/c-b-3.JPG"
          alt="Sheep"
          width={1074}
          height={600}
          style={{ width: '100%', objectFit: 'cover' }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/course/images/c-b-4.jpg"
          alt="Sheep"
          width={1074}
          height={600}
          style={{ width: '100%', objectFit: 'cover' }}
        />
      </SwiperSlide>
    </Swiper>
  )
}
