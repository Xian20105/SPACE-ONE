import '@/styles/globals.css'
import '@/assets/font/font.css'
import { AuthContextProvider } from '@/context/AuthContext'
import { ProductCartContextProvider } from '@/context/product-cart-context'
import { CartProvider } from '@/hooks/use-cart'

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    <AuthContextProvider>
      <CartProvider>
        <ProductCartContextProvider>
          <Component {...pageProps} />
        </ProductCartContextProvider>
      </CartProvider>
    </AuthContextProvider>
  )
}
