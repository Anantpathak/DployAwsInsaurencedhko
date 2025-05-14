import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/navBar';
import { Container, Row, Col, Image } from "react-bootstrap";
import { Table, Card, Tabs, Tab,Button } from "react-bootstrap";
import Footer from '../components/footer';
const Term = () => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    fetchProviders();
  }, [filter]);
const API_BASE = process.env.REACT_APP_API_URL;
  const fetchProviders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/term/filter`, {
        params: filter,
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching term insurance providers:", error);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };
  const insurers = [
    { src: "https://static.insurancedekho.com/pwa/img/banner/max.png", name: "Axis Max Life" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/lic.png", name: "LIC" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/bajaj.png", name: "Bajaj Allianz" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/tata.png", name: "TATA AIA Life" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/icici.png", name: "ICICI Pru Life" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/bandhan.png", name: "Bandhan Life" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/hsbc.png", name: "Canara HSBC" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/pnb.png", name: "PNB MetLife" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/digit.png", name: "Digit" },
    { src: "https://static.insurancedekho.com/pwa/img/banner/hdfc.png", name: "HDFC Life" },
  ];
  return (
    <>
        
    
        {/* Navbar */}
        <header className="sticky-top shadow-sm">
          <Navbar />
        </header>
    <div  style={{ paddingLeft: '140px', paddingRight: '140px' }}>
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4" style={{ fontSize: '36px', color: '#004d40', fontWeight: 'bold' }}>
            Buy Health Insurance Plans and Policies Online
          </h1>
          <div
            className="mainDescription expanded"
            style={{ marginBottom: '30px', textAlign: 'center', fontSize: '16px', color: '#555' }}
          >
            <p>
              A health or medical insurance policy covers your medical expenses for illnesses and injuries
              including hospitalisation, daycare procedures, ambulance charges, medical care at home, medicine
              costs, and more. It protects the individuals and families from financial burden arising from
              unexpected medical expenses. Additionally, it helps you save taxes under section 80D of the Income
              Tax Act, 1961.
            </p>
          </div>

          <div className="keyFeaturesHealth" style={{ backgroundColor: '#f4f4f4', padding: '30px', borderRadius: '8px' }}>
            <h3 className="text-center mb-4" style={{ fontSize: '28px', color: '#00796b', fontWeight: 'bold' }}>
              Key Highlights
            </h3>
            <Row>
              <Col md={6} lg={4} className="mb-4">
                <Card style={{ borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body className="text-center">
                    <img
                      className="featuresIcons"
                      width="48"
                      height="48"
                      alt="Wide range of Plans & Companies"
                      src="https://staticimg.insurancedekho.com/strapi/Group_1000004038_797ae83ff3.svg?updated_at=2024-10-28T08:55:02.340Z"
                      title="Wide range of Plans & Companies"
                      style={{ marginBottom: '15px' }}
                    />
                    <p className="boldText" style={{ fontSize: '18px', color: '#00796b' }}>
                      Wide range of Plans & Companies
                    </p>
                    <p className="mutedText" style={{ fontSize: '14px', color: '#888' }}>
                      (134 Plans and 22 Companies)
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-4">
                <Card style={{ borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body className="text-center">
                    <img
                      className="featuresIcons"
                      width="48"
                      height="48"
                      alt="Free advice to help choose best plan"
                      src="https://staticimg.insurancedekho.com/strapi/Group_1000004103_ce3239a13d.svg?updated_at=2024-10-28T08:55:02.432Z"
                      title="Free advice to help choose best plan"
                      style={{ marginBottom: '15px' }}
                    />
                    <p className="boldText" style={{ fontSize: '18px', color: '#00796b' }}>
                      Free advice to help choose best plan
                    </p>
                    <p className="mutedText" style={{ fontSize: '14px', color: '#888' }}>
                      (Guaranteed assistance with guidance)*
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-4">
                <Card style={{ borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body className="text-center">
                    <img
                      className="featuresIcons"
                      width="48"
                      height="48"
                      alt="24 x 7 Claim Support"
                      src="https://staticimg.insurancedekho.com/strapi/Group_1000004106_722ee3c5ae.svg?updated_at=2024-10-28T08:55:03.581Z"
                      title="24 x 7 Claim Support"
                      style={{ marginBottom: '15px' }}
                    />
                    <p className="boldText" style={{ fontSize: '18px', color: '#00796b' }}>
                      24 x 7 Claim Support
                    </p>
                    <p className="mutedText" style={{ fontSize: '14px', color: '#888' }}>
                      (We are there for the time of your need to support in claim processing)*
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-4">
                <Card style={{ borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body className="text-center">
                    <img
                      className="featuresIcons"
                      width="48"
                      height="48"
                      alt="Flexible payment options"
                      src="https://staticimg.insurancedekho.com/strapi/Group_1000004106_1_40bbd2161c.svg?updated_at=2024-10-28T08:55:03.580Z"
                      title="Flexible payment options"
                      style={{ marginBottom: '15px' }}
                    />
                    <p className="boldText" style={{ fontSize: '18px', color: '#00796b' }}>
                      Flexible payment options
                    </p>
                    <p className="mutedText" style={{ fontSize: '14px', color: '#888' }}>
                      (Ability to buy 3 year plan as well as monthly EMI options)
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-4">
                <Card style={{ borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body className="text-center">
                    <img
                      className="featuresIcons"
                      width="48"
                      height="48"
                      alt="1 lakh+ Families insured"
                      src="https://staticimg.insurancedekho.com/strapi/Frame_1000004691_60c7672ae7.svg?updated_at=2024-10-28T08:55:03.578Z"
                      title="1 lakh+ Families insured"
                      style={{ marginBottom: '15px' }}
                    />
                    <p className="boldText" style={{ fontSize: '18px', color: '#00796b' }}>
                      1 lakh+ Families insured
                    </p>
                    <p className="mutedText" style={{ fontSize: '14px', color: '#888' }}>
                      (Hear genuine customer’s opinion & their experiences)
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>

    <div className="container mt-4">
      {data.slice(0, visibleCount).map((item, idx) => (
        <div className="card shadow-sm mb-4" key={idx}>
          <div className="card-body row align-items-center">
            <div className="col-md-2 text-center">
              <img
                src={item.logoUrl}
                className="img-fluid"
                style={{ maxHeight: "50px" }}
                alt={item.name}
              />
            </div>

            <div className="col-md-3">
              <h6 className="fw-bold">{item.name}</h6>
              <p className="mb-0 small text-muted">Claim Type: <strong>{item.claimType}</strong></p>
              <p className="mb-0 small text-muted">Life Cover: <strong>{item.lifeCoverAmount}</strong></p>
              
            </div>

            <div className="col-md-4">
              <p className="mb-1 fw-bold text-success">Key Features:</p>
              <ul className="list-inline mb-0">
                {item.keyFeatures.map((feature, i) => (
                  <li
                    key={i}
                    className="list-inline-item badge bg-light text-dark border"
                  >
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-3 text-end">
              <p className="mb-1">
                Starting From <strong>₹ {item.premiumStartingFrom}</strong>
              </p>
              <button className="btn btn-primary">Check Prices</button>
            </div>
          </div>
        </div>
      ))}

      {visibleCount < data.length && (
        <div className="text-center mb-4">
          <button  className="btn btn-outline-primary" onClick={handleLoadMore}>
            See More
          </button>
        </div>
      )}
    </div>

    <Container className="my-5">
      {/* Significance of having a health insurance policy */}
      <div className="id_container">
        <h2 className="mainHeading" style={{ color: '#0056b3', fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>
          Significance of having a health insurance policy
        </h2>
        <p className="subHeading" style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem' }}>
          Following are some significant benefits of a comprehensive health insurance plan
        </p>
        <Row xs={1} sm={2} md={4} className="g-4">
          <Col>
            <Card className="significance_card text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Group_1000004073_b45536e7a3.svg?updated_at=2024-10-28T08:58:01.225Z" style={{ width: '48px', height: '48px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Financial Security</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  A health insurance policy can free you and your family from the financial burden that comes with a medical emergency, illness or health issues.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="significance_card text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Group_1000004074_e922d34238.svg?updated_at=2024-10-28T08:58:00.279Z" style={{ width: '48px', height: '48px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Peace of Mind</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  Once you and your loved ones are covered under a health insurance plan, you will have peace of mind and can focus on getting the right treatment stress-free.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="significance_card text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Group_1000004075_02d44e54a1.svg?updated_at=2024-10-28T08:58:01.331Z" style={{ width: '48px', height: '48px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Access to Quality Healthcare Services</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  With the rising expenses of medical treatments, a health insurance policy can provide access to better quality healthcare services.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="significance_card text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Group_1000004076_9c99b3262b.svg?updated_at=2024-10-28T08:58:00.178Z" style={{ width: '48px', height: '48px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Altering Lifestyle</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  Having health insurance can shield you from diseases that may arise due to an altering lifestyle as with our current lifestyle we are faced with severe illnesses.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Types of Health Insurance Policies */}
      <div className="id_container mt-5">
        <h2 className="mainHeading" style={{ color: '#0056b3', fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>
          Types of Health Insurance Policies
        </h2>
        <p className="subHeading" style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem' }}>
          There are various kinds of health insurance policies available in the market that you can choose depending on your requirement and budget. Below are the list of the plans for your reference:
        </p>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          <Col>
            <Card className="policy_card_new text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Component_cb9900f47d.svg?updated_at=2024-10-28T09:05:07.685Z" style={{ width: '56px', height: '56px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Individual Health Insurance Plan</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  Policy that covers a single person in case of hospitalisation and medical bills
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="policy_card_new text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Component_1_b94029b93d.svg?updated_at=2024-10-28T09:05:06.927Z" style={{ width: '56px', height: '56px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Family Floater Health Insurance Plan</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  Policy that covers multiple family members under a single plan
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="policy_card_new text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Component_2_4319f7a146.svg?updated_at=2024-10-28T09:05:06.928Z" style={{ width: '56px', height: '56px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Senior Citizen Health Insurance Plan</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  Policy that covers individuals above the age of 65 years
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="policy_card_new text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Card.Img variant="top" src="https://staticimg.insurancedekho.com/strapi/Component_3_b6a9a5b87f.svg?updated_at=2024-10-28T09:05:07.683Z" style={{ width: '56px', height: '56px', margin: '0 auto 15px' }} />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Critical Illness Insurance Plan</Card.Title>
                <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                  Policy covering an individual for expensive treatment of critical illnesses such as cancer
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
    <Container>
      <h2 className="mainHeading" style={{ textAlign: 'center', marginBottom: '30px' }}>
        List of IRDAI approved Health Insurance Companies
      </h2>
      
      <Row className="insurance_partners_cards">
        <Col md={4} className="mb-4">
          <Card style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
            <Card.Img
              variant="top"
              src="https://healthstatic.insurancedekho.com/prod/oem/20250116174106.jpg"
              alt="Acko Health Insurance"
              style={{ width: '64px', height: '64px', margin: '0 auto 10px' }}
            />
            <Card.Body>
              <Card.Title>Acko Health Insurance</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Claim Settled: <span style={{ fontWeight: 'bold' }}>74.09%</span></Card.Subtitle>
              <Button variant="primary" style={{ width: '121px', height: '36px', fontSize: '14px' }}>
                View Premium
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
            <Card.Img
              variant="top"
              src="https://healthstatic.insurancedekho.com/prod/oem/20190902133310.jpg"
              alt="Star Health Insurance"
              style={{ width: '64px', height: '64px', margin: '0 auto 10px' }}
            />
            <Card.Body>
              <Card.Title>Star Health Insurance</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Claim Settled: <span style={{ fontWeight: 'bold' }}>99.10%</span></Card.Subtitle>
              <Button variant="primary" style={{ width: '121px', height: '36px', fontSize: '14px' }}>
                View Premium
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
            <Card.Img
              variant="top"
              src="https://healthstatic.insurancedekho.com/prod/oem/20190902133109.jpg"
              alt="ManipalCigna Health Insurance"
              style={{ width: '64px', height: '64px', margin: '0 auto 10px' }}
            />
            <Card.Body>
              <Card.Title>ManipalCigna Health Insurance</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Claim Settled: <span style={{ fontWeight: 'bold' }}>93.40%</span></Card.Subtitle>
              <Button variant="primary" style={{ width: '121px', height: '36px', fontSize: '14px' }}>
                View Premium
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
            <Card.Img
              variant="top"
              src="https://healthstatic.insurancedekho.com/prod/oem/20210422100011.png"
              alt="HDFC ERGO Health Insurance"
              style={{ width: '64px', height: '64px', margin: '0 auto 10px' }}
            />
            <Card.Body>
              <Card.Title>HDFC ERGO Health Insurance</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Claim Settled: <span style={{ fontWeight: 'bold' }}>99.80%</span></Card.Subtitle>
              <Button variant="primary" style={{ width: '121px', height: '36px', fontSize: '14px' }}>
                View Premium
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
            <Card.Img
              variant="top"
              src="https://healthstatic.insurancedekho.com/prod/oem/20230313224934.png"
              alt="Zuno Health Insurance"
              style={{ width: '64px', height: '64px', margin: '0 auto 10px' }}
            />
            <Card.Body>
              <Card.Title>Zuno Health Insurance</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Claim Settled: <span style={{ fontWeight: 'bold' }}>95%</span></Card.Subtitle>
              <Button variant="primary" style={{ width: '121px', height: '36px', fontSize: '14px' }}>
                View Premium
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="text-center">
          <Card style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
            <Card.Img
              variant="top"
              src="https://static.insurancedekho.com/pwa/img/landingpages/partners_list.svg"
              alt="Factors"
              style={{ width: '64px', height: '64px', margin: '0 auto 10px' }}
            />
            <Card.Body>
              <Card.Title>Health Insurance Companies</Card.Title>
              <Button variant="secondary" style={{ width: '150px', height: '36px', fontSize: '14px' }}>
                View All
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mainHeading" style={{ textAlign: 'center', marginTop: '40px' }}>
        How to Buy a Health Insurance Plan Online?
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>
        There are three different ways in which you can buy a health insurance plan. With InsuranceDekho, you can make it more convenient. Here’s how:
      </p>

      <Row>
        <Col md={6} className="text-center">
          <img
            src="https://healthstatic.insurancedekho.com/prod/imagegallery/howtobuy.svg"
            alt="How to Buy"
            style={{ width: '100%', height: 'auto', maxWidth: '500px' }}
          />
        </Col>
        <Col md={6}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Online Process</h3>
          <p style={{ fontSize: '1rem' }}>
            You can purchase health insurance in two ways, either with InsuranceDekho or via the concerned health insurer. Below mentioned details will give you a clear picture on what works best for you:
          </p>
          <ul>
            <li>Simply fill up your name and mobile number to get OTP</li>
            <li>Enter OTP</li>
            <li>Enter details on how many family members you want to insure</li>
            <li>Select if applicable, any disease or ailment</li>
          </ul>
        </Col>
      </Row>
    </Container>
    </div>
    <Footer/>
    </>
  );
};

export default Term;
