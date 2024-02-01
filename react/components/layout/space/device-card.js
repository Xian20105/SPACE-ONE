import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/spacecard.module.css'

export default function DeviceCard({
  device_id='D0001',
  image = '/preview.png',
  title = 'test',
  price = 199,
}) {
  // const items = [
  //   {
  //     id: 0,
  //     image: '/preview.png',
  //     title: 'test',
  //     price: 199,
  //   },
  // ]
  return (
    <>
      <Link href={`/space/${device_id}`} className={styles.card}>
        <Image
          src={image}
          alt=""
          width={300}
          height={225}
          className={styles.image}
        />
        <div>
          <p className={styles.title}>{title}</p>
          <p className={styles.price}>$ {price}起</p>
        </div>
      </Link>
    </>
  )
}
