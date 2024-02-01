import React, { createContext, useEffect, useState } from 'react'

const ProductCartContext = createContext({})

export default ProductCartContext

// 登入狀態: 可以登入, 可以登出, 狀態資料(會員id, email, nickname, token)
export const initProduct = {
  product_id: '',
  product_name: '',
  price: 0,
}

export const ProductCartContextProvider = ({ children }) => {
  const [product, setProduct] = useState(initProduct);

  useEffect(() => {
    const str = localStorage.getItem('product');

    if (str) {
      try {
        const data = JSON.parse(str);
        console.log(data);
        if (data.product_id) {
          const { product_id, product_name, price } = data;
          setProduct({ product_id, product_name, price });
        }
      } catch (ex) {}
    }
  }, []);

  return (
    <ProductCartContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductCartContext.Provider>
  );
};
