import { useState, useEffect } from 'react'
import styles from '@/styles/exhibition-comment.module.css'
import User from '@/components/layout/exhibition/User'
import Message from '@/components/layout/exhibition/Message'

export default function CommentList({
  eid,
  mid,
  message,
  myForm,
  getListData,
}) {
  const [comment, setComment] = useState([])

  useEffect(() => {
    setComment(message)

    // console.log('eddie', message.length ,message);
  }, [message])

  const handleNewComment = (newComment) => {
    // 在這裡更新留言列表
    setComment((prevComments) => [...prevComments, newComment])
  }

  return (
    <>
      <div id="content">
        <div className={styles.commentContainer}>
          <div>
            <div className={styles.commentContainer}>
              <Message
                onNewComment={handleNewComment}
                myForm={myForm}
                eid={eid}
                mid={mid}
                getListData={getListData}
              />
            </div>
            <div className={styles.replyGroup}>
              <div className={styles.mContainer}>
                {message.length > 0 &&
                  message.map((v) => {
                    return <User key={v.message_id} data={v} />
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
