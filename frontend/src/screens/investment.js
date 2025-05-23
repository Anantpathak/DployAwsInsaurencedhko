import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Badge, Container, Row, Col, Form, Modal, Alert, Spinner } from "react-bootstrap";
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
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    investmentDuration: '',
    forYear: '',
    baseInvestmentAmount: '',
  });

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    pan: '',
    dob: '',
    annualIncome: '',
    nomineeName: '',
    nomineeRelationship: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Fetch user data from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        mobile: parsedUser.phoneNumber || '',
        pan: parsedUser.pan || '', // Assuming PAN is stored in user object
      }));
    }
  }, []);

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/investment/all`);
      setPlans(res.data);
      setFilteredPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch investment plans:", err.message);
    }
  };

  // Filter logic
  const applyFilters = () => {
    let filtered = plans;

    if (filter.investmentDuration) {
      filtered = filtered.filter(plan => plan.investmentDuration === filter.investmentDuration);
    }
    if (filter.forYear) {
      filtered = filtered.filter(plan => plan.forYear === parseInt(filter.forYear));
    }
    if (filter.baseInvestmentAmount) {
      const [min, max] = filter.baseInvestmentAmount.split('-').map(Number);
      filtered = filtered.filter(plan => plan.baseInvestmentAmount >= min && (max ? plan.baseInvestmentAmount <= max : true));
    }

    setFilteredPlans(filtered);
    setVisibleCount(10); // Reset visible count after filtering
  };

  useEffect(() => {
    applyFilters();
  }, [filter, plans]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) errors.email = "Invalid email";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) errors.mobile = "Mobile must be 10 digits";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) errors.pan = "Invalid PAN format";
    if (!formData.dob) errors.dob = "Date of Birth is required";
    else if (new Date(formData.dob) > new Date()) errors.dob = "DOB cannot be in the future";
    if (!formData.annualIncome || isNaN(formData.annualIncome) || formData.annualIncome <= 0) errors.annualIncome = "Valid annual income is required";
    if (!formData.nomineeName.trim()) errors.nomineeName = "Nominee name is required";
    if (!formData.nomineeRelationship.trim()) errors.nomineeRelationship = "Nominee relationship is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const initiatePayment = async () => {
    if (!validateForm()) return;

    setPaymentLoading(true);
    setPaymentError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: selectedPlan.baseInvestmentAmount * 100, // Convert to paise
        currency: "INR",
        name: "Investment Plan Payment",
        description: `Payment for ${selectedPlan.name}`,
        handler: async (response) => {
          try {
            const paymentData = {
              userId: user?._id || 'guest',
              investmentId: selectedPlan._id,
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              address: formData.address,
              pan: formData.pan,
              dob: formData.dob,
              annualIncome: parseInt(formData.annualIncome),
              nomineeName: formData.nomineeName,
              nomineeRelationship: formData.nomineeRelationship,
              amount: selectedPlan.baseInvestmentAmount,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id || "N/A", // Razorpay order ID might not be available in this flow
              razorpaySignature: response.razorpay_signature || "N/A", // Signature might not be available in this flow
            };

            await axios.post(`${API_BASE}/api/investment-payment`, paymentData);
            alert("Payment successful! Your investment plan has been purchased.");
            setShowForm(false);
          } catch (err) {
            setPaymentError("Failed to save payment. Please contact support.");
            console.error("Payment save error:", err);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#28a745",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentError("Failed to initiate payment. Please try again.");
      console.error("Payment initiation error:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleInvestNow = (plan) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please log in to proceed with the investment.");
      return;
    }
    setSelectedPlan(plan);
    setShowForm(true);
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
      <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Navbar />
      </header>

      <div style={{ paddingLeft: '20px', paddingRight: '20px', '@media (min-width: 768px)': { paddingLeft: '140px', paddingRight: '140px' } }}>
        {/* Hero Section */}
        <div
          style={{
            background: "#f4f8fb",
            padding: "40px 20px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            animation: "fadeIn 1s ease-in-out",
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
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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

        {/* Filter Section */}
        <Container className="mb-4">
          <Button
            variant="outline-primary"
            onClick={() => setShowFilter(!showFilter)}
            style={{
              marginBottom: "20px",
              fontSize: "1rem",
              padding: "10px 20px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
          </Button>

          {showFilter && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: "20px",
                animation: "slideDown 0.5s ease-in-out",
              }}
            >
              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="investmentDuration" className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#2c3e50" }}>Investment Duration</Form.Label>
                    <Form.Select
                      name="investmentDuration"
                      value={filter.investmentDuration}
                      onChange={handleFilterChange}
                      style={{ borderRadius: "8px", padding: "10px" }}
                    >
                      <option value="">All</option>
                      <option value="Short Term">Short Term</option>
                      <option value="Long Term">Long Term</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group controlId="forYear" className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#2c3e50" }}>For Year</Form.Label>
                    <Form.Select
                      name="forYear"
                      value={filter.forYear}
                      onChange={handleFilterChange}
                      style={{ borderRadius: "8px", padding: "10px" }}
                    >
                      <option value="">All</option>
                      <option value="8">8 Years</option>
                      <option value="21">21 Years</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group controlId="baseInvestmentAmount" className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#2c3e50" }}>Base Investment Amount</Form.Label>
                    <Form.Select
                      name="baseInvestmentAmount"
                      value={filter.baseInvestmentAmount}
                      onChange={handleFilterChange}
                      style={{ borderRadius: "8px", padding: "10px" }}
                    >
                      <option value="">All</option>
                      <option value="0-50000">₹0 - ₹50,000</option>
                      <option value="50001-100000">₹50,001 - ₹1,00,000</option>
                      <option value="100001">Above ₹1,00,000</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
        </Container>

        {/* Investment Plans */}
        <Container className="mt-4">
          <h3 className="mb-4 fw-bold">Top Investment Plans</h3>
          {filteredPlans.slice(0, visibleCount).map((plan, idx) => (
            <Card
              key={idx}
              className="shadow-sm mb-4"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                animation: "fadeIn 0.5s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body>
                <Row className="align-items-center">
                  {/* Logo Placeholder */}
                  <Col md={2} xs={12} className="text-center">
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
                        margin: "auto",
                      }}
                    >
                      {plan.name.charAt(0)}
                    </div>
                  </Col>

                  {/* Plan Info */}
                  <Col md={3} xs={12}>
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
                  <Col md={5} xs={12}>
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
                  <Col md={2} xs={12} className="text-center mt-3 mt-md-0">
                    <Button
                      variant="primary"
                      className="px-3"
                      onClick={() => handleInvestNow(plan)}
                      style={{ borderRadius: "8px", padding: "10px 20px" }}
                    >
                      Invest Now
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {visibleCount < filteredPlans.length && (
            <div className="text-center mt-3">
              <Button
                variant="outline-primary"
                onClick={handleSeeMore}
                style={{ borderRadius: "8px", padding: "10px 20px" }}
              >
                See More
              </Button>
            </div>
          )}
        </Container>

        {/* Form Modal */}
        <Modal
          show={showForm}
          onHide={() => setShowForm(false)}
          centered
          style={{ animation: "fadeIn 0.5s ease-in-out" }}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#2c3e50", fontWeight: "600" }}>
              Enter Your Details to Invest
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {paymentError && (
              <Alert variant="danger" style={{ marginBottom: "1rem" }}>
                {paymentError}
              </Alert>
            )}
            <Form>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.name}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.email}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="mobile" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.mobile}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.mobile}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="address" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.address}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="pan" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>PAN</Form.Label>
                <Form.Control
                  type="text"
                  name="pan"
                  value={formData.pan}
                  disabled
                  style={{ borderRadius: "8px", padding: "10px", backgroundColor: "#e9ecef" }}
                />
              </Form.Group>

              <Form.Group controlId="dob" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.dob}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.dob}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="annualIncome" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Annual Income (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.annualIncome}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.annualIncome}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="nomineeName" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Nominee Name</Form.Label>
                <Form.Control
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.nomineeName}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.nomineeName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="nomineeRelationship" className="mb-3">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500" }}>Nominee Relationship</Form.Label>
                <Form.Control
                  type="text"
                  name="nomineeRelationship"
                  value={formData.nomineeRelationship}
                  onChange={handleFormChange}
                  isInvalid={!!formErrors.nomineeRelationship}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.nomineeRelationship}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowForm(false)}
              style={{ borderRadius: "8px", padding: "10px 20px" }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={initiatePayment}
              disabled={paymentLoading}
              style={{ borderRadius: "8px", padding: "10px 20px" }}
            >
              {paymentLoading ? (
                <>
                  <Spinner animation="border" size="sm" style={{ marginRight: "5px" }} />
                  Processing...
                </>
              ) : (
                "Proceed to Pay"
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Informational Sections */}
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

      <Footer />
    </>
  );
};

export default Investment;

// CSS Animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

// Inject CSS animations into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);