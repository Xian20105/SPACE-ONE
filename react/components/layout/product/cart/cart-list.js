import React from 'react'
export default function CartList({ items = [], increment, decrement }) {
  return (
    <>
        {items.map((v, i) => {
          return (
            <li key={v.id}>
              <div>{v.name}</div>
              <div>{v.price}</div>
              <div>
                <button
                  onClick={() => {
                    increment(items, v.id)
                  }}
                >
                  +
                </button>
                <span>{v.qty}</span>
                <button
                  onClick={() => {
                    decrement(items, v.id)
                  }}
                >
                  -
                </button>
              </div>
              <div>
                <button onClick={() => {}}>移除</button>
              </div>
            </li>
          )
        })}
    </>
  )
}
