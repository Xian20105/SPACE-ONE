import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/spacecard.module.css'

export default function SpaceCard({
  space_id = 'S0001',
  image = 'preview.png',
  people = 6,
  title = 'test',
  near = '',
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
      <Link href={`/space/${space_id}`} className={styles.card}>
        <span className={styles.people}>{people}人</span>
        <Image
          src={`/space/${image}`}
          alt=""
          width={300}
          height={225}
          className={styles.image}
        />
        <div>
          <div className={styles.first}>
            <p className={styles.title}>{title}</p>
            <p className={styles.near}>{near}</p>
          </div>
          <p className={styles.price}>$ {price} /小時</p>
        </div>
      </Link>
    </>
  )
}
