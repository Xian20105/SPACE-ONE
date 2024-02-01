import React from 'react'
import styles from '@/styles/teacher-comment.module.css'
import Image from 'next/image'

import UserComment from '@/components/layout/course/teacher-comment/user-comment/user-comment'
// import StarIcon from '@/components/layout/course/teacher-comment/user-comment/star-icon'

export default function TeacherComment({
  teacher_name = '',
  teacher_intro = '',
  teacher_photo = '',
  course_name = '',
}) {
  return (
    <>
      {/* test
      <div>
        <div>
          shin edit: data.length (用 length 判斷陣列是否有值)
          {data.length &&
            data.map((v, i) => {
              return (
                <div key={v.course_id}>
                  <div className={styles.h2 + ' ' + styles.courseName}>
                    id:動態路由,{v.teacher_name}
                  </div>
                  <div className={styles.h2 + ' ' + styles.courseName}>
                    name:動態路由,name:{v.course_name}
                  </div>
                </div>
              )
            })}
        </div>
      </div> */}

      {/* <div>講師評價</div> */}
      <div>
        <div className={styles.teacher}>
          <Image
            className={styles.teacherPhoto}
            src={`/course/images/${teacher_photo.split(',')[0]}`}
            alt=""
            width={500}
            height={500}
          />

          {/* <img
            className={styles.teacherPhoto}
            src="/course/images/test-02.png"
            alt=""
          /> */}
          <div className={styles.teacherTextSection}>
            <div className={styles.teacherSection}>
              <div className={styles.teacherInfo}>
                <div className={styles.teacherNameAndStar}>
                  <div className={styles.teacherName + ' ' + styles.h4}>
                    {teacher_name}
                  </div>
                  <div className={styles.teacherStars}>
                    {/* 評價星星 */}
                    {/* <StarIcon /> */}
                  </div>
                </div>
                {/* <div className={styles.courseName}>{course_name}</div> */}
                <div className={styles.teacherIntro}>{teacher_intro}</div>
                {/*<div>
                        前往講師介紹頁面Button
                        {/* 要改成component
                      </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
