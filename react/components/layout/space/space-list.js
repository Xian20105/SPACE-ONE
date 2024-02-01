import React from 'react'
import SpaceCard from './space-card'

export default function SpaceList() {
  return (
    <>
      {data && (
        <div className={styles}>
          {data.map((v, i) => {
            <SpaceCard key={i} title={v.title} />
          })}
        </div>
      )}
    </>
  )
}
