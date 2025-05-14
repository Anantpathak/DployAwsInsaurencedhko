import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaSmile,
  FaStar,
  FaCheckCircle,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '5px 0', fontSize: '14px', color: '#333' }}>
      <Container>
        <Row className="mb-4">
          <Col md={3}>
            <img
              src="https://static.insurancedekho.com/pwa/img/id-main-logo-new_4.svg"
              alt="InsuranceDekho Logo"
              width="200"
              height="40"
              style={{ marginBottom: '20px' }}
            />
            <div className="d-flex gap-3 mb-3">
              <a href="https://www.facebook.com/InsuranceDekho-362265937686333" target="_blank" rel="noreferrer">
                <FaFacebookF size={20} />
              </a>
              <a href="https://www.instagram.com/insurancedekhoofficial/" target="_blank" rel="noreferrer">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/insurancedekho/" target="_blank" rel="noreferrer">
                <FaLinkedinIn size={20} />
              </a>
              <a href="https://www.twitter.com/insurance_dekho/" target="_blank" rel="noreferrer">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCbgggXkm7oIpqS9ushr4jKw" target="_blank" rel="noreferrer">
                <FaYoutube size={20} />
              </a>
            </div>
            <p><strong>Email:</strong> <a href="mailto:support@insurancedekho.com">support@insurancedekho.com</a></p>
            <p><strong>Call:</strong> <a href="tel:7551196989">7551196989</a></p>
          </Col>

          <Col md={2}>
            <h6 className="mb-3">Products</h6>
            <ul className="list-unstyled">
              {['Car Insurance', 'Bike Insurance', 'Health Insurance', 'Life Insurance', 'Term Insurance', 'Investment', 'Business', 'Travel Insurance', 'Tax Saving Schemes'].map((item, idx) => (
                <li key={idx}><a href="#" style={{ color: '#333', textDecoration: 'none' }}>{item}</a></li>
              ))}
            </ul>
          </Col>

          <Col md={2}>
            <h6 className="mb-3">Policy</h6>
            <ul className="list-unstyled">
              {['Privacy Policy', 'Grievance Redressal', 'Fraud Detection', 'Shipping Policy', 'Terms of Use', 'Cancellation & Refund', 'E-Insurance Account'].map((item, idx) => (
                <li key={idx}><a href="#" style={{ color: '#333', textDecoration: 'none' }}>{item}</a></li>
              ))}
            </ul>
          </Col>

          <Col md={2}>
            <h6 className="mb-3">General</h6>
            <ul className="list-unstyled">
              {['Contact Us', 'Feedback', 'Fraud Identification', 'Disclaimer', 'Annual Reports', 'Solicitation Process', 'ID Alumni Page', 'Corporate Social Responsibility'].map((item, idx) => (
                <li key={idx}><a href="#" style={{ color: '#333', textDecoration: 'none' }}>{item}</a></li>
              ))}
            </ul>
          </Col>

          <Col md={3}>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center mb-3">
                <FaSmile size={28} style={{ marginRight: '10px', color: '#17a2b8' }} />
                <div>
                  <strong>80 Lacs+</strong><br />Happy Smiles
                </div>
              </li>
              <li className="d-flex align-items-center mb-3">
                <FaStar size={28} style={{ marginRight: '10px', color: '#ffc107' }} />
                <div>
                  <strong>4.8</strong><br />Rated on Google
                </div>
              </li>
              <li className="d-flex align-items-center">
                <FaCheckCircle size={28} style={{ marginRight: '10px', color: '#28a745' }} />
                <div>
                  <strong>35k+</strong><br />Claims Served
                </div>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>
              *Standard T&C Apply. Girnar Insurance Brokers Private Limited, Udyog Vihar, Gurugram-122022, Haryana. IRDAI License no 588. Valid till 19th March 2026. 
              You authorize us to contact you via call, SMS, WhatsApp, or email. You hereby override your NDNC registration.
            </p>
            <p style={{ fontSize: '12px', color: '#6c757d' ,paddingLeft:'500px',fontWeight:'bold'}}>
              © Girnar Insurance Brokers Pvt. Ltd. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
