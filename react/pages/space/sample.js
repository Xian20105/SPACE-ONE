const getListData = async () => {
  const usp = new URLSearchParams(router.query)

  //console.log('router.query:', router.query)
  let page = +router.query.page || 1

  // 關鍵字搜尋
  let keyword = router.query.keyword || ''

  if (page < 1) page = 1
  try {
    const r = await fetch(BLOG_LIST + `?${usp.toString()}`)
    const d = await r.json()
    console.log(d)
    setData(d)
  } catch (ex) {
    console.log(ex)
  }
}

return (
  <>
    <input
      type="search"
      className={styles['bg-search']}
      id="bg-search"
      placeholder="請輸入搜尋關鍵字"
      name="keyword"
      onChange={(e) => {
        // setKeyword(e.currentTarget.value)

        router.push(
          {
            pathname: '/blog',
            query: { ...router.query, keyword: e.target.value },
          },
          undefined,
          { scroll: false }
        )
      }}
    />
  </>
)
