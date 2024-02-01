import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AB_LIST } from '@/components/my-const';
import { useRouter } from 'next/router';
import Footer from '@/components/layout/footer.js';
import Header from '@/components/layout/header.js';
import ProductCard from '@/components/layout/product/productCard';
import styles from '@/styles/productList.module.css';
import Category from '@/components/layout/product/category.js';
import Search from '@/components/layout/product/search.js';
import Sort from '@/components/layout/product/sort.js';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

export default function ProductList() {
  const [data, setData] = useState({});
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [activeButton, setActiveButton] = useState(1);
  const [selectedSort, setSelectedSort] = useState('');

  const getListData = async () => {
    if (page < 1) setPage(1);
    try {
      const response = await fetch(
        AB_LIST + `?page=${page}&category=${selectedCategory}&sort=${selectedSort}`
      );
      const result = await response.json();
      setData(result);
    } catch (ex) {
      console.error('Error fetching data:', ex);
    }
  };

  useEffect(() => {
    getListData();
  }, [page, selectedCategory, selectedSort]);

  const getCategory = () => {
    if (!selectedCategory) {
      return;
    }

    const filteredData = data.rows.filter(
      (product) => product.category_id === selectedCategory
    );

    setData({ rows: filteredData });
  };

  const handlePageButtonClick = (pageNumber) => {
    setPage(pageNumber);
    setActiveButton(pageNumber);
  };
  //排序
  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };
  //搜尋 
  const handleSearch = async (searchTerm) => {
    // 呼叫後端 API 進行搜尋
    const response = await fetch(`/api?page=1&category=${selectedCategory}&sort=${selectedSort}&keyword=${searchTerm}`);
    const result = await response.json();
  
    // 更新前端資料
    setData(result);
  
    // 其他你可能需要的邏輯，例如處理分頁等
  };
  

  return (
    <>
      <Header />
      <div className={styles.main}>
        <div className={styles.listSection}>
          <div>
            <div className={styles.categories}>
              <Category
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  getCategory();
                }}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.searchContainer}>
              <div>
              <Search
                  onSearch={handleSearch}
                  className={styles.search2}
                  aria-label="執行搜尋"
                />
              </div>
              <div>
              <Sort onSortChange={handleSortChange} />
              </div>
            </div>
            <div className={styles.cardContainer}>
              {data.rows &&
                data.rows.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
            </div>
            <div className={styles.buttonContainer}>
              <BiChevronLeft />
              {[1, 2, 3, 4, 5].map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageButtonClick(pageNumber)}
                  id={pageNumber === activeButton ? styles.currentPage : ''}
                >
                  {pageNumber}
                </button>
              ))}
              <BiChevronRight />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

