import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const HomeContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;
  const slideIntervalRef = useRef(null);

  const carouselItems = [
    {
      type: 'image',
      src: 'https://static.insurancedekho.com/pwa/img/nfo/lic-desktop-banner.png',
      alt: 'LIC',
      link: '/term',
      style: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      imgStyle: {
        width: '100%',
        height: 'auto',
        maxHeight: '350px',
        objectFit: 'contain',
        cursor: 'pointer',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        animation: 'fadeIn 1s ease-in-out',
      },
      onClick: () => {
        window.location.href = '/term';
      },
    },
    {
      type: 'component',
      style: { width: '400%', paddingRight: '1250px' },
      innerStyle: { backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '500px', width: '400%', padding: '20px' },
      content: (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 auto 10px auto', fontSize: '1.3em', color: '#333' }}>
            Get <span style={{ color: '#007bff' }}>Free Health Insurance</span> Consultation at Home
          </h2>
          <div style={{ marginBottom: '10px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
                <img
                  src="https://static.insurancedekho.com/pwa/img/whiteTick.svg"
                  alt="tick"
                  width="16"
                  height="16"
                  style={{ marginRight: '8px' }}
                />
                ID Certified Experts
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
                <img
                  src="https://static.insurancedekho.com/pwa/img/whiteTick.svg"
                  alt="tick"
                  width="16"
                  height="16"
                  style={{ marginRight: '8px' }}
                />
                Life Time Claim Support
              </li>
            </ul>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ marginRight: '15px' }}>
              <img
                src="https://static.insurancedekho.com/pwa/img/info-home-slider.webp"
                alt="home slider"
                width="70"
                height="100"
                style={{ borderRadius: '5px' }}
              />
            </span>
             <Link to="/homeVisit" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer', fontSize: '0.9em' }}>
              Book Home Visit
          
            </button>
             </Link>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  useEffect(() => {
    slideIntervalRef.current = setInterval(nextSlide, 5000);

    return () => {
      clearInterval(slideIntervalRef.current);
    };
  }, [totalSlides]);

  const handleSlideChange = (index) => {
    clearInterval(slideIntervalRef.current);
    setCurrentSlide(index);
    slideIntervalRef.current = setInterval(nextSlide, 5000);
  };

  const transformValue = `translateX(-${currentSlide * 100}%)`;

  const styles = {
    sectionTitle: {
      textAlign: 'center',
      marginBottom: '1rem',
      fontWeight: '700',
      fontSize: '2rem',
      color: '#333',
      animation: 'fadeIn 1s ease-in-out',
    },
    subTitle: {
      textAlign: 'center',
      fontSize: '1.1rem',
      marginBottom: '2rem',
      color: '#666',
      animation: 'fadeIn 1s ease-in-out',
    },
    benefitImage: {
      width: '120px',
      height: '120px',
      marginBottom: '1rem',
      transition: 'transform 0.3s ease',
    },
    benefitTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#212529',
    },
    benefitText: {
      fontSize: '0.95rem',
      color: '#555',
    },
    stepTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '0.5rem',
    },
    stepText: {
      fontSize: '0.95rem',
      color: '#555',
    },
    stepImage: {
      width: '80px',
      height: 'auto',
      marginBottom: '0.5rem',
      transition: 'transform 0.3s ease',
    },
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', paddingBottom: '40px' }}>
      {/* Carousel */}
      <div
        style={{
          margin: '40px auto 20px auto',
          maxWidth: '1200px',
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: `${totalSlides * 100}%`, // Total width is 200% for 2 slides
            transition: 'transform 0.5s ease-in-out',
            transform: transformValue,
          }}
        >
          {carouselItems.map((item, index) => (
            <div
              key={index}
              style={{
                width: `${100 / totalSlides}%`, // Each slide takes 50% of the total width (for 2 slides)
                flexShrink: 0,
              }}
            >
              <div style={item.style}>
                {item.type === 'image' && (
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={item.imgStyle}
                    onClick={item.onClick}
                  />
                )}
                {item.type === 'component' && item.content}
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: '8px',
          }}
        >
          {carouselItems.map((_, index) => (
            <div
              key={index}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? '#007bff' : '#fff',
                border: '1px solid #007bff',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      </div>

      {/* Insurance Icons Grid */}
      <Container style={{ maxWidth: '1200px', margin: '0 auto' }} className="bg-white rounded shadow p-4 mb-5">
        <Row className="text-center g-4">
          <Col xs={4} md={2} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/car-insurance" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_car.svg"
                  alt="Car"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Car</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Insurance</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/bikePolicy" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_bike.svg"
                  alt="Bike"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Bike</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Insurance</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ position: 'relative', animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/healthPolicy" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_health.svg"
                  alt="Health"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '0',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Upto 25% Off*
                </span>
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Health</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Insurance</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ position: 'relative', animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/term" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_life.svg"
                  alt="Term"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '0',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Save On Tax*
                </span>
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Term</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Insurance</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/investment" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_investment.svg"
                  alt="Investment"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Investment</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Plans</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ position: 'relative', animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/buisness" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/business_insurance.svg"
                  alt="Business"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '0',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  NEW
                </span>
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Business</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Insurance</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/family" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_family.svg"
                  alt="Family Health"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Family Health</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Insurance</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="/investment" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_guaranteeReturn.svg"
                  alt="Guaranteed"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>Guaranteed</p>
                <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Return Plans</p>
              </div>
            </Link>
          </Col>

          <Col xs={4} md={2} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/v2_icon_viewmore.svg"
                  alt="View More"
                  style={{ width: '46px', height: '46px', marginBottom: '8px' }}
                />
                <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>View More</p>
              </div>
            </Link>
          </Col>
        </Row>
      </Container>

      {/* Stats */}
      <Container style={{ maxWidth: '1200px', margin: '0 auto' }} className="text-center bg-light rounded shadow py-4 mb-5">
        <Row>
          <Col xs={12} md={4} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😍</p>
            <h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>80 Lacs+</h5>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Happy Smiles</p>
          </Col>
          <Col xs={12} md={4} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <img
              src="https://static.insurancedekho.com/pwa/img/v2_icon_Grating.svg"
              
              alt="Google"
              style={{ width: '48px', height: '48px', marginBottom: '0.5rem' }}
            />
            <h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>4.8</h5>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Rated on Google</p>
          </Col>
          <Col xs={12} md={4} style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <p style={{ fontSize: '2rem', color: '#dc3545', marginBottom: '0.5rem' }}>📋</p>
            <h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>35k+</h5>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Claims Served</p>
          </Col>
        </Row>
      </Container>

      {/* Benefits of InsuranceDekho Section */}
      <Container style={{ maxWidth: '1200px', padding: '3rem 1rem' }}>
        {/* Benefits Section */}
        <div>
          <h2 style={styles.sectionTitle}>Benefits of InsuranceDekho</h2>
          <p style={styles.subTitle}>
            Understand your insurance policy options. Identify the best value. Enjoy peace of mind.
          </p>
          <Row className="mb-5">
            <Col xs={12} md={4} className="mb-4">
              <Card
                className="text-center h-100 p-3 shadow-sm"
                style={{ animation: 'slideIn 1s ease-in-out' }}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/benifitimg1.svg"
                  alt="5 Minutes Policy Issuance"
                  style={styles.benefitImage}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <Card.Body>
                  <Card.Title style={styles.benefitTitle}>5 Minutes Policy Issuance*</Card.Title>
                  <Card.Text style={styles.benefitText}>
                    Say no to spending hours and days in queues doing the paperwork for your insurance
                    policy. Get your insurance issued instantly with InsuranceDekho. The entire process
                    takes just 5 minutes.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4} className="mb-4">
              <Card
                className="text-center h-100 p-3 shadow-sm"
                style={{ animation: 'slideIn 1s ease-in-out' }}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/benifitimg2.svg"
                  alt="Over 80 Lac Happy Customers"
                  style={styles.benefitImage}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <Card.Body>
                  <Card.Title style={styles.benefitTitle}>Over 80 Lac Happy Customers</Card.Title>
                  <Card.Text style={styles.benefitText}>
                    InsuranceDekho is becoming a household name in India with over 80 lac happy
                    customers, thanks to a transparent process and dedicated support.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4} className="mb-4">
              <Card
                className="text-center h-100 p-3 shadow-sm"
                style={{ animation: 'slideIn 1s ease-in-out' }}
              >
                <img
                  src="https://static.insurancedekho.com/pwa/img/benifitimg3.svg"
                  alt="Dedicated Support Team"
                  style={styles.benefitImage}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <Card.Body>
                  <Card.Title style={styles.benefitTitle}>Dedicated Support Team</Card.Title>
                  <Card.Text style={styles.benefitText}>
                    Our support team is available all 7 days to help you during purchase or claim
                    settlement of your insurance policy.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* How It Works Section */}
        <div>
          <h2 style={styles.sectionTitle}>How InsuranceDekho Works?</h2>
          <Row>
            <Col xs={12} md={4} className="mb-4 text-center">
              <div style={{ animation: 'slideIn 1s ease-in-out' }}>
                <img
                  src="https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg"
                  alt="Fill in Your Details"
                  style={styles.stepImage}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <h5 style={styles.stepTitle}>Fill in Your Details</h5>
                <p style={styles.stepText}>
                  Fill in your details and get insurance policy premium quotes from top-rated insurers
                  instantly.
                </p>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-4 text-center">
              <div style={{ animation: 'slideIn 1s ease-in-out' }}>
                <img
                  src="https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg"
                  alt="Select a Plan"
                  style={styles.stepImage}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <h5 style={styles.stepTitle}>Select a Plan</h5>
                <p style={styles.stepText}>
                  From numerous available quotes, choose the one that best suits your requirements and
                  budget.
                </p>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-4 text-center">
              <div style={{ animation: 'slideIn 1s ease-in-out' }}>
                <img
                  src="https://static.insurancedekho.com/pwa/img/HowIDwork_img3.svg"
                  alt="Make Payment and Sit Back"
                  style={styles.stepImage}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <h5 style={styles.stepTitle}>Make Payment and Sit Back</h5>
                <p style={styles.stepText}>Pay online and get your policy right away in your inbox.</p>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Keyframes for Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 768px) {
            .carousel-container {
              max-height: 200px !important;
            }
            .carousel-container img {
              max-height: 200px !important;
            }
            .carousel-component {
              padding: 10px !important;
            }
            .carousel-component h2 {
              font-size: 1em !important;
            }
            .carousel-component ul li {
              font-size: 0.8em !important;
            }
            .carousel-component img {
              width: 50px !important;
              height: 70px !important;
            }
            .carousel-component button {
              font-size: 0.8em !important;
              padding: 6px 12px !important;
            }
            .section-title {
              font-size: 1.5rem !important;
            }
            .sub-title {
              font-size: 0.9rem !important;
            }
            .benefit-image {
              width: 100px !important;
              height: 100px !important;
            }
            .benefit-title {
              font-size: 1rem !important;
            }
            .benefit-text {
              font-size: 0.85rem !important;
            }
            .step-image {
              width: 60px !important;
            }
            .step-title {
              font-size: 0.95rem !important;
            }
            .step-text {
              fontSize: 0.85rem !important;
            }
            .icon-grid img {
              width: 36px !important;
              height: 36px !important;
            }
            .icon-grid p {
              font-size: 0.8rem !important;
            }
          }

          @media (max-width: 576px) {
            .carousel-container {
              max-height: 150px !important;
            }
            .carousel-container img {
              max-height: 150px !important;
            }
            .stats-section h5 {
              font-size: 1.2rem !important;
            }
            .stats-section p {
              font-size: 0.8rem !important;
            }
            .stats-section img {
              width: 40px !important;
              height: 40px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HomeContent;
