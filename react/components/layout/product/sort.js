import React from 'react'
import { useState } from 'react'
import styles from '@/styles/productSort.module.css'
import { BiDownArrowAlt,BiUpArrowAlt } from "react-icons/bi";

export default function Sort({ onSortChange }) {
  const [sortBy, setSortBy] = useState('');

  const handleSortChange = (e) => {
    const selectedSortValue = e.target.value;
    setSortBy(selectedSortValue);
    onSortChange(selectedSortValue);
    console.log('Sort changed to:', selectedSortValue);
  };

  return (
    <div className={styles.sortA}>
      <label htmlFor="sortBy"></label>
      <select
        className={styles.sortB}
        id="sortBy"
        value={sortBy}
        onChange={handleSortChange}
      >
        <option value="">選擇排序</option>
        <option value="price_asc">最低價格</option>
        <option value="price_desc">最高價格</option>
      </select>
    </div>
  );
}