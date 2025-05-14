import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/navBar';
import { Container, Row, Col, Image } from "react-bootstrap";
import { Table, Card } from "react-bootstrap";
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
    <Container className="text-center py-5 position-relative" style={{ background: "#f8f9fa", borderRadius: "20px" }}>
      <div
        style={{
          width: "200px",
          height: "200px",
          margin: "0 auto",
          borderRadius: "50%",
          backgroundColor: "#fff",
          border: "4px solid #dee2e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #dee2e6",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #dee2e6",
            }}
          >
            <Image
              src="https://static.insurancedekho.com/pwa/img/termbannericon.svg"
              alt="Term Banner"
              fluid
              style={{ maxHeight: "50px" }}
            />
          </div>
        </div>
      </div>

      <Row className="mt-5 g-4 justify-content-center">
        {insurers.map((insurer, index) => (
          <Col key={index} xs={6} sm={4} md={3} lg={2} className="text-center">
            <div
              className="p-3 bg-white shadow-sm rounded"
              style={{
                border: "1px solid #dee2e6",
                minHeight: "130px",
              }}
            >
              <Image
                src={insurer.src}
                alt={insurer.name}
                fluid
                style={{ maxHeight: "40px", marginBottom: "10px" }}
              />
              <p className="mb-0 small fw-semibold text-muted">{insurer.name}</p>
            </div>
          </Col>
        ))}
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
    <Container fluid style={{ background: "#f9f9f9", padding: "40px 20px" }}>
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 20 }}>
          What is Term Insurance?
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#444" }}>
          Term insurance offers financial coverage to policyholder’s dependants if they
          meet an unfortunate demise during the policy term. Let us understand it with an
          example of two individuals, Ashok and Suraj. Ashok is 35 years old man who has
          a wife, dependent parents, and a child, on the other hand, there is Suraj who
          is 40 years old with dependent parents, spouse, child, and who has been
          diagnosed with a critical illness. Now, in the event that either Ashok meets an
          unfortunate demise or Suraj is diagnosed with a critical illness, this plan will
          financially replace them in both of these. Thus, term life insurance plans will
          financially support your dependents even if you are not around. Scroll through
          the section to know all about term insurance plans.
        </p>
      </section>

      <section style={{ marginBottom: 60 }}>
        <Card style={{ padding: 30, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
            Eligibility Criteria of Term Insurance
          </h2>
          <Table striped bordered responsive>
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                <th>Features</th>
                <th>Eligibility Criteria</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Minimum Entry Age</td>
                <td>18 years</td>
              </tr>
              <tr>
                <td>Maximum Entry Age</td>
                <td>65 years</td>
              </tr>
              <tr>
                <td>Minimum Policy Tenure</td>
                <td>5 years (may vary from one insurance provider to another)</td>
              </tr>
              <tr>
                <td>Maximum Policy Tenure</td>
                <td>No limit (may vary from one insurance provider to another)</td>
              </tr>
              <tr>
                <td>Who can Purchase It?</td>
                <td>Salaried people, self-employed, housewives, professionals</td>
              </tr>
              <tr>
                <td>Available for NRIs</td>
                <td>Yes, term insurance plan is available for NRIs</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </section>

      <section>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }}>
          How To Buy Term Insurance With InsuranceDekho?
        </h2>
        <Row>
          {[
            {
              img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg",
              title: "Fill Your Details",
              desc: "Enter your personal details such as name, mobile number, gender and date of birth. Click on the ‘View Instant Quotes’ button to see available quotes."
            },
            {
              img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg",
              title: "Compare Different Term Insurance Quotes",
              desc: "Based on the details provided by you, different term insurance quotes will get displayed to you. Compare the available term plans and select the plan that suits your requirements."
            },
            {
              img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img3.svg",
              title: "Make The Payment",
              desc: "After selecting the best term plan for yourself, adjust the sum assured and the policy term. Once all plan details are finalised make the payment for the premium. You can make the payment via netbanking or debit/credit card."
            }
          ].map((step, index) => (
            <Col md={4} key={index} className="mb-4">
              <div
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  height: "100%"
                }}
              >
                <img
                  src={step.img}
                  alt={step.title}
                  style={{ width: 98, height: 88, marginBottom: 15 }}
                />
                <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>{step.title}</h4>
                <p style={{ fontSize: 15, color: "#555" }}>{step.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    </Container>

    
    </div>
    <Footer/>
    </>
  );
};

export default Term;
