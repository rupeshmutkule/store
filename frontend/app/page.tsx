'use client';

import Header from './components/Header';
import Slider from './components/Slider';
import Banners from './components/Banners';
import NewArrivals from './components/NewArrivals';
import SalesEvent from './components/SalesEvent';
import PopularProducts from './components/PopularProducts';
import LatestPosts from './components/LatestPosts';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full">
        <Slider />
      </div>
      <div className="dima-main">
        <Banners />
        <NewArrivals />
        <SalesEvent />
        <PopularProducts />
        <LatestPosts />
      </div>
      <Footer />
    </>
  );
}
