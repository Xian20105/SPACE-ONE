import styles from '@/styles/course-card.module.css'
import DateIcon from './course-item/date-icon'
import Link from 'next/link'
import Image from 'next/image'

export default function CourseCard({
  course_id = 0,
  course_date = '',
  course_name = '',
  course_price = 0,
  course_photo = '',
}) {
  return (
    <>
      {/* 單張的卡片 */}
      <Link href={`/course/${course_id}`}>
        {/* <img
          className={styles.cardPhoto}
          src="/course/images/test-01.png"
          alt=""
        /> */}
        <Image
          className={styles.cardPhoto}
          src={`/course/images/${course_photo.split(',')[0]}`}
          alt=""
          width={500}
          height={500}
        />
        <div className={styles.dateAndFavicon}>
          <div className={styles.iconAndDateAndWeek}>
            <DateIcon />
            <div className={styles.date}>{course_date}</div>
          </div>
        </div>
        <div className={styles.p3}>{course_name}</div>
        <div className={styles.moneyIconAndPrice}>
          <div className={styles.t2En}>$</div>
          <div className={styles.t2En}>{course_price}</div>
        </div>
      </Link>
    </>
  )
}
