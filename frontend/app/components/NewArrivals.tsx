import ProductCard from './ProductCard';

export default function NewArrivals() {
  const products = [
    {
      id: 1,
      name: "Product Name Goes Here",
      price: 149.99,
      image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/n/g/ngcpr-collection-karvy-stoneware-mug-52152101sd01063-7.jpg",
      delay: 200
    },
    {
      id: 2,
      name: "Product Name Goes Here",
      price: 124.99,
      oldPrice: 249.99,
      image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD01005/India-Circus-by-Krsnaa-Mehta-Vivacious-Vinca-Porcelain-Coffee-Mug-52152101SD01005-2.jpg",
      onSale: true,
      delay: 400
    },
    {
      id: 3,
      name: "Product Name Goes Here",
      price: 189.99,
      image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD00997/India-Circus-by-Krsnaa-Mehta-Jelling-Jaguars-Porcelain-Coffee-Mug-52152101SD00997-2.jpg",
      delay: 600
    },
    {
      id: 4,
      name: "Product Name Goes Here",
      price: 124.99,
      oldPrice: 249.99,
      image: "https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD00991/India-Circus-by-Krsnaa-Mehta-Ample-Lilies-Porcelain-Coffee-Mug-52152101SD00991-2.jpg",
      onSale: true,
      delay: 800
    }
  ];

  return (
    <section className="section section-colored with-top-border" data-bg="#fafafa" id="team">
      <div className="page-section-content overflow-hidden">
        <div className="container text-center ">
          <h2 data-animate="fadeInDown" data-delay="0">NEW ARRIVAL</h2>
          <div className="topaz-line no-bottom-margin">
            <i className="di-separator"></i>
          </div>
          <div className="clear-section"></div>
          <div className="ok-row">
            <div className="ok-md-12">
              <ul className="rows ok-row  products-grids" id="rows">
                {products.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
