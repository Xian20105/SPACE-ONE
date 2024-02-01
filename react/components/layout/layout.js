import ScrollToTop from '../common/scroll-to-top'
import Breadcrumb from './breadcrumb'
import Footer from './footer'
import Header from './header'
import Head from 'next/head'

export function Layout({ children }) {
  return (
    <>
      <Head>
        <title>SPACE ONE</title>
      </Head>
      <Header />
      <ScrollToTop />
      <Breadcrumb />
      <div className="container">{children}</div>
      <Footer />
    </>
  )
}
