export default function Banners() {
  const banners = [
    {
      title: 'TOP DEAL JACKETS',
      highlight: '75%',
      text: 'OFF',
      image: 'https://icmedianew.gumlet.io/pub/media//home_banner/images/Best-Seller-niko-bowl01-06.11.2025.jpg',
    },
    {
      title: 'ALL BOOTS & CHUKKAS',
      highlight: '$100',
      text: 'UNDER',
      image: 'https://icmedianew.gumlet.io/pub/media//home_banner/images/Best-Seller-runner01-06.11.2025.jpg',
    },
    {
      title: 'ALL SUNGLASSES',
      highlight: '50%',
      text: 'OFF',
      image: 'https://icmedianew.gumlet.io/pub/media/home_banner/images/Whats-new-left-cushion-velvet-04.02.2026.jpg?v=1',
    },
  ];

  return (
    <section className="section" id="about">
      <div className="page-section-content overflow-hidden">
        <div className="container text-center margin-up">
          <div className="ok-row">
            {banners.map((banner, index) => (
              <div key={index} className="ok-md-4 ok-xsd-6" data-animate="fadeInUp" data-delay={index * 50}>
                <div className="banner gray-hover effect-roxy shot animated flipInY">
                  <div className="banner-content">
                    <div className="banner-inner">
                      <div className="double-clear"></div>
                      <div className="double-clear"></div>
                      <div className="double-clear"></div>
                      <div className="clear"></div>
                      <p className="no-margin undertitle">{banner.title}</p>
                      <div className="clear"></div>
                      <h2 className="ming-zoom no-margin undertitle">
                        {banner.text === 'UNDER' ? (
                          <>
                            {banner.text}
                            <span className="theme-color">{banner.highlight}</span>
                          </>
                        ) : (
                          <>
                            <span className="theme-color">{banner.highlight}</span>
                            {banner.text}
                          </>
                        )}
                      </h2>
                      <p></p>
                    </div>
                    <div className="double-clear"></div>
                    <a href="#" className="ming-hide di_white button stroke" data-direction="down">SHOP NOW</a>
                  </div>
                  <img src={banner.image} alt={banner.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
