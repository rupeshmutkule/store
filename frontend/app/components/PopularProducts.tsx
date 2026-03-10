import ProductCard from './ProductCard';

export default function PopularProducts() {
  const products = [
    { id: 1, name: "Product Name Goes Here", price: 149.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD01004/India-Circus-by-Krsnaa-Mehta-Tundra-Tiger-Porcelain-Coffee-Mug-52152101SD01004-2.jpg", category: "watches" },
    { id: 2, name: "Product Name Goes Here", price: 124.99, oldPrice: 249.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD01001/India-Circus-by-Krsnaa-Mehta-Peacock-Palace-Porcelain-Coffee-Mug-52152101SD01001-2.jpg", onSale: true, category: "shoes" },
    { id: 3, name: "Product Name Goes Here", price: 189.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD00999/India-Circus-by-Krsnaa-Mehta-Monkey-Moors-Porcelain-Coffee-Mug-52152101SD00999-2.jpg", category: "watches" },
    { id: 4, name: "Product Name Goes Here", price: 124.99, oldPrice: 249.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD01005/India-Circus-by-Krsnaa-Mehta-Vivacious-Vinca-Porcelain-Coffee-Mug-52152101SD01005-2.jpg", onSale: true, category: "clothing" },
    { id: 5, name: "Product Name Goes Here", price: 149.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD01003/India-Circus-by-Krsnaa-Mehta-Stellar-Stars-Porcelain-Coffee-Mug-52152101SD01003-2.jpg", category: "shoes" },
    { id: 6, name: "Product Name Goes Here", price: 124.99, oldPrice: 249.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD01001/India-Circus-by-Krsnaa-Mehta-Peacock-Palace-Porcelain-Coffee-Mug-52152101SD01001-2.jpg", onSale: true, category: "clothing" },
    { id: 7, name: "Product Name Goes Here", price: 189.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD01000/India-Circus-by-Krsnaa-Mehta-Nightingales-Night-Porcelain-Coffee-Mug-52152101SD01000-2.jpg", category: "shoes" },
    { id: 8, name: "Product Name Goes Here", price: 124.99, oldPrice: 249.99, image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/n/g/ngcpr-collection-karvy-stoneware-mug-52152101sd01063-7.jpg", onSale: true, category: "clothing" }
  ];

  return (
    <section className="section">
      <div className="page-section-content overflow-hidden">
        <div className="container text-center">
          <h2 data-animate="fadeInDown" data-delay="0">POPULAR PRODUCTS</h2>
          <div className="topaz-line no-bottom-margin">
            <i className="di-separator"></i>
          </div>
          <div className="clear-section"></div>
          <nav role="navigation" className="filters-box filters" id="filters" data-animate="fadeInUp" data-delay="0">
            <ul>
              <li><a data-filter="*" className="show-all">All</a></li>
              <li><a data-filter=".clothing">Clothing</a></li>
              <li><a data-filter=".shoes">Shoes</a></li>
              <li><a data-filter=".watches">Watches</a></li>
            </ul>
          </nav>
          <div className="products-grids dima-isotope-container isotope-with-margin" suppressHydrationWarning>
            <ul className="boxed-protfolio">
              {products.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </ul>
          </div>
          <a data-animated-link="fadeOut" className="  no-rounded uppercase fill small button animated fadeIn">show more</a>
        </div>
      </div>
    </section>
  );
}
