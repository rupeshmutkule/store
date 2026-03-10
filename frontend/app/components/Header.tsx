export default function Header() {
  return (
    <header role="banner">
      {/* DESKTOP MENU */}
      <div className="dima-navbar-wrap dima-navbar-fixed-top-active dima-topbar-active desk-nav">
        <div className="dima-navbar fix-one">
          <div className="dima-topbar dima-theme">
            <div className="container">
              <ul className="float-start text-start dima-menu">
                <li><a data-animated-link="fadeOut" href="#"><i className="fa fa-map-marker"></i>Bluett Avenue Seaview USA</a></li>
                <li><a data-animated-link="fadeOut" href="#"><i className="fa fa-phone"></i>+213 2020 555013</a></li>
              </ul>
              <ul className="float-end text-end dima-menu">
                <li><a data-animated-link="fadeOut" href="my-account.html"><i className="fa fa-user"></i>My Account</a></li>
                <li><a data-animated-link="fadeOut" href="wishlist.html"><i className="fa fa-heart"></i>Wishlist</a></li>
              </ul>
            </div>
          </div>
          <div className="clearfix dima-nav-fixed"></div>
          <div className="container">
            {/* Nav bar button */}
            <a className="dima-btn-nav" href="#"><i className="fa fa-bars"></i></a>
            {/* LOGO */}
            <div className="logo">
              <h1>
                <a data-animated-link="fadeOut" href="/" title="PixelDima.com logo">
                  <span className="vertical-middle"></span>
                  <img src="/images/okab_ecommerce_logo.png" alt="PixelDima Logo" title="PixelDima" />
                </a>
              </h1>
            </div>
            {/* MENU */}
            <nav role="navigation" className="clearfix">
              <ul className="dima-nav-end">
                <li className="search-btn">
                  <a data-animated-link="fadeOut" href="#"><i className="fa fa-search"></i></a>
                </li>
                <li className="shopping-btn sub-icon menu-item-has-children cart_wrapper">
                  <a data-animated-link="fadeOut" href="#" className="start-border">
                    <i className="fa fa-shopping-cart"></i>
                    <span className="total"><span className="amount">$7.00</span></span>
                    <span className="badge-number">2</span>
                  </a>
                  <ul className="sub-menu with-border product_list_widget">
                    <li>
                      <a data-animated-link="fadeOut" href="#" className="dima-close" title="Remove this item"></a>
                      <a data-animated-link="fadeOut" href="#" title="">
                        <img width="65" height="70" className="attachment-shop_thumbnail" src="https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD00991/India-Circus-by-Krsnaa-Mehta-Ample-Lilies-Porcelain-Coffee-Mug-52152101SD00991-2.jpg" alt="" />
                        Product Name Goes Here
                      </a>
                      <span className="price text-start">
                        <ins><span className="amount">1 &nbsp;&nbsp;x&nbsp;&nbsp;  <span>$12.99</span></span></ins>
                      </span>
                    </li>
                    <li>
                      <a data-animated-link="fadeOut" href="#" className="dima-close" title="Remove this item"></a>
                      <a data-animated-link="fadeOut" href="#" title="">
                        <img width="65" height="70" className="attachment-shop_thumbnail" src="https://icmedianew.gumlet.io/pub/media/catalog/product/cache/f2d421546b83b64fb3f7a27d900ed3ed/52152101SD00991/India-Circus-by-Krsnaa-Mehta-Ample-Lilies-Porcelain-Coffee-Mug-52152101SD00991-2.jpg" alt="" />
                        Product Name Goes Here
                      </a>
                      <span className="price text-start">
                        <ins><span className="amount">1  &nbsp;&nbsp;x&nbsp;&nbsp;  <span>$92.25</span></span></ins>
                      </span>
                    </li>
                    <li>
                      <p>SUBTOTAL : <span className="float-end">$191.98</span></p>
                    </li>
                    <li>
                      <span className="di_header button-block button fill">VIEW CART </span>
                      <span className="button-block button fill no-bottom-margin">CHECKOUT</span>
                    </li>
                  </ul>
                </li>
              </ul>
              
              <ul className="dima-nav  ">
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="/">Home</a>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="#">Shop</a>
                  <ul className="sub-menu nav-menu  ">
                    <li className="sub-icon menu-item-has-children">
                      <a data-animated-link="fadeOut" href="shop-2clm-left-sidebar.html">2 Columns</a>
                      <ul className="sub-menu">
                        <li><a data-animated-link="fadeOut" href="shop-2clm-left-sidebar.html">2 Columns Left Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-2clm-right-sidebar.html">2 Columns Right Sidebar</a></li>
                      </ul>
                    </li>
                    <li className="sub-icon menu-item-has-children">
                      <a data-animated-link="fadeOut" href="shop-3clm-full.html">3 Columns</a>
                      <ul className="sub-menu">
                        <li><a data-animated-link="fadeOut" href="shop-3clm-full.html">3 Columns Full</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-3clm-left-sidebar.html">3 Columns Left Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-3clm-right-sidebar.html">3 Columns Right Sidebar</a></li>
                      </ul>
                    </li>
                    <li><a data-animated-link="fadeOut" href="shop-4clm-full.html">4 Columns</a></li>
                    <li className="sub-icon menu-item-has-children">
                      <a data-animated-link="fadeOut" href="shop-list-full.html">List</a>
                      <ul className="sub-menu">
                        <li><a data-animated-link="fadeOut" href="shop-list-left-sidebar.html">List Left Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-list-right-sidebar.html">List Right Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-list-full.html">List Full</a></li>
                      </ul>
                    </li>
                    <li><a data-animated-link="fadeOut" href="cart.html">Cart</a></li>
                    <li><a data-animated-link="fadeOut" href="wishlist.html">Wishlist</a></li>
                    <li><a data-animated-link="fadeOut" href="checkout">Checkout</a></li>
                  </ul>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="shop-product-detail-right-sidebar.html">Product Details</a>
                  <ul className="sub-menu">
                    <li><a data-animated-link="fadeOut" href="shop-product-detail-left-sidebar.html">Product Detail Left Sidebar</a></li>
                    <li><a data-animated-link="fadeOut" href="shop-product-detail-right-sidebar.html">Product Detail Right Sidebar</a></li>
                  </ul>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="my-account.html">My Account</a>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="cart.html">cart</a>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="checkout">checkout</a>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="contact-us.html">contact  us</a>
                </li>
              </ul>
            </nav>
          </div>
          {/* container */}
          <div id="search-box">
            <div className="container">
              <form>
                <input type="text" placeholder="Start Typing..." />
              </form>
              <div id="close">
                <a data-animated-link="fadeOut" href="#"><i className="di-close"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="clear-nav"></div>
      </div>
      {/* !DESKTOP MENU */}
      
      {/* PHONE MENU */}
      <div className="dima-navbar-wrap mobile-nav">
        <div className="dima-navbar fix-one">
          <div className="dima-topbar dima-theme">
            <div className="container">
              <ul className="float-start text-start dima-menu">
                <li><a data-animated-link="fadeOut" href="#"><i className="fa fa-map-marker"></i>Bluett Avenue Seaview USA</a></li>
                <li><a data-animated-link="fadeOut" href="#"><i className="fa fa-phone"></i>+213 2020 555013</a></li>
              </ul>
              <ul className="float-end text-end dima-menu">
                <li><a data-animated-link="fadeOut" href="my-account.html"><i className="fa fa-user"></i>My Account</a></li>
                <li><a data-animated-link="fadeOut" href="#"><i className="fa fa-heart"></i>Wishlist</a></li>
              </ul>
            </div>
          </div>
          <div className="clearfix dima-nav-fixed"></div>
          <div className="container">
            <a className="dima-btn-nav" href="#"><i className="fa fa-bars"></i></a>
            <div className="logo">
              <h1>
                <a data-animated-link="fadeOut" href="/" title="PixelDima.com logo">
                  <span className="vertical-middle"></span>
                  <img src="/images/okab_ecommerce_logo.png" alt="PixelDima Logo" title="PixelDima" />
                </a>
              </h1>
            </div>
            <nav role="navigation" className="clearfix">
              <ul className="dima-nav-end">
                <li className="search-btn">
                  <a data-animated-link="fadeOut" href="#"><i className="fa fa-search"></i></a>
                </li>
                <li className="shopping-btn cart_wrapper">
                  <a data-animated-link="fadeOut" href="#" className="start-border">
                    <i className="fa fa-shopping-cart"></i>
                    <span className="total"><span className="amount">$7.00</span></span>
                    <span className="badge-number">2</span>
                  </a>
                </li>
              </ul>
              
              <ul className="dima-nav  mobile-nav-sec">
                <li className="">
                  <a data-animated-link="fadeOut" href="/">Home</a>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="#">Shop</a>
                  <ul className="sub-menu nav-menu  ">
                    <li className="sub-icon menu-item-has-children">
                      <a data-animated-link="fadeOut" href="shop-2clm-left-sidebar.html">2 Columns</a>
                      <ul className="sub-menu">
                        <li><a data-animated-link="fadeOut" href="shop-2clm-left-sidebar.html">2 Columns Left Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-2clm-right-sidebar.html">2 Columns Right Sidebar</a></li>
                      </ul>
                    </li>
                    <li className="sub-icon menu-item-has-children">
                      <a data-animated-link="fadeOut" href="shop-3clm-full.html">3 Columns</a>
                      <ul className="sub-menu">
                        <li><a data-animated-link="fadeOut" href="shop-3clm-full.html">3 Columns Full</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-3clm-left-sidebar.html">3 Columns Left Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-3clm-right-sidebar.html">3 Columns Right Sidebar</a></li>
                      </ul>
                    </li>
                    <li><a data-animated-link="fadeOut" href="shop-4clm-full.html">4 Columns</a></li>
                    <li className="sub-icon menu-item-has-children">
                      <a data-animated-link="fadeOut" href="shop-list-full.html">List</a>
                      <ul className="sub-menu">
                        <li><a data-animated-link="fadeOut" href="shop-list-left-sidebar.html">List Left Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-list-right-sidebar.html">List Right Sidebar</a></li>
                        <li><a data-animated-link="fadeOut" href="shop-list-full.html">List Full</a></li>
                      </ul>
                    </li>
                    <li><a data-animated-link="fadeOut" href="cart.html">Cart</a></li>
                    <li><a data-animated-link="fadeOut" href="wishlist.html">Wishlist</a></li>
                    <li><a data-animated-link="fadeOut" href="checkout.html">Checkout</a></li>
                  </ul>
                </li>
                <li className="sub-icon menu-item-has-children">
                  <a data-animated-link="fadeOut" href="shop-product-detail-right-sidebar.html">Product Details</a>
                  <ul className="sub-menu">
                    <li><a data-animated-link="fadeOut" href="shop-product-detail-left-sidebar.html">Product Detail Left Sidebar</a></li>
                    <li><a data-animated-link="fadeOut" href="shop-product-detail-right-sidebar.html">Product Detail Right Sidebar</a></li>
                  </ul>
                </li>
                <li className="">
                  <a data-animated-link="fadeOut" href="my-account.html">My Account</a>
                </li>
                <li className="">
                  <a data-animated-link="fadeOut" href="cart.html">cart</a>
                </li>
                <li className="">
                  <a data-animated-link="fadeOut" href="checkout.html">checkout</a>
                </li>
                <li className="">
                  <a data-animated-link="fadeOut" href="contact-us.html">contact  us</a>
                </li>
              </ul>
            </nav>
          </div>
          <div id="search-box">
            <div className="container">
              <form>
                <input type="text" placeholder="Start Typing..." />
              </form>
              <div id="close">
                <a data-animated-link="fadeOut" href="#"><i className="di-close"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* !PHONE MENU */}
    </header>
  );
}
