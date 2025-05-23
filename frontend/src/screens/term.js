import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/navBar';
import { Container, Row, Col, Image, Modal, Form, Button, Card, Table, Alert } from "react-bootstrap";
import Footer from '../components/footer';
import { useSpring, animated } from 'react-spring';

// PolicyCard component to handle individual card rendering and animation
const PolicyCard = ({ item, idx, onCheckPrices }) => {
  // Animation for each policy card
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: idx * 100,
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.div
      style={{
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        marginBottom: "15px",
        padding: window.innerWidth <= 768 ? "10px" : "15px",
        ...cardAnimation,
      }}
    >
      <Row className="align-items-center">
        <Col md={2} xs={12} className="text-center">
          <img
            src={item.logoUrl}
            alt={item.name}
            style={{
              maxHeight: window.innerWidth <= 768 ? "40px" : "50px",
              width: "auto",
            }}
          />
        </Col>
        <Col md={3} xs={12}>
          <h6 style={{
            fontWeight: "bold",
            fontSize: window.innerWidth <= 7481 ? "14px" : "16px",
            margin: window.innerWidth <= 768 ? "5px 0" : "0",
          }}>{item.name}</h6>
          <p style={{
            margin: 0,
            fontSize: window.innerWidth <= 768 ? "12px" : "14px",
            color: "#6c757d",
          }}>
            Claim Type: <strong>{item.claimType}</strong>
          </p>
          <p style={{
            margin: 0,
            fontSize: window.innerWidth <= 768 ? "12px" : "14px",
            color: "#6c757d",
          }}>
            Life Cover: <strong>{item.lifeCoverAmount}</strong>
          </p>
        </Col>
        <Col md={4} xs={12}>
          <p style={{
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#28a745",
            fontSize: window.innerWidth <= 768 ? "14px" : "16px",
          }}>
            Key Features:
          </p>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
          }}>
            {item.keyFeatures.map((feature, i) => (
              <li
                key={i}
                style={{
                  display: "inline-block",
                  margin: "2px",
                  padding: "5px 10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "5px",
                  fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                }}
              >
                ✅ {feature}
              </li>
            ))}
          </ul>
        </Col>
        <Col md={3} xs={12} style={{
          textAlign: window.innerWidth <= 768 ? "center" : "right",
          marginTop: window.innerWidth <= 768 ? "10px" : 0,
        }}>
          <p style={{
            marginBottom: "5px",
            fontSize: window.innerWidth <= 768 ? "14px" : "16px",
          }}>
            Starting From <strong>₹ {item.premiumStartingFrom / 100}</strong>
          </p>
          <Button
            variant="primary"
            onClick={onCheckPrices}
            style={{
              fontSize: window.innerWidth <= 768 ? "12px" : "14px",
              padding: window.innerWidth <= 768 ? "8px 15px" : "10px 20px",
              borderRadius: "5px",
            }}
          >
            Check Prices
          </Button>
        </Col>
      </Row>
    </animated.div>
  );
};

