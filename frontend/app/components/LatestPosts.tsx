export default function LatestPosts() {
  const posts = [
    {
      id: 1,
      title: "Psychology In Branding",
      image: "/images/posts/post-6.jpg",
      date: "11 Jul 2014",
      views: 122,
      comments: 12,
      delay: 50
    },
    {
      id: 2,
      title: "Responsive web design",
      image: "/images/posts/post-7.jpg",
      date: "11 Jul 2014",
      views: 122,
      comments: 12,
      delay: 150
    },
    {
      id: 3,
      title: "Process of Prototyping",
      image: "/images/posts/post-8.jpg",
      date: "11 Jul 2014",
      views: 122,
      comments: 12,
      delay: 250
    }
  ];

  return (
    <section className="section section-colored with-top-border" data-bg="#fafafa" id="blog">
      <div className="page-section-content overflow-hidden">
        <div className="container">
          <h2 className="uppercase text-center" data-animate="fadeInDown" data-delay="0">LATEST POSTS</h2>
          <div className="topaz-line no-bottom-margin">
            <i className="di-separator"></i>
          </div>
          <div className="clear-section"></div>
          <div className="container">
            <section className="boxed-blog ok-row">
              {posts.map(post => (
                <article key={post.id} role="article" className="ok-md-4 ok-xsd-6" data-animate="fadeInUp" data-delay={post.delay}>
                  <div className="post e-post">
                    <div className="post-img ">
                      <img src={post.image} alt={post.title} />
                      <div className="link_overlay with_opacity">
                        <ul className="icons-media">
                          <li><a data-animated-link="fadeOut" href="#"><i className="fa fa-link"></i></a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="post-meta box">
                      <ul>
                        <li className="post-on">{post.date}</li>
                        <li className="post-view"><i className="fa fa-eye"></i> {post.views}</li>
                        <li className="post-comments"><i className="fa fa-comments"></i> {post.comments}</li>
                      </ul>
                    </div>
                    <div className="post-content text-start box">
                      <h5><a data-animated-link="fadeOut" href="#">{post.title}</a></h5>
                      <p>Lorem ipsum gravida nibh vel auctor est aliquet, aenean sollicitudin lorem quis dum auctor. Gravida nibh vel velit lorem quis dum auctor...</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
