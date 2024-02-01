import React, { useState } from 'react';
import styles from '@/styles/productSearch.module.css';
import { BiSearch } from 'react-icons/bi';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed');
      onSearch(searchTerm);
    }
  };
  

  return (
    <div className={styles.search}>
      <label htmlFor="searchTerm">
        <input
          type="text"
          id="searchTerm"
          value={searchTerm}
          placeholder="搜尋商品"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </label>
      <BiSearch
        onClick={handleSearch}
        className={styles.search2}
        aria-label="執行搜尋"
      />
    </div>
  );
};

export default Search;
