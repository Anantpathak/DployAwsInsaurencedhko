import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Badge, Container, Row, Col } from "react-bootstrap";
import { Image } from "react-bootstrap";
import { Table } from 'react-bootstrap';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
// Utility to get background colors for icons
const getColor = (index) => {
  const colors = ["#cce5ff", "#d4edda", "#fff3cd", "#f8d7da", "#d1ecf1"];
  return colors[index % colors.length];
};

const Investment = () => {
  const [plans, setPlans] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetchPlans();
  }, []);
const API_BASE = process.env.REACT_APP_API_URL;
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/investment/all`);
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch investment plans:", err.message);
    }
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };
  const insurers = [
    {
      name: "Axis Max Life",
      logo: "https://static.insurancedekho.com/pwa/img/banner/max.png",
      return: "15.18%",
    },
    {
      name: "HDFC Life",
      logo: "https://static.insurancedekho.com/pwa/img/banner/hdfc.png",
      return: "14.32%",
    },
    {
      name: "Bajaj Allianz",
      logo: "https://static.insurancedekho.com/pwa/img/banner/bajaj.png",
      return: "13.80%",
    },
    {
      name: "TATA AIA Life",
      logo: "https://static.insurancedekho.com/pwa/img/banner/tata.png",
      return: "17.82%",
    },
    {
      name: "ICICI Pru Life",
      logo: "https://static.insurancedekho.com/pwa/img/banner/icici.png",
      return: "12.14%",
    },
    {
      name: "Bandhan Life",
      logo: "https://static.insurancedekho.com/pwa/img/banner/bandhan.png",
      return: null,
    },
    {
      name: "PNB MetLife",
      logo: "https://static.insurancedekho.com/pwa/img/banner/pnb.png",
      return: null,
    },
  ];
  const sectionStyle = {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const headingStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '16px',
  };

  const textStyle = {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
  };

  const listStyle = {
    listStyleType: 'disc',
    paddingLeft: '20px',
    marginTop: '12px',
  };

  const tableHeaderStyle = {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    textAlign: 'center',
  };
  return (
    <>
    

    {/* Navbar */}
    <header className="sticky-top shadow-sm">
      <Navbar />
    </header>
<div  style={{ paddingLeft: '140px', paddingRight: '140px' }}>

<div
      style={{
        background: "#f4f8fb",
        padding: "40px 20px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontWeight: 700, fontSize: "1.8rem", marginBottom: "30px" }}>
        Get <span style={{ color: "black" }}>₹1 Crore</span> return by
        Investing <span style={{ color: "#28a745" }}>₹10,000/month</span>
        <sup>*</sup> onwards
      </h2>

      <div
        style={{
          position: "relative",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            padding: "30px",
            border: "6px solid #d1e7fd",
          }}
        >
          <div
            style={{
              backgroundColor: "#e3f2fd",
              borderRadius: "50%",
              padding: "20px",
              border: "6px solid #cfe2ff",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "50%",
                padding: "10px",
              }}
            >
              <Image
                src="https://static.insurancedekho.com/pwa/img/investmentbannericon.svg"
                alt="Investment Banner"
                fluid
                style={{ maxWidth: "50px" }}
              />
            </div>
          </div>
        </div>
      </div>

      <Container>
        <Row className="g-4 justify-content-center">
          {insurers.map((insurer, idx) => (
            <Col
              xs={6}
              sm={4}
              md={3}
              lg={2}
              key={idx}
              className="text-center"
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #dee2e6",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  height: "100%",
                }}
              >
                <Image
                  src={insurer.logo}
                  alt={insurer.name}
                  fluid
                  style={{ height: "40px", marginBottom: "10px" }}
                />
                <p style={{ fontSize: "0.9rem", margin: 0 }}>{insurer.name}</p>
                {insurer.return && (
                  <Badge bg="success" className="mt-2">
                    ↑ {insurer.return}
                  </Badge>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

    <Container className="mt-4">
      <h3 className="mb-4 fw-bold">Top Investment Plans</h3>
      {plans.slice(0, visibleCount).map((plan, idx) => (
        <Card key={idx} className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center">
              {/* Logo Placeholder */}
              <Col md={2} className="text-center">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: getColor(idx),
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "24px",
                    borderRadius: "8px",
                    margin: "auto"
                  }}
                >
                  {plan.name.charAt(0)}
                </div>
              </Col>

              {/* Plan Info */}
              <Col md={3}>
                <h6 className="fw-bold">{plan.name}</h6>
                <p className="mb-1 small text-muted">
                  You Invest: <strong>₹ {plan.baseInvestmentAmount}</strong>
                </p>
                <p className="mb-1 small text-muted">
                  For: <strong>{plan.forYear} years</strong>
                </p>
                <p className="mb-1 small text-muted">
                  You Get: <strong>₹ {plan.getReturnAmount}</strong>
                </p>
                <p className="mb-0 small text-muted">
                  Duration: <strong>{plan.investmentDuration}</strong>
                </p>
              </Col>

              {/* Features */}
              <Col md={5}>
                <p className="mb-2 fw-bold text-success">Key Features:</p>
                {plan.keyFeatures?.map((feature, i) => (
                  <Badge
                    bg="light"
                    text="dark"
                    className="me-2 mb-2 border"
                    key={i}
                    style={{ fontSize: "0.75rem" }}
                  >
                    ✅ {feature}
                  </Badge>
                ))}
              </Col>

              {/* Action */}
              <Col md={2} className="text-end">
                <Button variant="primary" className="px-3">
                  Invest Now
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {visibleCount < plans.length && (
        <div className="text-center mt-3">
          <Button variant="outline-primary" onClick={handleSeeMore}>
            See More
          </Button>
        </div>
      )}
    </Container>
    <Container className="my-4">
      <div style={sectionStyle}>
        <h2 style={headingStyle}>What Are Investment Plans In India?</h2>
        <p style={textStyle}>
          No matter what your earnings are, it is still very important that you put in a substantial amount of your earnings to build a corpus.
          An investment plan exactly serves this purpose and helps in creating a financial corpus for the future. Whether you want to save money
          for your child’s future, buy a dream house, or anything else, a{' '}
          <a href="https://www.insurancedekho.com/life-insurance" target="_blank" rel="noopener noreferrer">
            life insurance
          </a>{' '}
          plan like investment will be extremely helpful in multiplying your wealth. On buying investment plans, it becomes easier to save your
          hard-earned money in a disciplined manner. Some of the investment plans you can consider buying are:
        </p>
        <ul style={listStyle}>
          <li>ULIPs</li>
          <li>Child plans</li>
          <li>Endowment</li>
          <li>Money-back plans</li>
          <li>Senior Citizen Savings Scheme</li>
          <li>Mutual Funds</li>
          <li>Tax-saving Fixed Deposits</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Types Of Investment Plans in India Based On Risk And Return In Investment</h2>
        <p style={textStyle}>
          There are two important concepts that you must be aware of while investing, risks and returns. While risk refers to the potential of the
          investor to bear any kind of capital loss, on the other hand, return refers to the amount of money paid out to the investor. Typically,
          investment plans with higher risks yield higher returns, for instance, a ULIP plan. As an investor, you need to thus analyse both risks
          and return before you decide to invest. You can also consult a financial planner who will help you in picking the right plan for
          yourself.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Best Investment Plans in India 2025</h2>
        <p style={textStyle}>Here’s a list of the best investment plans in India, where you can sow your money to yield profitable returns:</p>
        <Table bordered responsive hover className="mt-3">
          <thead style={tableHeaderStyle}>
            <tr>
              <th>Investment Plan</th>
              <th>Entry Age</th>
              <th>Policy Tenure</th>
              <th>Fund Choice</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bajaj Future Gain</td>
              <td>1 - 60 years</td>
              <td>10 - 25 years</td>
              <td>7</td>
            </tr>
            <tr>
              <td>Bharti AXA eFuture Invest</td>
              <td>18 - 60 years</td>
              <td>10 years</td>
              <td>6</td>
            </tr>
            <tr>
              <td>HDFC Life Click 2 Invest Plan</td>
              <td>30 days - 60 years</td>
              <td>5 - 20 years</td>
              <td>8</td>
            </tr>
            <tr>
              <td>ICICI Pru Smart Life</td>
              <td>20 - 54 years</td>
              <td>10 - 25 years</td>
              <td>8</td>
            </tr>
            <tr>
              <td>SBI eWealth</td>
              <td>18 - 50 years</td>
              <td>10 - 30 years</td>
              <td>4</td>
            </tr>
            <tr>
              <td>PNB Metlife Money Back Plan</td>
              <td>13 - 55 years</td>
              <td>10 years</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>Kotak Invest Maxima</td>
              <td>0 - 65 years</td>
              <td>10 - 30 years</td>
              <td>5</td>
            </tr>
          </tbody>
        </Table>
        <p style={textStyle}>
          In addition, Indian insurance companies offer a wide variety of other investment plans. To get personalized advice on which investment
          option is right for you, reach out to the customer service team at InsuranceDekho.
        </p>
      </div>
    </Container>
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <div className="shadow24 carSummary" style={{ marginBottom: "30px" }}>
        <h2
          content="When Is The Right Time to Buy An Investment Plan?"
          style={{
            textAlign: "center",
            color: "black",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          When Is The Right Time to Buy An Investment Plan?
        </h2>
        <div className="text-justify" style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "400" }}>
            Each one of us has specific goals in life when it comes to
            investment. In addition to keeping the investment goals in mind, you
            also need to consider the right time to start investing. The right
            time to start investing in an investment plan is at your early age
            when you have fewer financial dependents...
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <tbody>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <strong>Age</strong>
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <strong>Investment Strategies</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", textAlign: "center" }}>20s</td>
                <td style={{ padding: "10px" }}>
                  Invest at least 10% of your income in low-cost options like ETFs
                  and PPFs.
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td style={{ padding: "10px", textAlign: "center" }}>30s</td>
                <td style={{ padding: "10px" }}>
                  Invest at least 15% of your income in low-risk options.
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", textAlign: "center" }}>50s</td>
                <td style={{ padding: "10px" }}>
                  Increase investment to 30% of your income and explore higher-risk
                  options like ULIPs.
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td style={{ padding: "10px", textAlign: "center" }}>Post-retirement</td>
                <td style={{ padding: "10px" }}>
                  Invest in annuities or government-backed investment plans.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="shadow24 carSummary" style={{ marginBottom: "30px" }}>
        <h2
          content="Things to Check Before Investment Planning"
          style={{
            textAlign: "center",
            color: "black",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Things to Check Before Investment Planning
        </h2>
        <div className="text-justify" style={{ marginBottom: "20px" }}>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}>
              <strong>Financial Goals:</strong> It is important to determine your
              financial goals before investing in any specific investment plan...
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>Existing Expenses and Income:</strong> Figure out existing
              expenses over your income to know how much you can save.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>Future Expenses vs Savings:</strong> Consider future expenses
              like a child’s wedding to plan your investments accordingly.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>Number of Dependents:</strong> Your dependents' number affects
              how much investment is required.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>Investment Options Available:</strong> Perform a detailed
              analysis of available investment options or consult an advisor.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>Rate of Return:</strong> Compare the rate of return of different
              plans.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>Insurance Coverage:</strong> Some plans offer life insurance as
              well. Check the coverage before buying.
            </li>
          </ul>
        </div>
      </div>

      <div className="shadow24 carSummary" style={{ marginBottom: "30px" }}>
        <h2
          content="Process to Claim Investment Insurance Plan"
          style={{
            textAlign: "center",
            color: "black",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Process to Claim Investment Insurance Plan
        </h2>
        <div className="text-justify" style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "400" }}>
            The death benefit claim process and maturity benefit claim process may
            vary. Here are the steps:
          </p>
          <h3 style={{ color: "#17a2b8" }}>Steps to Claim Maturity Benefit</h3>
          <ul style={{ paddingLeft: "20px" }}>
            <li>Fill out the policy discharge form given by the insurer.</li>
            <li>Attach all necessary documents like original policy and identity proof.</li>
            <li>Submit the form and documents within 5-6 days.</li>
            <li>The insurer will verify the documents and process the maturity benefit.</li>
          </ul>
          <h3 style={{ color: "#17a2b8" }}>Steps to Claim Death Benefit</h3>
          <ul style={{ paddingLeft: "20px" }}>
            <li>Visit the insurance company's official website and fill out the claim form.</li>
            <li>Attach all required documents like the death certificate.</li>
            <li>The insurer will verify documents and process the death benefit.</li>
          </ul>
        </div>
      </div>

      <div className="gsc_container" style={{ marginBottom: "30px" }}>
        <div className="titlewraper">
          <h2
            style={{
              textAlign: "center",
              color: "black",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            Frequently Asked Questions (FAQ's)
          </h2>
        </div>
      </div>

      <div className="faq-section">
        <div style={{ marginBottom: "20px" }}>
          <strong>What are the things to keep in mind before investing my money?</strong>
          <ul style={{ paddingLeft: "20px" }}>
            <li>Identify your motive of investment</li>
            <li>Avoid putting all your money in one basket</li>
            <li>Consult a certified financial advisor</li>
            <li>Do thorough research before investing</li>
            <li>Compare suitable investment plans before buying</li>
          </ul>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong>How should I invest my future money?</strong>
          <p>
            To invest your future money, you must understand your financial goals, expenses,
            and number of dependents. This will help determine the best investment plan for you.
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong>Which is the best investment option with high returns?</strong>
          <p>
            The best high-return investment options are ULIPs and traditional investment plans,
            but consult a financial planner to balance your portfolio.
          </p>
        </div>
      </div>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default Investment;
