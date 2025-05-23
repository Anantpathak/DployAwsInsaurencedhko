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
  const footerSeoLinkStyle = {
    padding: '20px',
    borderBottom: '1px solid #eee',
    marginBottom: '15px',
  };

  const footerListHeadingStyle = {
    fontSize: '1em',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  };

  const linkStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#6c757d', // Grey color
    textDecoration: 'none',
    fontSize: '0.9em',
  };

  const ulStyle = {
    listStyleType: 'none', // Remove bullets
    paddingLeft: '0',
  };

  const footerBottomStyle = {
    padding: '15px',
    fontSize: '0.9em',
    color: '#777',
  };

  const disclaimerStyle = {
    marginBottom: '10px',
    fontSize: '0.9em',
    color: '#777',
  };

  const irdaiSectionStyle = {
    textAlign: 'right',
  };

  const irdaidetailStyle = {
    color: '#555',
    fontSize: '0.9em',
    textAlign: 'right',
  };

  const irdaLicenseLinkStyle = {
    color: '#6c757d',
    textDecoration: 'none',
  };

  const infoSectionStyle = {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '0.9em',
    color: '#777',
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', fontSize: '14px', color: '#333', padding: '20px 0' ,paddingTop:'45px'}}>
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
        <div className="footerseolink" style={footerSeoLinkStyle}>
          <h3 style={{ fontSize: '0.9em', marginBottom: '15px', color: '#333' }}>Quick Links</h3>
          <Row>
            <Col md={3} sm={6}>
              <div className="linkListing">
                <p className="footerListHeading" style={footerListHeadingStyle}>Car Insurance</p>
                <ul style={ulStyle}>
                  <li><a title="Car Insurance Renewal" href="https://www.insurancedekho.com/car-insurance/renewal" style={linkStyle}>Car Insurance Renewal</a></li>
                  <li><a title="Car Insurance Calculator" href="https://www.insurancedekho.com/car-insurance/premium-calculator" style={linkStyle}>Car Insurance Calculator</a></li>
                  <li><a title="Zero Depreciation Car Insurance" href="https://www.insurancedekho.com/car-insurance/zero-depreciation" style={linkStyle}>Zero Depreciation Car Insurance</a></li>
                  <li><a title="IDV Calculator" href="https://www.insurancedekho.com/car-insurance/idv" style={linkStyle}>IDV Calculator</a></li>
                  <li><a title="Own Damage Car Insurance" href="https://www.insurancedekho.com/car-insurance/standalone-own-damage-cover" style={linkStyle}>Own Damage Car Insurance</a></li>
                  <li><a title="Car Insurance Claim Settlement" href="https://www.insurancedekho.com/car-insurance/claim-settlement" style={linkStyle}>Car Insurance Claim Settlement</a></li>
                  <li><a title="Best Car Insurance Companies" href="https://www.insurancedekho.com/car-insurance/companies" style={linkStyle}>Best Car Insurance Companies</a></li>
                </ul>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="linkListing">
                <p className="footerListHeading" style={footerListHeadingStyle}>Health Insurance</p>
                <ul style={ulStyle}>
                  <li><a title="Health Insurance Plans" href="https://www.insurancedekho.com/health-insurance/plans" style={linkStyle}>Health Insurance Plans</a></li>
                  <li><a title="Best Health Insurance Companies" href="https://www.insurancedekho.com/health-insurance/companies" style={linkStyle}>Best Health Insurance Companies</a></li>
                  <li><a title="Mediclaim Policy" href="https://www.insurancedekho.com/health-insurance/cashless-mediclaim" style={linkStyle}>Mediclaim Policy</a></li>
                  <li><a title="Health Insurance Claim Settlement Ratio" href="https://www.insurancedekho.com/health-insurance/claim-settlement" style={linkStyle}>Health Insurance Claim Settlement Ratio</a></li>
                  <li><a title="Critical Health Insurance" href="https://www.insurancedekho.com/health-insurance/critical-illness" style={linkStyle}>Critical Health Insurance</a></li>
                  <li><a title="Health Insurance Premium Calculator" href="https://www.insurancedekho.com/health-insurance/premium-calculator" style={linkStyle}>Health Insurance Premium Calculator</a></li>
                  <li><a title="Family Health Insurance" href="https://www.insurancedekho.com/health-insurance/plans/family" style={linkStyle}>Family Health Insurance</a></li>
                  <li><a title="Senior Citizens Health Insurance" href="https://www.insurancedekho.com/health-insurance/plans/senior-citizen" style={linkStyle}>Senior Citizens Health Insurance</a></li>
                </ul>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="linkListing">
                <p className="footerListHeading" style={footerListHeadingStyle}>Life Insurance</p>
                <ul style={ulStyle}>
                  <li><a title="Postal Life Insurance Scheme" href="https://www.insurancedekho.com/life-insurance/postal" style={linkStyle}>Postal Life Insurance Scheme</a></li>
                  <li><a title="Life Insurance Types" href="https://www.insurancedekho.com/life-insurance/types" style={linkStyle}>Life Insurance Types</a></li>
                  <li><a title="Life Insurance Claim Settlement Ratio" href="https://www.insurancedekho.com/life-insurance/claim-settlement" style={linkStyle}>Life Insurance Claim Settlement Ratio</a></li>
                  <li><a title="Term Insurance Vs Life Insurance" href="https://www.insurancedekho.com/life-insurance/life-insurance-vs-term-insurance" style={linkStyle}>Term Insurance Vs Life Insurance</a></li>
                  <li><a title="Best Life Insurance Companies" href="https://www.insurancedekho.com/life-insurance/companies" style={linkStyle}>Best Life Insurance Companies</a></li>
                  <li><a title="Life Insurance Plans" href="https://www.insurancedekho.com/life-insurance/plans" style={linkStyle}>Life Insurance Plans</a></li>
                  <li><a title="Life Insurance Tax Benefits" href="https://www.insurancedekho.com/life-insurance/tax-benefits" style={linkStyle}>Life Insurance Tax Benefits</a></li>
                  <li><a title="Life Insurance Premium Calculator" href="https://www.insurancedekho.com/life-insurance/premium-calculator" style={linkStyle}>Life Insurance Premium Calculator</a></li>
                </ul>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="linkListing">
                <p className="footerListHeading" style={footerListHeadingStyle}>Investment Plans</p>
                <ul style={ulStyle}>
                  <li><a title="Investment Plans" href="https://www.insurancedekho.com/investment" style={linkStyle}>Investment Plans</a></li>
                  <li><a title="Fixed Deposit Calculator" href="https://www.insurancedekho.com/investment/fixed-deposit/fd-calculator" style={linkStyle}>Fixed Deposit Calculator</a></li>
                  <li><a title="Tax-Saving Fixed Deposit" href="https://www.insurancedekho.com/investment/fixed-deposit/fd-tax-saving" style={linkStyle}>Tax-Saving Fixed Deposit</a></li>
                  <li><a title="Child Investment Plans" href="https://www.insurancedekho.com/investment/plans/child" style={linkStyle}>Child Investment Plans</a></li>
                  <li><a title="Best Investment Plans" href="https://www.insurancedekho.com/investment/plans" style={linkStyle}>Best Investment Plans</a></li>
                  <li><a title="Annuity Plans" href="https://www.insurancedekho.com/investment/annuity-plan" style={linkStyle}>Annuity Plans</a></li>
                  <li><a title="Section 10(10D)" href="https://www.insurancedekho.com/investment/best-tax-saving-investment/section-10-10d" style={linkStyle}>Section 10(10D)</a></li>
                  <li><a title="Investment Plans for NRI" href="https://www.insurancedekho.com/investment/nri" style={linkStyle}>Investment Plans for NRI</a></li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        <div className="footer-bottom newFooterBottom" style={footerBottomStyle}>
          <Row className="align-items-start"> {/* Align items to the start vertically */}
            <Col md={8}> {/* Increased width for disclaimer */}
              <div className="disclaimer" style={disclaimerStyle}>
                <p style={{ fontSize: '0.9em', color: '#777' }}>
                  *Standard T&C Apply. All savings/offers are offered by insurance companies as approved by the IRDAI for the product under applicable file & use guidelines. Savings in motor insurance
                  are as quoted in Indian Motor Tariff. For more details on risk factors, terms and conditions, please read the sales brochure of respective insurers carefully before concluding a sale. Tax
                  benefits are subject to changes in applicable tax laws. Girnar Insurance Brokers Private Limited, (CIN: U66010RJ2016PTC054811, Regd.Off: Girnar 21, Govind Marg, Moti Doongari Road,
                  Dharam Singh Circle, Jaipur, Rajasthan- 302004; Corp. Off: Plot no.301, Phase-2, Udyog Vihar, Gurugram-122022, Haryana, India. IRDAI License no 588. Composite Broker valid till 19th March
                  2026. Email - support@insurancedekho.com; Helpline number: 7551196989.
                  <br />
                  You authorise Girnar Insurance Brokers Pvt Ltd (insurancedekho) to contact you through call, SMS, email, WhatsApp or any other mode in the future. You hereby override your NDNC
                  registration.
                </p>
              </div>
            </Col>
            <Col md={4} style={irdaiSectionStyle}> {/* Reduced width for IRDAI info */}
              <div className="irdai ">
                <div className="footerDisclamer">
                  <div className="irdaidetail" style={irdaidetailStyle}>
                    <span className="line2" style={{ display: 'block', marginBottom: '5px' ,fontWeight:'bold'}}>Girnar Insurance Brokers Private Limited</span>
                    <span className="line2" style={{ display: 'block', marginBottom: '5px' ,fontWeight:'bold'}}><a target="_blank" title="IRDA LICENSE" rel="noopener noreferrer" href="/irda-license" style={irdaLicenseLinkStyle}>IRDAI License Number : 588</a></span>
                    <span className="line3" style={{ display: 'block', marginBottom: '3px', fontSize: '0.9em' }}>CIN: U66010RJ2016PTC054811 | Composite Broker</span>
                    <span className="line3" style={{ display: 'block', fontSize: '0.9em' }}>Valid Till: 19/03/2026 | Principal Officer- Mr. Ankit Kumar Agarwal</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="info-section" style={infoSectionStyle}>
            <p>© Girnar Insurance Brokers Pvt. Ltd. All Rights Reserved</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;