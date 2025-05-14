import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Image,Card } from 'react-bootstrap';
const HomeContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;
  const slideIntervalRef = useRef(null);
  const carouselItems = [
    {
      type: 'image',
      src: 'https://static.insurancedekho.com/pwa/img/nfo/lic-desktop-banner.png',
      alt: 'LIC',
      style: { width: '100%', padding: '15px' },
      innerStyle: { maxWidth: '500px', width: '100%' },
      imgStyle: {
        display: 'block',
        width: '250%',
        height: 'auto',        // Maintain aspect ratio
        maxHeight: '300px', //  limit the maximum height. Adjust as needed.
        objectFit: 'contain',  //  'contain' or 'cover'
        margin: '0 auto',
        cursor: 'pointer',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    },
    {
      type: 'component',
      style: { width: '400%', paddingLeft: '400px' },
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
            <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer', fontSize: '0.9em' }}>
              Book Home Visit
            </button>
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
  const tabs = [
    {
      title: "Car Insurance",
      icon: "pwa/img/v2_icon_car.svg",
      link: "/car-insurance",
    },
    {
      title: "Bike Insurance",
      icon: "pwa/img/v2_icon_bike.svg",
      link: "/bikePolicy",
    },
    {
      title: "Health Insurance",
      icon: "pwa/img/v2_icon_health.svg",
      link: "/health-insurance",
      badge: "Upto 25% Off*",
      badgeColor: "#28a745",
    },
    {
      title: "Term Insurance",
      icon: "pwa/img/v2_icon_life.svg",
      link: "/life-insurance/term-insurance",
      badge: "Save On Tax*",
      badgeColor: "#28a745",
    },
    {
      title: "Investment Plans",
      icon: "pwa/img/v2_icon_investment.svg",
      link: "/investment",
    },
    {
      title: "Business Insurance",
      icon: "pwa/img/business_insurance.svg",
      link: "/sme",
      badge: "NEW",
      badgeColor: "#007bff",
    },
    {
      title: "Family Health Insurance",
      icon: "pwa/img/v2_icon_family.svg",
      link: "/health-insurance",
    },
    {
      title: "Guaranteed Return Plans",
      icon: "pwa/img/v2_icon_guaranteeReturn.svg",
      link: "/investment",
    },
    {
      title: "View More",
      icon: "https://static.insurancedekho.com/pwa/img/v2_icon_viewmore.svg",
      link: "#",
    },
  ];
  const styles = {
    sectionTitle: {
      textAlign: "center",
      marginBottom: "1rem",
      fontWeight: "700",
      fontSize: "2rem",
      color: "#333",
    },
    subTitle: {
      textAlign: "center",
      fontSize: "1.1rem",
      marginBottom: "2rem",
      color: "#666",
    },
    benefitImage: {
      width: "120px",
      height: "120px",
      marginBottom: "1rem",
    },
    benefitTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "#212529",
    },
    benefitText: {
      fontSize: "0.95rem",
      color: "#555",
    },
    stepTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#212529",
      marginBottom: "0.5rem",
    },
    stepText: {
      fontSize: "0.95rem",
      color: "#555",
    },
    stepImage: {
      width: "80px",
      height: "auto",
      marginBottom: "0.5rem",
    },
  };

  return (
    <div className="container py-4">
      {/* Carousel */}
      <div style={{ margin: '20px auto', maxWidth: '100%', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
        <div style={{ display: 'flex', width: `${totalSlides * 100}%`, transition: 'transform 0.5s ease-in-out', transform: transformValue }}>
          {carouselItems.map((item, index) => (
            <div key={index} style={{ width: '100%', flexShrink: 0 }}>
              <div style={item.style}>
                <div style={item.innerStyle}>
                  {item.type === 'image' && (
                    <img
                      src={item.src}
                      alt={item.alt}
                      style={item.imgStyle}
                    />
                  )}
                  {item.type === 'component' && item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Dots */}
        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '8px' }}>
          {carouselItems.map((_, index) => (
            <div
              key={index}
              style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: currentSlide === index ? '#007bff' : '#ccc', cursor: 'pointer' }}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      </div>

      {/* Insurance Icons Grid */}
      <div className="bg-white rounded shadow p-4 mb-5">
      <div className="row text-center g-4">
        <div className="col-4 col-md-2">
          <Link to="/car-insurance" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/car--v1.png"
              alt="Car"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <p className="mb-0 fw-bold">Car</p>
             <p className="text-muted small" style={{paddingLeft:'60px'}}>Insurance</p>
          </Link>
        </div>

        <div className="col-4 col-md-2">
          <Link to="/bikePolicy" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/motorcycle.png"
              alt="Bike"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <p className="mb-0 fw-bold">Bike</p>
             <p className="text-muted small" style={{paddingLeft:'60px'}}>Insurance</p>
          </Link>
        </div>

        <div className="col-4 col-md-2 position-relative">
          <Link to="/healthPolicy" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/heart-with-pulse.png"
              alt="Health"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <span className="badge bg-success position-absolute top-0 start-0" style={{ fontSize: '10px' }}>
              Upto 25% Off*
            </span>
            <p className="mb-0 fw-bold">Health</p>
             <p className="text-muted small" style={{paddingLeft:'60px'}}>Insurance</p>
          </Link>
        </div>

        <div className="col-4 col-md-2 position-relative">
          <Link to="/term" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/umbrella.png"
              alt="Term"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <span className="badge bg-success position-absolute top-0 start-0" style={{ fontSize: '10px' }}>
              Save On Tax*
            </span>
            <p className="mb-0 fw-bold">Term</p>
             <p className="text-muted small" style={{paddingLeft:'60px'}}>Insurance</p>
          </Link>
        </div>

        <div className="col-4 col-md-2">
          <Link to="/investment" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/investment-portfolio.png"
              alt="Investment"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <p className="mb-0 fw-bold">Investment</p>
            <p className="text-muted small" style={{paddingLeft:'60px'}}>Plans</p>
          </Link>
        </div>

        <div className="col-4 col-md-2 position-relative">
          <Link to="/buisness" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/shop.png"
              alt="Business"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <span className="badge bg-danger position-absolute top-0 end-0" style={{ fontSize: '10px' }}>
              NEW
            </span>
            <p className="mb-0 fw-bold">Business</p>
             <p className="text-muted small" style={{paddingLeft:'60px'}}>Insurance</p>
          </Link>
        </div>

        <div className="col-4 col-md-2">
          <Link to="/family" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/family.png"
              alt="Family Health"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <p className="mb-0 fw-bold">Family Health</p>
            <p className="text-muted small" style={{paddingLeft:'60px'}}>Insurance</p>
          </Link>
        </div>

        <div className="col-4 col-md-2">
          <Link to="/investment" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="https://img.icons8.com/color/96/money-bag.png"
              alt="Guaranteed"
              className="img-fluid mb-2"
              width="46"
              height="46"
            />
            <p className="mb-0 fw-bold">Guaranteed</p>
            <p className="text-muted small" style={{paddingLeft:'60px'}}>Insurance</p>
            <p className="text-muted small">Return Plans</p>
          </Link>
        </div>

        <div className="col-4 col-md-2">
          <img
            src="https://img.icons8.com/color/96/more.png"
            alt="View More"
            className="img-fluid mb-2"
            width="46"
            height="46"
          />
          <p className="mb-0 fw-bold">View More</p>
        </div>
      </div>
    </div>

      {/* Stats */}
      <div className="row text-center bg-light rounded shadow py-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <p className="fs-1">😍</p>
          <h5 className="fw-bold">80 Lacs+</h5>
          <p className="text-muted">Happy Smiles</p>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <img src="https://img.icons8.com/color/48/google-logo.png" className="mb-2" alt="Google" />
          <h5 className="fw-bold">4.8</h5>
          <p className="text-muted">Rated on Google</p>
        </div>
        <div className="col-md-4">
          <p className="fs-1 text-danger">📋</p>
          <h5 className="fw-bold">35k+</h5>
          <p className="text-muted">Claims Served</p>
        </div>
      </div>

      {/* Benefits of InsuranceDekho Section */}
      <Container style={{ padding: "3rem 1rem" }}>
      {/* Benefits Section */}
      <div>
        <h2 style={styles.sectionTitle}>Benefits of InsuranceDekho</h2>
        <p style={styles.subTitle}>
          Understand your insurance policy options. Identify the best value.
          Enjoy peace of mind.
        </p>
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="text-center h-100 p-3 shadow-sm">
              <img
                src="https://static.insurancedekho.com/pwa/img/benifitimg1.svg"
                alt="5 Minutes Policy Issuance"
                style={styles.benefitImage}
              />
              <Card.Body>
                <Card.Title style={styles.benefitTitle}>
                  5 Minutes Policy Issuance*
                </Card.Title>
                <Card.Text style={styles.benefitText}>
                  Say no to spending hours and days in queues doing the
                  paperwork for your insurance policy. Get your insurance issued
                  instantly with InsuranceDekho. The entire process takes just 5
                  minutes.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center h-100 p-3 shadow-sm">
              <img
                src="https://static.insurancedekho.com/pwa/img/benifitimg2.svg"
                alt="Over 80 Lac Happy Customers"
                style={styles.benefitImage}
              />
              <Card.Body>
                <Card.Title style={styles.benefitTitle}>
                  Over 80 Lac Happy Customers
                </Card.Title>
                <Card.Text style={styles.benefitText}>
                  InsuranceDekho is becoming a household name in India with
                  over 80 lac happy customers, thanks to a transparent process
                  and dedicated support.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center h-100 p-3 shadow-sm">
              <img
                src="https://static.insurancedekho.com/pwa/img/benifitimg3.svg"
                alt="Dedicated Support Team"
                style={styles.benefitImage}
              />
              <Card.Body>
                <Card.Title style={styles.benefitTitle}>
                  Dedicated Support Team
                </Card.Title>
                <Card.Text style={styles.benefitText}>
                  Our support team is available all 7 days to help you during
                  purchase or claim settlement of your insurance policy.
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
          <Col md={4} className="mb-4 text-center">
            <img
              src="https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg"
              alt="Fill in Your Details"
              style={styles.stepImage}
            />
            <h5 style={styles.stepTitle}>Fill in Your Details</h5>
            <p style={styles.stepText}>
              Fill in your details and get insurance policy premium quotes from
              top-rated insurers instantly.
            </p>
          </Col>
          <Col md={4} className="mb-4 text-center">
            <img
              src="https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg"
              alt="Select a Plan"
              style={styles.stepImage}
            />
            <h5 style={styles.stepTitle}>Select a Plan</h5>
            <p style={styles.stepText}>
              From numerous available quotes, choose the one that best suits
              your requirements and budget.
            </p>
          </Col>
          <Col md={4} className="mb-4 text-center">
            <img
              src="https://static.insurancedekho.com/pwa/img/HowIDwork_img3.svg"
              alt="Make Payment and Sit Back"
              style={styles.stepImage}
            />
            <h5 style={styles.stepTitle}>Make Payment and Sit Back</h5>
            <p style={styles.stepText}>
              Pay online and get your policy right away in your inbox.
            </p>
          </Col>
        </Row>
      </div>
    </Container>
    </div>
  );
};

export default HomeContent;

