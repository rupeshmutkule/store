'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CheckoutPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <>
      <Header />
      
      {/* ALL CONTENTS */}
      <div className="dima-main">
        {/* BIG TITLE HERE */}
        <section className="title_container start-style">
          <div className="page-section-content">
            <div className="container page-section">
              <h2 className="uppercase undertitle text-start">Checkout</h2>
              <div className="dima-breadcrumbs breadcrumbs-end text-end">
                <span>
                  <a data-animated-link="fadeOut" href="/" title="Okab Theme Demo" className="trail-begin">Home</a>
                </span>
                <span className="sep">\</span>
                <span>
                  <a data-animated-link="fadeOut" href="#" title="Shortcodes">Shortcodes</a>
                </span>
                <span className="sep">\</span>
                <span>
                  <span className="trail-end">Promo Box</span>
                </span>
              </div>
            </div>
          </div>
        </section>
        {/*! BIG TITLE HERE ! */}

        {/* SECTION */}
        <section className="section">
          <div className="page-section-content overflow-hidden">
            <div className="container">
              
              {/* ALERTS */}
              <div className="dima-alert dima-alert-info fade in">
                <i className="fa fa-info"></i>
                <p>
                  Returning customer?{' '}
                  <a 
                    data-animated-link="fadeOut" 
                    href="#" 
                    className="show-box"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLogin(!showLogin);
                    }}
                  >
                    Click here to login
                  </a>
                </p>
              </div>

              {showLogin && (
                <div className="box box-with-marge login-box">
                  <p>If you have shopped with us before, please enter your details in the boxes below. If you are a new customer please proceed to the Billing & Shipping section.</p>
                  <div className="clear"></div>
                  <form action="php/contact-form-smtp.php" className="form-small form" noValidate>
                    <div className="ok-row">
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">Username or Email</label>
                          <input id="username" name="username" type="text" placeholder="Username or email" required aria-required="true" />
                        </div>
                      </div>
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">Password</label>
                          <input name="password" type="password" placeholder="Password" required aria-required="true" />
                        </div>
                      </div>
                    </div>
                    <a data-animated-link="fadeOut" href="#" className="button small fill uppercase">LOGIN</a>
                    <a data-animated-link="fadeOut" href="#" className="lost-pass">Lost Password?</a>
                  </form>
                </div>
              )}

              <div className="dima-alert dima-alert-info fade in">
                <i className="fa fa-info"></i>
                <p>
                  Have a coupon?{' '}
                  <a 
                    data-animated-link="fadeOut" 
                    href="#" 
                    className="show-box"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCoupon(!showCoupon);
                    }}
                  >
                    Click here to enter your code
                  </a>
                </p>
              </div>

              {showCoupon && (
                <div className="box coupon-box">
                  <form action="php/contact-form-smtp.php" className="form-small form ok-row" noValidate>
                    <div className="ok-md-6 ok-xsd-12">
                      <div className="field last">
                        <label>Coupon Code</label>
                        <input id="coupon" name="coupon" type="text" placeholder="Coupon Code" required aria-required="true" />
                      </div>
                    </div>
                    <div className="ok-md-6 ok-xsd-12 apply">
                      <a data-animated-link="fadeOut" href="#" className="button small fill uppercase">Apply Coupon</a>
                    </div>
                  </form>
                </div>
              )}
              {/*! ALERTS */}

              <div className="double-clear"></div>

              {/* BILLING DETAILS */}
              <h4>Billing Details</h4>
              <div className="clear"></div>

              <form action="php/contact-form-smtp.php" className="form-small form" noValidate>
                <div className="ok-row">
                  <div className="ok-md-6 ok-xsd-12 ok-sd-12">
                    <div className="ok-row">
                      {/* COUNTRY */}
                      <div className="ok-md-12">
                        <div className="field">
                          <label className="required">Country</label>
                          <select name="orderby" className="orderby">
                            <option value="">Select a country...</option>
                            <option value="AF">Afghanistan</option>
                            <option value="AL">Albania</option>
                            <option value="DZ">Algeria</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                          </select>
                        </div>
                      </div>
                      {/*! COUNTRY */}

                      {/* FIRST NAME */}
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">First Name</label>
                          <input name="first-name" type="text" placeholder="First Name" required aria-required="true" />
                        </div>
                      </div>
                      {/*! FIRST NAME */}

                      {/* LAST NAME */}
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">Last Name</label>
                          <input name="last-name" type="text" placeholder="Last Name" required aria-required="true" />
                        </div>
                      </div>
                      {/*! LAST NAME */}
                    </div>

                    {/* COMPANY NAME */}
                    <div className="field">
                      <label>Company Name</label>
                      <input name="company" type="text" placeholder="Company Name" />
                    </div>
                    {/*! COMPANY NAME */}

                    {/* ADDRESS */}
                    <div className="field">
                      <label className="required">Address</label>
                      <input name="address" type="text" placeholder="Street address" required aria-required="true" />
                    </div>
                    <div className="field">
                      <input name="address2" type="text" placeholder="Apartment, suite, unit etc. (optional)" />
                    </div>
                    {/*! ADDRESS */}

                    {/* TOWN / CITY */}
                    <div className="field">
                      <label className="required">Town / City</label>
                      <input name="city" type="text" placeholder="Town / City" required aria-required="true" />
                    </div>
                    {/*! TOWN / CITY */}

                    <div className="ok-row">
                      {/* STATE / COUNTRY */}
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">State / Country</label>
                          <input name="state" type="text" placeholder="State / Country" required aria-required="true" />
                        </div>
                      </div>
                      {/*! STATE / COUNTRY */}

                      {/* POSTCODE / ZIP */}
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">Postcode / Zip</label>
                          <input name="zip" type="text" placeholder="Postcode / Zip" required aria-required="true" />
                        </div>
                      </div>
                      {/*! POSTCODE / ZIP */}

                      {/* EMAIL ADDRESS */}
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">Email Address</label>
                          <input name="email" type="email" placeholder="Email Address" required aria-required="true" />
                        </div>
                      </div>
                      {/*! EMAIL ADDRESS */}

                      {/* PHONE */}
                      <div className="ok-md-6 ok-xsd-12">
                        <div className="field">
                          <label className="required">Phone</label>
                          <input name="phone" type="tel" placeholder="Phone" required aria-required="true" />
                        </div>
                      </div>
                      {/*! PHONE */}
                    </div>

                    {/* CREATE AN ACCOUNT ? */}
                    <div className="field">
                      <label>
                        <input 
                          className="checkbox" 
                          type="checkbox" 
                          checked={createAccount}
                          onChange={(e) => setCreateAccount(e.target.checked)}
                        />
                        Create an account?
                      </label>
                    </div>

                    {createAccount && (
                      <div className="box">
                        <p>Create an account by entering the information below. If you are a returning customer please login at the top of the page.</p>
                        <div className="field">
                          <label className="required">Username or Email</label>
                          <input name="account-username" type="text" placeholder="Username or Email" required aria-required="true" />
                        </div>
                        <div className="field">
                          <label className="required">Password</label>
                          <input name="account-password" type="password" placeholder="Password" required aria-required="true" />
                        </div>
                      </div>
                    )}
                    {/*! CREATE AN ACCOUNT ? */}

                    <div className="double-clear"></div>

                    {/* SHIPPING ADDRESS */}
                    <h4>Shipping Address</h4>
                    <div className="field">
                      <label>
                        <input 
                          className="checkbox" 
                          type="checkbox"
                          checked={shipToDifferent}
                          onChange={(e) => setShipToDifferent(e.target.checked)}
                        />
                        Ship to a different address?
                      </label>
                    </div>

                    {shipToDifferent && (
                      <div className="box">
                        <div className="ok-row">
                          {/* COUNTRY */}
                          <div className="ok-md-12">
                            <div className="field">
                              <label className="required">Country</label>
                              <select name="shipping-country" className="orderby">
                                <option value="">Select a country...</option>
                                <option value="AF">Afghanistan</option>
                                <option value="AL">Albania</option>
                                <option value="US">United States</option>
                              </select>
                            </div>
                          </div>

                          {/* FIRST NAME */}
                          <div className="ok-md-6 ok-xsd-12">
                            <div className="field">
                              <label className="required">First Name</label>
                              <input name="shipping-first-name" type="text" placeholder="First Name" required aria-required="true" />
                            </div>
                          </div>

                          {/* LAST NAME */}
                          <div className="ok-md-6 ok-xsd-12">
                            <div className="field">
                              <label className="required">Last Name</label>
                              <input name="shipping-last-name" type="text" placeholder="Last Name" required aria-required="true" />
                            </div>
                          </div>
                        </div>

                        {/* COMPANY NAME */}
                        <div className="field">
                          <label>Company Name</label>
                          <input name="shipping-company" type="text" placeholder="Company Name" />
                        </div>

                        {/* ADDRESS */}
                        <div className="field">
                          <label className="required">Address</label>
                          <input name="shipping-address" type="text" placeholder="Street address" required aria-required="true" />
                        </div>
                        <div className="field">
                          <input name="shipping-address2" type="text" placeholder="Apartment, suite, unit etc. (optional)" />
                        </div>

                        {/* TOWN / CITY */}
                        <div className="field">
                          <label className="required">Town / City</label>
                          <input name="shipping-city" type="text" placeholder="Town / City" required aria-required="true" />
                        </div>

                        <div className="ok-row">
                          {/* STATE / COUNTRY */}
                          <div className="ok-md-6 ok-xsd-12">
                            <div className="field">
                              <label className="required">State / Country</label>
                              <input name="shipping-state" type="text" placeholder="State / Country" required aria-required="true" />
                            </div>
                          </div>

                          {/* POSTCODE / ZIP */}
                          <div className="ok-md-6 ok-xsd-12">
                            <div className="field">
                              <label className="required">Postcode / Zip</label>
                              <input name="shipping-zip" type="text" placeholder="Postcode / Zip" required aria-required="true" />
                            </div>
                          </div>

                          {/* EMAIL ADDRESS */}
                          <div className="ok-md-6 ok-xsd-12">
                            <div className="field">
                              <label className="required">Email Address</label>
                              <input name="shipping-email" type="email" placeholder="Email Address" required aria-required="true" />
                            </div>
                          </div>

                          {/* PHONE */}
                          <div className="ok-md-6 ok-xsd-12">
                            <div className="field">
                              <label className="required">Phone</label>
                              <input name="shipping-phone" type="tel" placeholder="Phone" required aria-required="true" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ORDER NOTES */}
                    <div className="field last">
                      <label>Order Notes</label>
                      <textarea placeholder="Notes about your order, e.g special notes for delivery"></textarea>
                    </div>
                    {/*! ORDER NOTES */}
                  </div>

                  {/* ORDER AND PAYMENT METHOD */}
                  <div className="ok-md-6 ok-xsd-12">
                    <div className="box order-products dima-box">
                      {/* YOUR ORDER */}
                      <h4 className="box-titel">Your Order</h4>
                      <table className="order-products-table">
                        <thead>
                          <tr>
                            <th className="product-name">Product</th>
                            <th className="product-total">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="cart_item">
                            <td className="product-name">
                              Product Name Here
                              <strong className="product-quantity">×10</strong>
                            </td>
                            <td className="product-total">
                              <span className="amount">$2,900.00</span>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="cart-subtotal">
                            <th>Cart Subtotal</th>
                            <td>
                              <span className="amount">$2,900</span>
                            </td>
                          </tr>
                          <tr className="shipping">
                            <th>Shipping & Handling</th>
                            <td>Free Shiping</td>
                          </tr>
                          <tr className="order-total">
                            <th>Order Total</th>
                            <td>
                              <strong>
                                <span className="amount">$2,905.00</span>
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                      {/* YOUR ORDER */}

                      <div className="clear"></div>

                      {/* PAYMENT METHOD */}
                      <h4>Payment Method</h4>
                      <ul className="with-border">
                        {/* DIRECT BANK TRANSFER */}
                        <li>
                          <label>
                            <input 
                              className="radio" 
                              type="radio" 
                              name="payment" 
                              value="bank"
                              checked={paymentMethod === 'bank'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Direct Bank Transfer
                          </label>
                          {paymentMethod === 'bank' && (
                            <p className="toHide r-one">
                              Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order won't be shipped until the funds have cleared in our account.
                            </p>
                          )}
                        </li>
                        {/*! DIRECT BANK TRANSFER */}

                        {/* CHEQUE PAYMENT */}
                        <li>
                          <label>
                            <input 
                              className="radio" 
                              type="radio" 
                              name="payment" 
                              value="cheque"
                              checked={paymentMethod === 'cheque'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Cheque Payment
                          </label>
                          {paymentMethod === 'cheque' && (
                            <p className="toHide r-two">
                              Please send your cheque to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
                            </p>
                          )}
                        </li>
                        {/*! CHEQUE PAYMENT */}

                        {/* PAYPAL */}
                        <li className="field last">
                          <label>
                            <input 
                              className="radio" 
                              type="radio" 
                              name="payment" 
                              value="paypal"
                              checked={paymentMethod === 'paypal'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            PayPal
                            <img className="auto-width" src="/images/icons/paypal.png" alt="PayPal" />
                          </label>
                          {paymentMethod === 'paypal' && (
                            <p className="toHide r-three">
                              Pay via PayPal; you can pay with your credit card if you don't have a PayPal account.
                            </p>
                          )}
                        </li>
                        {/*! PAYPAL */}
                      </ul>

                      <div className="clear"></div>
                      <a data-animated-link="fadeOut" href="#" className="button fill uppercase">PLACE ORDER</a>
                      <div className="clear"></div>

                      <div className="field">
                        <label>
                          <input className="checkbox" type="checkbox" name="terms" value="value" />
                          I've read and accept the <a data-animated-link="fadeOut" href="#">terms & conditions</a>
                        </label>
                      </div>
                      {/* PAYMENT METHOD */}
                    </div>
                  </div>
                  {/* ORDER AND PAYMENT METHOD */}
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
