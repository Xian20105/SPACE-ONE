import { useState, useEffect } from 'react'
import CFCard from './CFCard'
import { EX_FALL } from '@/components/my-const'
import InfiniteScroll from 'react-infinite-scroll-component'

const InfiniteScrollComponent = ({ type }) => {
  const [exData, setExData] = useState([])
  const [order, setOrder] = useState(2)
  const [newData, setNewData] = useState([1])

  //第一次取資料＆換種類後第一次取資料
  useEffect(() => {
    setExData([])
    setOrder(2)
    const fetchDataFirst = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch(EX_FALL + `?type=${type}&order=${1}`)
        const data = await response.json()

        // Set the fetched data into the state
        setExData((prev) => [...prev, ...data.result])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    // Call the fetchData function
    fetchDataFirst()
  }, [type])

  const fetchMoreData = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(EX_FALL + `?type=${type}&order=${order}`)
      const data = await response.json()

      // Set the fetched data into the state
      setNewData(data.result)
      setExData((prev) => [...prev, ...data.result])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getMore = () => {
    setOrder((prev) => prev + 1)
    setTimeout(() => {
      fetchMoreData()
    }, 1500)
  }

  const exCard = exData.map((data, i) => {
    return <CFCard key={i} exhibition={data} />
  })
  123
  return (
    <>
      <InfiniteScroll
        dataLength={exData.length}
        next={getMore}
        hasMore={true}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '60px',
        }}
      >
        {exCard}
      </InfiniteScroll>
      {/* <h3 style={{ textAlign: 'left', width: '60%', color: '#80999C' }}>
        {newData.length > 0 ? 'Loading...' : ''}
      </h3> */}
    </>
  )
}

export default InfiniteScrollComponent
