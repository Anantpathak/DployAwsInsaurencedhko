import React from 'react';
import { Button, Card, Container, Row, Col, Image,Accordion } from 'react-bootstrap';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
const InsuranceSection = () => {
  const iconStyle = {
    width: '60px',
    height: '60px',
    marginBottom: '10px'
  };

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '18px',
    marginTop: '10px'
  };

  const paragraphStyle = {
    fontSize: '14px',
    color: '#555'
  };
  const styles = {
    section: { backgroundColor: '#f9f9f9', padding: '40px 20px' },
    heading: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' },
    subHeading: { fontSize: '18px', textAlign: 'center', color: '#555' },
    iconImage: { width: '60px', height: '60px', objectFit: 'contain' },
    partnerLogo: { width: '100px', height: '50px', objectFit: 'contain' },
    faqHeader: { fontSize: '20px', fontWeight: '600' },
  };

  return (
 <>
    {/* Navbar */}
    <header className="sticky-top shadow-sm">
      <Navbar />
    </header>

<Container
      fluid
      style={{
        backgroundColor: '#f8f9fa',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',height: '60vh'
      }}
    >
      <Row
        className="align-items-center"
        style={{ maxWidth: '1200px', width: '100%' }}
      >
        <Col
          md={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            Aapke{' '}
            <div style={{ display: 'inline-block', color: '#007bff' }}>
              Business <br /> Vyapaar
            </div>{' '}
            ka Best Insurance Kavach
          </h1>
          <div style={{ fontSize: '1.2rem', color: '#555' }}>
            Starting at just <strong>₹8 per day*</strong>
          </div>
          <Button variant="primary" size="lg">
            Get A Quote
          </Button>
          <div style={{ fontSize: '1rem', marginTop: '15px', color: '#333' }}>
            <span style={{ fontWeight: 'bold', color: '#dc3545' }}>#</span>{' '}
            InsuranceDekho
            <br />
            <span style={{ color: '#007bff', fontWeight: 600 }}>
              BadhteIndiaKaBharosa
            </span>
          </div>
        </Col>
        <Col
          md={6}
          className="text-center"
          style={{ padding: '20px' }}
        >
          <img
            src="https://static.insurancedekho.com/pwa/img/sme_mob.webp"
            alt="Brand Ambassador"
            style={{ maxWidth: '100%', height: '40vh', borderRadius: '12px' }}
          />
        </Col>
      </Row>
    </Container>
      {/* Features Section */}
      <Container className="my-5">
        <Row className="text-center mb-4">
          <Col>
            <h2 className="fw-bold">Our Insurance Covers</h2>
          </Col>
        </Row>
        <Row className="g-4 text-center">
          {[
            { icon: 'fire', label: 'Fire & Burglary' },
            { icon: 'marine', label: 'Specific Marine' },
            { icon: 'contactorplant', label: 'Contractor’s Plant & Machinery' },
            { icon: 'workmen', label: 'Workmen Compensation' },
            { icon: 'medicalcoverage', label: 'Group Medical Coverage' },
            { icon: 'paccident', label: 'Group Personal Accident' }
          ].map((item, index) => (
            <Col key={index} xs={6} md={4} lg={2}>
              <div className="d-flex flex-column align-items-center">
                <img
                  src={`https://static.insurancedekho.com/pwa/img/smePicon_${item.icon}.svg`}
                  alt={item.label}
                  style={iconStyle}
                />
                <span>{item.label}</span>
              </div>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="outline-dark" className="px-4 py-2">See All</Button>
        </div>
      </Container>

      {/* Advantages Section */}
      <Container className="my-5">
        <Row className="text-center mb-4">
          <Col>
            <h2 className="fw-bold">The InsuranceDekho Advantage</h2>
            <p className="text-muted">
              Understand your insurance policy options. Identify the best value. Enjoy peace of mind.
            </p>
          </Col>
        </Row>
        <Row className="g-4">
          {[
            {
              img: 'smeadvantag_img1.png',
              title: '5 Minutes Policy Issuance',
              text: 'Say no to spending hours and days in queues doing the paperwork for your insurance policy. Get your insurance issued instantly with InsuranceDekho. The entire process from selecting the best insurance policy to getting it issued takes just 5 minutes on InsuranceDekho.'
            },
            {
              img: 'smeadvantag_img2.png',
              title: 'Over 50 Lac Happy Customers',
              text: 'InsuranceDekho is becoming a household name in India. Till now we have been successful in providing a delightful experience to more than 50 lac customers with the help of our transparent and quick process, a dedicated support team along with the availability of numerous insurers.'
            },
            {
              img: 'smeadvantag_img3.png',
              title: 'Dedicated Support System',
              text: 'Our dedicated support team is available for your assistance all the 7 days. Feel free to reach out to us in case of any confusion - be it related to the purchase of an insurance policy or assistance during the settlement of a claim, our team of experts is at your service all days.'
            }
          ].map((item, index) => (
            <Col key={index} md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`https://static.insurancedekho.com/pwa/img/${item.img}`}
                  alt={item.title}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title style={titleStyle}>{item.title}</Card.Title>
                  <Card.Text style={paragraphStyle}>{item.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="danger" className="px-4 py-2">Get A Quote</Button>
        </div>
      </Container>
      <div style={styles.section}>
      {/* CTA Section */}
      <Container className="text-center mb-5">
        <h1 style={{ fontWeight: 'bold', fontSize: '36px' }}>
          Aapke <span style={{ color: '#007bff' }}>Business Vyapaar</span> ka Best Insurance Kavach
        </h1>
        <p className="mt-2" style={{ fontSize: '18px' }}>Starting at just ₹8 per day*</p>
        <Button variant="primary" size="lg" className="mt-3">Get A Quote</Button>
        <div className="mt-3 text-muted" style={{ fontWeight: '500' }}>
          <span style={{ color: '#dc3545', fontWeight: 'bold' }}>#</span> InsuranceDekho <br />
          <span style={{ fontSize: '14px', color: '#888' }}>BadhteIndiaKaBharosa</span>
        </div>
      </Container>

      {/* How it works */}
      <Container className="mb-5">
        <h2 style={styles.heading}>How InsuranceDekho Works</h2>
        <Row className="text-center">
          {[
            {
              img: 'https://static.insurancedekho.com/pwa/img/sme_filldeail.png',
              title: 'Fill Your Details',
              desc: 'Enter details & get insurance policy premium quotes from top rated insurers.'
            },
            {
              img: 'https://static.insurancedekho.com/pwa/img/sme_comparequote.png',
              title: 'Compare Quotes & Choose a Policy',
              desc: 'From numerous quotes, choose the one that best suits your requirements & budget.'
            },
            {
              img: 'https://static.insurancedekho.com/pwa/img/sme_makepayment.png',
              title: 'Make Payment & Sit Back',
              desc: 'Pay online & get your policy in your inbox.'
            }
          ].map((step, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <Image src={step.img} style={styles.iconImage} className="mb-3" />
              <h4>{step.title}</h4>
              <p style={{ fontSize: '15px', color: '#555' }}>{step.desc}</p>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Insurance Partners */}
      <Container className="mb-5 text-center">
        <h2 style={styles.heading}>Our Trusted Insurance Partners</h2>
        <Row className="justify-content-center">
          {[
            { name: 'Digit Insurance', img: 'https://static.insurancedekho.com/pwa/img//insurer/logo/12.png' },
            { name: 'ICICI Lombard', img: 'https://static.insurancedekho.com/pwa/img//insurer/logo/3.png' },
            { name: 'HDFC ERGO', img: 'https://static.insurancedekho.com/pwa/img//insurer/logo/1.png' },
            { name: 'United India', img: 'https://static.insurancedekho.com/pwa/img//insurer/logo/18.png' },
            { name: 'Bajaj Allianz', img: 'https://static.insurancedekho.com/pwa/img//insurer/logo/30.png' }
          ].map((partner, idx) => (
            <Col xs={6} md={2} className="mb-4" key={idx}>
              <Image src={partner.img} style={styles.partnerLogo} className="mb-2" />
              <div style={{ fontSize: '14px' }}>{partner.name}</div>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <Button variant="danger" className="me-3">Get A Quote</Button>
          <span>or</span>
          <a href="tel:9540954000">
            <Button variant="outline-secondary" style={{ color: '#dc3545', borderColor: '#dc3545' }}>
              Call Us
            </Button>
          </a>
        </div>
      </Container>

      {/* FAQs */}
      <Container>
        <h2 style={styles.heading}>Frequently Asked Questions</h2>
        <Accordion>
          {[
            ['What Does Business Insurance Cover?', 'Business insurance provides coverage if your business faces any loss during its operations.'],
            ['How Can Business Insurance Benefit Small Businesses?', 'It helps protect against financial loss due to premises damage or third-party legal issues.'],
            ['What Types of Business Insurance Policies Should I Consider?', 'General Liability, Property Insurance, Professional Liability, Workmen Compensation.'],
            ['How Much Does Business Insurance Cost?', 'It depends on business size and required coverage.'],
            ['Is Business Insurance Mandatory?', 'It is not mandatory, but strongly recommended.'],
            ['What Factors Should I Consider When Choosing a Provider?', 'Look at claim settlement ratio, premiums, and coverage offered.'],
            ['What are the two types of group health insurance?', 'Contributory and non-contributory health insurance.'],
            ['Is damage due to short-circuit covered in fire insurance?', 'No, it is not covered under fire insurance.'],
            ['Is there terrorism coverage under marine open transit insurance?', 'No, terrorism is not covered.'],
            ['Can global accidents be claimed in group personal accident insurance?', 'Only if the plan includes global coverage.']
          ].map(([question, answer], idx) => (
            <Accordion.Item eventKey={idx.toString()} key={idx}>
              <Accordion.Header style={styles.faqHeader}>{question}</Accordion.Header>
              <Accordion.Body style={{ fontSize: '14px', color: '#555' }}>
                {answer}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
    <Footer/>
    </>
  );
};

export default InsuranceSection;