// Main Term component
const Term = () => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState({});

  // Filter form states
  const [lifeCover, setLifeCover] = useState("");
  const [gender, setGender] = useState("");
  const [claimType, setClaimType] = useState("");
  const [tobaccoUse, setTobaccoUse] = useState(false);

  // Proposal form states with validation
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Retrieve user data from local storage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?._id || '';
  const userPan = storedUser?.pan || '';

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "7981234567",
    address: "",
    dob: "",
    pan: userPan,
    annualIncome: "",
    nomineeName: "",
    nomineeRelationship: "",
    tobaccoUseConfirmed: false,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    dob: "",
    pan: "",
    annualIncome: "",
    nomineeName: "",
    nomineeRelationship: "",
    tobaccoUseConfirmed: "",
  });

  // State to store existing term payments
  const [existingPayments, setExistingPayments] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL;

  // Fetch existing term payments for the user
  useEffect(() => {
    const fetchExistingPayments = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${API_BASE}/api/term-payment/user/${userId}`);
          setExistingPayments(response.data);
        } catch (err) {
          console.error("Error fetching existing term payments:", err);
        }
      }
    };
    fetchExistingPayments();
  }, [userId]);

  useEffect(() => {
    fetchProviders();
  }, [filter]);

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

  // Handle filter form submission
  const handleFilterSubmit = () => {
    const newFilter = {};
    if (lifeCover) newFilter.lifeCoverAmount = lifeCover;
    if (gender) newFilter.gender = gender;
    if (claimType) newFilter.claimType = claimType;
    newFilter.tobaccoUse = tobaccoUse;
    setFilter(newFilter);
    setVisibleCount(5);
  };

  // Form validation logic
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    const existingPayment = existingPayments.find(
      (payment) => payment.userId === userId && 
                   payment.termInsuranceId === selectedPlan?._id
    );
    if (existingPayment) {
      errors.existing = "You have already purchased this term insurance plan.";
      isValid = false;
    }

    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = "Name can only contain letters and spaces";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.mobile) {
      errors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be exactly 10 digits";
      isValid = false;
    }

    if (!formData.address) {
      errors.address = "Address is required";
      isValid = false;
    }

    if (!formData.dob) {
      errors.dob = "Date of Birth is required";
      isValid = false;
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        errors.dob = "You must be at least 18 years old";
        isValid = false;
      }
    }

    if (!formData.pan) {
      errors.pan = "PAN number is required";
      isValid = false;
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan)) {
      errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
      isValid = false;
    }

    if (!formData.annualIncome) {
      errors.annualIncome = "Annual Income is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.annualIncome) || parseInt(formData.annualIncome) < 100000) {
      errors.annualIncome = "Annual Income must be a number and at least 1 lakh";
      isValid = false;
    }

    if (!formData.nomineeName) {
      errors.nomineeName = "Nominee Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.nomineeName)) {
      errors.nomineeName = "Nominee Name can only contain letters and spaces";
      isValid = false;
    }

    if (!formData.nomineeRelationship) {
      errors.nomineeRelationship = "Nominee Relationship is required";
      isValid = false;
    }

    if (!formData.tobaccoUseConfirmed && tobaccoUse) {
      errors.tobaccoUseConfirmed = "Please confirm tobacco use";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleShowModal = (item) => {
    if (!storedUser) {
      setShowLoginModal(true);
    } else {
      setSelectedPlan(item);
      setShowModal(true);
      setFormData(prev => ({
        ...prev,
        pan: userPan
      }));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setFormErrors({});
    setFormData({
      name: "",
      email: "",
      mobile: "7981234567",
      address: "",
      dob: "",
      pan: userPan,
      annualIncome: "",
      nomineeName: "",
      nomineeRelationship: "",
      tobaccoUseConfirmed: false,
    });
  };

  const handlePay = async () => {
    if (!selectedPlan || !validateForm()) return;

    // Treat premiumStartingFrom as an amount in paise (like Car.js)
    const premiumInPaise = selectedPlan.premiumStartingFrom; // Already in paise
    const gstInPaise = Math.round((premiumInPaise * 18) / 100); // GST in paise
    const totalAmountInPaise = premiumInPaise + gstInPaise; // Total in paise

    // Safeguard: Cap the amount to Razorpay's test mode limit (e.g., 100000 paise = ₹1000)
    const MAX_RAZORPAY_AMOUNT = 100000; // ₹1000 in paise
    if (totalAmountInPaise > MAX_RAZORPAY_AMOUNT) {
      alert(`Total amount (${(totalAmountInPaise / 100).toFixed(2)} ₹) exceeds the maximum allowed amount in test mode (${MAX_RAZORPAY_AMOUNT / 100} ₹). Please select a plan with a lower premium for testing.`);
      return;
    }

    try {
      const { data: order } = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: totalAmountInPaise, // Already in paise, no further conversion
      });

      const payload = {
        userId,
        termInsuranceId: selectedPlan._id,
        ...formData,
        amount: totalAmountInPaise / 100, // Store in rupees in the database
      };

      await axios.post(`${API_BASE}/api/term-payment`, payload);

      const options = {
        key: 'rzp_test_7Hbs0bQhstZUoC',
        amount: totalAmountInPaise, // Use the amount in paise
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Term Insurance Payment',
        order_id: order.id,
        handler: function (response) {
          console.log('Payment Success', response);
          handleClose();
          const fetchExistingPayments = async () => {
            try {
              const response = await axios.get(`${API_BASE}/api/term-payment/user/${userId}`);
              setExistingPayments(response.data);
            } catch (err) {
              console.error("Error fetching existing term payments:", err);
            }
          };
          fetchExistingPayments();
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#F37254'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.log('Payment Failed', response.error);
        alert('Payment failed. Please try again!');
      });
    } catch (error) {
      console.error('Error during payment process:', error);
      alert('An error occurred. Please try again!');
    }
  };

  const filterAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 200, friction: 20 },
  });

  const modalAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: showModal ? 1 : 0, transform: showModal ? 'scale(1)' : 'scale(0.8)' },
    config: { tension: 200, friction: 20 },
  });

  return (
    <div style={{
      fontFamily: "'Arial', sans-serif",
      backgroundColor: "#f8f9fa",
      padding: 0,
      margin: 0,
      minHeight: "100vh",
    }}>
      <header style={{
        position: "sticky",
        top: 0,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}>
        <Navbar />
      </header>

      <div style={{
        padding: window.innerWidth <= 768 ? "20px" : "0 140px",
      }}>
        <Container style={{
          textAlign: "center",
          padding: "40px 0",
          background: "#f8f9fa",
          borderRadius: "20px",
          marginBottom: "20px",
        }}>
          <div style={{
            width: window.innerWidth <= 768 ? "150px" : "200px",
            height: window.innerWidth <= 768 ? "150px" : "200px",
            margin: "0 auto",
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "4px solid #dee2e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}>
            <div style={{
              width: window.innerWidth <= 768 ? "100px" : "140px",
              height: window.innerWidth <= 768 ? "100px" : "140px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "4px solid #dee2e6",
            }}>
              <div style={{
                width: window.innerWidth <= 768 ? "70px" : "100px",
                height: window.innerWidth <= 768 ? "70px" : "100px",
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #dee2e6",
              }}>
                <Image
                  src="https://static.insurancedekho.com/pwa/img/termbannericon.svg"
                  alt="Term Banner"
                  fluid
                  style={{ maxHeight: window.innerWidth <= 768 ? "40px" : "50px" }}
                />
              </div>
            </div>
          </div>

          <Row className="mt-5 g-4 justify-content-center">
            {insurers.map((insurer, index) => (
              <Col key={index} xs={6} sm={4} md={3} lg={2} className="text-center">
                <div style={{
                  border: "1px solid #dee2e6",
                  minHeight: window.innerWidth <= 768 ? "100px" : "130px",
                  padding: window.innerWidth <= 768 ? "10px" : "15px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s",
                }}>
                  <Image
                    src={insurer.src}
                    alt={insurer.name}
                    fluid
                    style={{
                      maxHeight: window.innerWidth <= 768 ? "30px" : "40px",
                      marginBottom: "10px",
                    }}
                  />
                  <p style={{
                    margin: 0,
                    fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    fontWeight: 600,
                    color: "#6c757d",
                  }}>{insurer.name}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        <animated.div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: window.innerWidth <= 768 ? "10px" : "20px",
          ...filterAnimation,
        }}>
          <h3 style={{
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#2c3e50",
            fontSize: window.innerWidth <= 768 ? "20px" : "24px",
          }}>
            Filter Term Insurance Plans
          </h3>
          <div style={{
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: window.innerWidth <= 768 ? "15px" : "20px",
          }}>
            <Row className="g-3">
              <Col md={3} xs={12}>
                <Form.Group>
                  <Form.Label style={{
                    fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    color: "#2c3e50",
                    fontWeight: "bold",
                  }}>Life Cover Amount</Form.Label>
                  <Form.Select
                    value={lifeCover}
                    onChange={(e) => setLifeCover(e.target.value)}
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      borderRadius: "5px",
                      padding: window.innerWidth <= 768 ? "6px" : "8px",
                    }}
                  >
                    <option value="">Select Life Cover</option>
                    {["50L", "1Cr", "1.5Cr", "2Cr"].map((amount, idx) => (
                      <option key={idx} value={amount}>{amount}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} xs={12}>
                <Form.Group>
                  <Form.Label style={{
                    fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    color: "#2c3e50",
                    fontWeight: "bold",
                  }}>Gender</Form.Label>
                  <Form.Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      borderRadius: "5px",
                      padding: window.innerWidth <= 768 ? "6px" : "8px",
                    }}
                  >
                    <option value="">Select Gender</option>
                    {["Male", "Female", "Other"].map((g, idx) => (
                      <option key={idx} value={g.toLowerCase()}>{g}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} xs={12}>
                <Form.Group>
                  <Form.Label style={{
                    fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    color: "#2c3e50",
                    fontWeight: "bold",
                  }}>Claim Type</Form.Label>
                  <Form.Select
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value)}
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      borderRadius: "5px",
                      padding: window.innerWidth <= 768 ? "6px" : "8px",
                    }}
                  >
                    <option value="">Select Claim Type</option>
                    {["Cashless", "Reimbursement"].map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} xs={12}>
                <Form.Group>
                  <Form.Label style={{
                    fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    color: "#2c3e50",
                    fontWeight: "bold",
                  }}>Tobacco Use</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="I use tobacco"
                    checked={tobaccoUse}
                    onChange={(e) => setTobaccoUse(e.target.checked)}
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant="danger"
              onClick={handleFilterSubmit}
              style={{
                marginTop: "15px",
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                padding: window.innerWidth <= 768 ? "8px 15px" : "10px 20px",
                borderRadius: "5px",
              }}
            >
              Apply Filters
            </Button>
          </div>
        </animated.div>

        <div style={{
          marginTop: "20px",
          padding: "0 15px",
        }}>
          {data.length === 0 && (
            <Alert variant="info" style={{
              textAlign: "center",
              fontSize: window.innerWidth <= 768 ? "14px" : "16px",
            }}>
              No term insurance plans found for the selected criteria. Try adjusting the filters.
            </Alert>
          )}
          {data.slice(0, visibleCount).map((item, idx) => (
            <PolicyCard
              key={idx}
              item={item}
              idx={idx}
              onCheckPrices={() => handleShowModal(item)}
            />
          ))}

          {visibleCount < data.length && (
            <div style={{
              textAlign: "center",
              marginBottom: "20px",
            }}>
              <Button
                variant="outline-primary"
                onClick={handleLoadMore}
                style={{
                  fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                  padding: window.innerWidth <= 768 ? "8px 15px" : "10px 20px",
                  borderRadius: "5px",
                }}
              >
                See More
              </Button>
            </div>
          )}
        </div>

        <Container fluid style={{
          background: "#f9f9f9",
          padding: window.innerWidth <= 768 ? "20px" : "40px 20px",
        }}>
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{
              fontSize: window.innerWidth <= 768 ? "24px" : "32px",
              fontWeight: 700,
              marginBottom: "20px",
            }}>
              What is Term Insurance?
            </h2>
            <p style={{
              fontSize: window.innerWidth <= 768 ? "14px" : "16px",
              lineHeight: 1.6,
              color: "#444",
            }}>
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

          <section style={{ marginBottom: "40px" }}>
            <Card style={{
              padding: window.innerWidth <= 768 ? "20px" : "30px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}>
              <h2 style={{
                fontSize: window.innerWidth <= 768 ? "22px" : "28px",
                fontWeight: 700,
                marginBottom: "20px",
              }}>
                Eligibility Criteria of Term Insurance
              </h2>
              <Table striped bordered responsive>
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                    <th style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Features</th>
                    <th style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Eligibility Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Minimum Entry Age</td>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>18 years</td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Maximum Entry Age</td>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>65 years</td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Minimum Policy Tenure</td>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>
                      5 years (may vary from one insurance provider to another)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Maximum Policy Tenure</td>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>
                      No limit (may vary from one insurance provider to another)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Who can Purchase It?</td>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>
                      Salaried people, self-employed, housewives, professionals
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>Available for NRIs</td>
                    <td style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>
                      Yes, term insurance plan is available for NRIs
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </section>

          <section>
            <h2 style={{
              fontSize: window.innerWidth <= 768 ? "22px" : "28px",
              fontWeight: 700,
              marginBottom: "20px",
            }}>
              How To Buy Term Insurance With InsuranceDekho?
            </h2>
            <Row>
              {[
                {
                  img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg",
                  title: "Fill Your Details",
                  desc: "Enter your personal details such as name, mobile number, gender and date of birth. Click on the ‘View Instant Quotes’ button to see available quotes.",
                },
                {
                  img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg",
                  title: "Compare Different Term Insurance Quotes",
                  desc: "Based on the details provided by you, different term insurance quotes will get displayed to you. Compare the available term plans and select the plan that suits your requirements.",
                },
                {
                  img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img3.svg",
                  title: "Make The Payment",
                  desc: "After selecting the best term plan for yourself, adjust the sum assured and the policy term. Once all plan details are finalised make the payment for the premium. You can make the payment via netbanking or debit/credit card.",
                },
              ].map((step, index) => (
                <Col md={4} xs={12} key={index} style={{ marginBottom: "15px" }}>
                  <div style={{
                    backgroundColor: "white",
                    padding: window.innerWidth <= 768 ? "15px" : "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    height: "100%",
                  }}>
                    <img
                      src={step.img}
                      alt={step.title}
                      style={{
                        width: window.innerWidth <= 768 ? "80px" : "98px",
                        height: window.innerWidth <= 768 ? "70px" : "88px",
                        marginBottom: "15px",
                      }}
                    />
                    <h4 style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "20px",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}>{step.title}</h4>
                    <p style={{
                      fontSize: window.innerWidth <= 768 ? "13px" : "15px",
                      color: "#555",
                      margin: 0,
                    }}>{step.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        </Container>
      </div>

      {selectedPlan && (
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <animated.div style={modalAnimation}>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: window.innerWidth <= 768 ? "18px" : "24px" }}>
                Proposal Form
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
              borderRadius: "10px",
              padding: window.innerWidth <= 768 ? "15px" : "20px",
            }}>
              <Row>
                <Col md={7} xs={12}>
                  <Form>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Full Name</Form.Label>
                      <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!formErrors.name}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Email</Form.Label>
                      <Form.Control
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!formErrors.email}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Mobile Number</Form.Label>
                      <Form.Control
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        isInvalid={!!formErrors.mobile}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.mobile}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Address</Form.Label>
                      <Form.Control
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        isInvalid={!!formErrors.address}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        isInvalid={!!formErrors.dob}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.dob}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>PAN Number</Form.Label>
                      <Form.Control
                        name="pan"
                        value={formData.pan}
                        disabled
                        isInvalid={!!formErrors.pan}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.pan}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Annual Income (in ₹)</Form.Label>
                      <Form.Control
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        isInvalid={!!formErrors.annualIncome}
                        placeholder="e.g., 500000"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.annualIncome}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Nominee Name</Form.Label>
                      <Form.Control
                        name="nomineeName"
                        value={formData.nomineeName}
                        onChange={handleChange}
                        isInvalid={!!formErrors.nomineeName}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.nomineeName}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "15px" }}>
                      <Form.Label style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}>Nominee Relationship</Form.Label>
                      <Form.Select
                        name="nomineeRelationship"
                        value={formData.nomineeRelationship}
                        onChange={handleChange}
                        isInvalid={!!formErrors.nomineeRelationship}
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          padding: window.innerWidth <= 768 ? "6px" : "8px",
                        }}
                      >
                        <option value="">Select Relationship</option>
                        {["Spouse", "Parent", "Child", "Sibling", "Other"].map((rel, idx) => (
                          <option key={idx} value={rel}>{rel}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" style={{
                        color: "#dc3545",
                        fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                        marginTop: "5px",
                      }}>
                        {formErrors.nomineeRelationship}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {tobaccoUse && (
                      <Form.Group style={{ marginBottom: "15px" }}>
                        <Form.Check
                          type="checkbox"
                          label="I confirm I use tobacco"
                          name="tobaccoUseConfirmed"
                          checked={formData.tobaccoUseConfirmed}
                          onChange={handleChange}
                          isInvalid={!!formErrors.tobaccoUseConfirmed}
                          style={{
                            fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          }}
                        />
                        <Form.Control.Feedback type="invalid" style={{
                          color: "#dc3545",
                          fontSize: window.innerWidth <= 768 ? "10px" : "12px",
                          marginTop: "5px",
                        }}>
                          {formErrors.tobaccoUseConfirmed}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}
                    {formErrors.existing && (
                      <Alert variant="danger" style={{ marginTop: "15px" }}>
                        {formErrors.existing}
                      </Alert>
                    )}
                  </Form>
                </Col>

                <Col md={5} xs={12} style={{ marginTop: window.innerWidth <= 768 ? "15px" : 0 }}>
                  <div style={{
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}>
                    <div style={{
                      fontWeight: "bold",
                      marginBottom: "10px",
                      fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                    }}>{selectedPlan.name}</div>
                    <div style={{
                      color: "#6c757d",
                      marginBottom: "10px",
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    }}>{selectedPlan.claimType}</div>
                    <hr style={{ margin: "10px 0" }} />
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    }}>
                      <div>Premium</div>
                      <div>₹{(selectedPlan.premiumStartingFrom / 100).toFixed(2)}</div>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    }}>
                      <div>GST (18%)</div>
                      <div>₹{((selectedPlan.premiumStartingFrom * 18 / 100) / 100).toFixed(2)}</div>
                    </div>
                    <hr style={{ margin: "10px 0" }} />
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    }}>
                      <div>Total Payable</div>
                      <div>₹{((selectedPlan.premiumStartingFrom * 1.18) / 100).toFixed(2)}</div>
                    </div>
                    <Button
                      variant="primary"
                      onClick={handlePay}
                      disabled={
                        !formData.name ||
                        !formData.email ||
                        !formData.mobile ||
                        !formData.address ||
                        !formData.dob ||
                        !formData.pan ||
                        !formData.annualIncome ||
                        !formData.nomineeName ||
                        !formData.nomineeRelationship ||
                        (tobaccoUse && !formData.tobaccoUseConfirmed) ||
                        Object.values(formErrors).some(error => error)
                      }
                      style={{
                        marginTop: "15px",
                        width: "100%",
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                        padding: window.innerWidth <= 768 ? "8px 15px" : "10px 20px",
                        borderRadius: "5px",
                      }}
                    >
                      Review & Pay ₹{((selectedPlan.premiumStartingFrom * 1.18) / 100).toFixed(2)}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </animated.div>
        </Modal>
      )}

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: window.innerWidth <= 768 ? "18px" : "24px" }}>
            Login Required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          fontSize: window.innerWidth <= 768 ? "14px" : "16px",
        }}>
          Please log in to proceed with viewing prices and purchasing insurance.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowLoginModal(false)}
            style={{
              fontSize: window.innerWidth <= 768 ? "12px" : "14px",
              padding: window.innerWidth <= 768 ? "8px 15px" : "10px 20px",
              borderRadius: "5px",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default Term;