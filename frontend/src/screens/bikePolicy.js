import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { Modal, Form, Button, Row, Col, Card, Nav, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Custom CSS for styling and responsiveness
const styles = `
  .insurance-container {
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    padding: 0;
    margin: 0;
  }
  .form-section {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }
  .form-card {
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  .form-label {
    font-size: 14px;
    color: #2c3e50;
    font-weight: bold;
  }
  .form-select, .form-control {
    font-size: 14px;
    border-radius: 5px;
    padding: 8px;
  }
  .policy-card {
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
    padding: 15px;
  }
  .modal-content-custom {
    border-radius: 10px;
    padding: 20px;
  }
  .error-text {
    color: #dc3545;
    font-size: 12px;
    margin-top: 5px;
  }
  .btn-custom {
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 5px;
  }
  .accordion-item {
    border: none;
    margin-bottom: 10px;
  }
  .accordion-header {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    padding: 10px 0;
    cursor: pointer;
  }
  .addon-card {
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
    transition: transform 0.2s;
  }
  .addon-card:hover {
    transform: translateY(-5px);
  }
  .intro-section {
    background-color: #fff;
    padding: 40px 20px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }
  .intro-section h2 {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  .intro-section p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto 20px;
  }
  .intro-section img {
    margin-top: 20px;
  }
  .faq-section {
    background-color: #fff;
    padding: 40px 20px;
    border-top: 1px solid #e0e0e0;
  }
  .faq-section h2 {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
    text-align: center;
  }
  .faq-item {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 10px;
  }
  .faq-question {
    font-size: 16px;
    font-weight: bold;
    color: #2c3e50;
    padding: 15px 0;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .faq-question:hover {
    color: #dc3545;
  }
  .faq-answer {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
    padding: 0 0 15px 0;
  }
  @media (max-width: 768px) {
    .form-section {
      padding: 10px;
    }
    .form-card {
      padding: 15px;
    }
    .form-label {
      font-size: 12px;
    }
    .form-select, .form-control {
      font-size: 12px;
      padding: 6px;
    }
    .policy-card {
      padding: 10px;
    }
    .btn-custom {
      font-size: 12px;
      padding: 8px 15px;
    }
    .modal-content-custom {
      padding: 15px;
    }
    .accordion-header {
      font-size: 14px;
    }
    .addon-card {
      padding: 10px;
    }
    .intro-section {
      padding: 20px 10px;
    }
    .intro-section h2 {
      font-size: 24px;
    }
    .intro-section p {
      font-size: 14px;
    }
    .intro-section img {
      width: 200px;
      height: auto;
    }
    .faq-section {
      padding: 20px 10px;
    }
    .faq-section h2 {
      font-size: 24px;
    }
    .faq-question {
      font-size: 14px;
    }
    .faq-answer {
      font-size: 12px;
    }
  }
`;

const BikePolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("Comprehensive");
  const [visibleCount, setVisibleCount] = useState(5);
  const [filteredPolicies, setFilteredPolicies] = useState([]);

  // Form states for bike selection
  const [bikeBrands, setBikeBrands] = useState([]);
  const [bikeModels, setBikeModels] = useState([]);
  const [bikeTypes, setBikeTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showNoModelModal, setShowNoModelModal] = useState(false);

  // Proposal form states with validation
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    loan: false,
    name: "",
    email: "",
    mobile: "7981234567", // Pre-filled but editable
    address: "",
    registrationNumber: "",
    pan: "",
    dob: "",
    rto: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    registrationNumber: "",
    pan: "",
    dob: "",
    rto: "",
  });

  // FAQ state for toggling answers
  const [openFaq, setOpenFaq] = useState(null);

  // State to store existing policies
  const [existingPolicies, setExistingPolicies] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL;

  // Fetch existing policies for the user
  useEffect(() => {
    const fetchExistingPolicies = async () => {
      const storedUserForId = JSON.parse(localStorage.getItem('user'));
      const userId = storedUserForId?._id || '';
      if (userId) {
        try {
          const response = await axios.get(`${API_BASE}/api/bike-policy/user/${userId}`);
          setExistingPolicies(response.data);
        } catch (err) {
          console.error("Error fetching existing bike policies:", err);
        }
      }
    };
    fetchExistingPolicies();
  }, []);

  // Fetch bike brands
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/bike-insurance-provider/all`)
      .then((res) => {
        setPolicies(res.data);
        const uniqueBrands = [...new Set(res.data.map(item => item.bikeBrandName))];
        setBikeBrands(uniqueBrands);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bike policies:", err);
        setLoading(false);
      });
  }, []);

  // Fetch bike models
  useEffect(() => {
    if (selectedBrand) {
      axios
        .get(`${API_BASE}/api/bike-insurance-provider/filter?brand=${selectedBrand}`)
        .then((res) => {
          const uniqueModels = [...new Set(res.data.map(item => item.bikeModel))];
          if (uniqueModels.length === 0) {
            setShowNoModelModal(true);
            setBikeModels([]);
            setSelectedModel("");
          } else {
            setBikeModels(uniqueModels);
            setShowNoModelModal(false);
          }
          setBikeTypes([]);
          setCities([]);
          setYears([]);
          setSelectedModel("");
          setSelectedType("");
          setSelectedCity("");
          setSelectedYear("");
          setFilteredPolicies([]);
          setFormSubmitted(false);
        })
        .catch((err) => console.error("Error fetching bike models:", err));
    }
  }, [selectedBrand]);

  // Fetch bike types
  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios
        .get(`${API_BASE}/api/bike-insurance-provider/filter?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => {
          const uniqueTypes = [...new Set(res.data.map(item => item.bikeType || "Petrol"))];
          setBikeTypes(uniqueTypes);
          setCities([]);
          setYears([]);
          setSelectedType("");
          setSelectedCity("");
          setSelectedYear("");
          setFilteredPolicies([]);
          setFormSubmitted(false);
        })
        .catch((err) => console.error("Error fetching bike types:", err));
    }
  }, [selectedBrand, selectedModel]);

  // Fetch cities
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedType) {
      axios
        .get(`${API_BASE}/api/bike-insurance-provider/filter?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => {
          const uniqueCities = [...new Set(res.data.map(item => item.bikeRegisteredCity))];
          setCities(uniqueCities);
          setYears([]);
          setSelectedCity("");
          setSelectedYear("");
          setFilteredPolicies([]);
          setFormSubmitted(false);
        })
        .catch((err) => console.error("Error fetching cities:", err));
    }
  }, [selectedBrand, selectedModel, selectedType]);

  // Fetch years
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedType && selectedCity) {
      axios
        .get(`${API_BASE}/api/bike-insurance-provider/filter?brand=${selectedBrand}&model=${selectedModel}&city=${selectedCity}`)
        .then((res) => {
          const uniqueYears = [...new Set(res.data.map(item => item.bikeOwnedYear))];
          setYears(uniqueYears);
          setSelectedYear("");
          setFilteredPolicies([]);
          setFormSubmitted(false);
        })
        .catch((err) => console.error("Error fetching years:", err));
    }
  }, [selectedBrand, selectedModel, selectedType, selectedCity]);

  // Filter policies based on selection
  const handleCalculatePrice = () => {
    if (selectedBrand && selectedModel && selectedType && selectedCity && selectedYear) {
      axios
        .get(`${API_BASE}/api/bike-insurance-provider/filter?brand=${selectedBrand}&model=${selectedModel}&year=${selectedYear}&city=${selectedCity}`)
        .then((res) => {
          const filtered = res.data.filter(policy =>
            filterType === 'All' || policy.insuranceTypes?.includes(filterType)
          );
          setFilteredPolicies(filtered);
          setFormSubmitted(true);
        })
        .catch((err) => console.error("Error fetching filtered policies:", err));
    }
  };

  // Generate year options
  const yearOptions = [];
  for (let year = 1900; year <= 2025; year++) {
    yearOptions.push(year);
  }

  // Function to calculate days left for policy expiration
  const calculateDaysLeft = (createdAt) => {
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setFullYear(createdDate.getFullYear() + 1); // Add 1 year to created date
    const currentDate = new Date();
    const timeDiff = expiryDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
    return daysLeft > 0 ? daysLeft : 0; // Return 0 if policy has expired
  };

  // Form validation logic with registration number check
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check for duplicate registration number
    const existingPolicy = existingPolicies.find(
      (policy) => policy.registrationNumber === formData.registrationNumber
    );
    if (existingPolicy) {
      const daysLeft = calculateDaysLeft(existingPolicy.createdAt);
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Registration Number',
        text: `You have already taken a policy for this registration number (${formData.registrationNumber}). It has ${daysLeft} days left until expiration.`,
        confirmButtonText: 'OK',
      });
      errors.registrationNumber = "This registration number already has an active policy";
      isValid = false;
    }

    // Name validation (letters and spaces only)
    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = "Name can only contain letters and spaces";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    // Mobile validation (exactly 10 digits)
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be exactly 10 digits";
      isValid = false;
    }

    // Address validation
    if (!formData.address) {
      errors.address = "Registration Address is required";
      isValid = false;
    }

    // Registration Number validation (e.g., XX12XX1234)
    if (!formData.registrationNumber) {
      errors.registrationNumber = "Registration Number is required";
      isValid = false;
    } else if (!/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(formData.registrationNumber)) {
      errors.registrationNumber = "Invalid format (e.g., MH12AB1234)";
      isValid = false;
    }

    // PAN validation (e.g., XXXXX1234X)
    if (!formData.pan) {
      errors.pan = "PAN number is required";
      isValid = false;
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan)) {
      errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
      isValid = false;
    }

    // Date of Birth validation (at least 18 years old)
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

    // RTO Pincode validation (exactly 6 digits)
    if (!formData.rto) {
      errors.rto = "RTO Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.rto)) {
      errors.rto = "RTO Pincode must be exactly 6 digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form input changes with real-time registration number validation
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Real-time validation for registration number
    if (name === "registrationNumber") {
      const existingPolicy = existingPolicies.find(
        (policy) => policy.registrationNumber === value
      );
      if (existingPolicy) {
        const daysLeft = calculateDaysLeft(existingPolicy.createdAt);
        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Registration Number',
          text: `You have already taken a policy for this registration number (${value}). It has ${daysLeft} days left until expiration.`,
          confirmButtonText: 'OK',
        });
        setFormErrors(prev => ({
          ...prev,
          registrationNumber: "This registration number already has an active policy"
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          registrationNumber: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(value) ? '' : "Invalid format (e.g., MH12AB1234)"
        }));
      }
    } else {
      // Clear error for the field being edited
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSeeMore = () => setVisibleCount(prev => prev + 5);

  const handleShowModal = (item) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      setShowLoginModal(true);
    } else {
      setSelectedPlan(item);
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setFormErrors({});
    setFormData({
      loan: false,
      name: "",
      email: "",
      mobile: "7981234567",
      address: "",
      registrationNumber: "",
      pan: "",
      dob: "",
      rto: "",
    });
  };

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?._id || '';

  const handlePay = async () => {
    if (!selectedPlan || !validateForm()) return;

    const premium = selectedPlan.premiumStartingFrom;
    const gst = (premium * 18) / 100;
    const totalAmount = premium + gst;
    const totalAmountInPaise = Math.round(totalAmount * 100); // Convert to integer paise (Razorpay expects amount in smallest currency unit)

    try {
      const { data: order } = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: totalAmountInPaise, // Send amount in paise as an integer
      });

      const payload = {
        userId,
        bikePolicyId: selectedPlan._id,
        ...formData,
        amount: totalAmount,
      };

      await axios.post(`${API_BASE}/api/bike-policy`, payload);

      const options = {
        key: 'rzp_test_7Hbs0bQhstZUoC',
        amount: order.amount, // Amount in paise (already handled by backend)
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Bike Insurance Payment',
        order_id: order.id,
        handler: function (response) {
          console.log('Payment Success', response);
          handleClose();
          // Refresh existing policies after successful payment
          const fetchExistingPolicies = async () => {
            try {
              const response = await axios.get(`${API_BASE}/api/bike-policy/user/${userId}`);
              setExistingPolicies(response.data);
            } catch (err) {
              console.error("Error fetching existing bike policies:", err);
            }
          };
          fetchExistingPolicies();
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

  // FAQ toggle handler
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const colors = ['#e0f7fa', '#e8f5e9', '#fff3e0', '#fce4ec', '#ede7f6'];

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <>
      {/* Inject custom styles */}
      <style>{styles}</style>

      <div className="insurance-container">
        <header className="sticky-top shadow-sm">
          <Navbar />
        </header>

        <div>
          <div className="intro-section">
            <h2>What Is Bike Insurance?</h2>
            <p>
              If you own a bike, you know its value: the thrill of adventure, fun rides with the
              family, and the convenience of travelling in the local area. Indian households very
              quickly become attached to their bikes, and to ensure these sentiments are protected,
              getting bike insurance is very important. Bike Insurance protects your vehicle from the
              potential risk of damage and ensures that your bike continues to provide memories
              even after a setback.
            </p>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/bike-landing.svg"
              alt="What Is Bike Insurance?"
              width="266"
              height="170"
            />
          </div>

          {/* Calculate Price Form */}
          <div className="form-section">
            <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
              Calculate Your Bike Insurance Price Online
            </h3>
            <div className="form-card">
              <div className="mb-3">
                <label className="form-label">Which bike variant do you ride?</label>
                <div className="d-flex flex-wrap gap-2">
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                      <option value="">Bike Brand</option>
                      {bikeBrands.map((brand, idx) => (
                        <option key={idx} value={brand}>{brand}</option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
                      <option value="">Model</option>
                      {bikeModels.map((model, idx) => (
                        <option key={idx} value={model}>{model}</option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} disabled={!selectedModel}>
                      <option value="">Fuel</option>
                      {bikeTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Which city is your bike registered in?</label>
                <div className="d-flex flex-wrap gap-2">
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedType}>
                      <option value="">City</option>
                      {cities.map((city, idx) => (
                        <option key={idx} value={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">When did you buy your bike?</label>
                <div className="flex-fill" style={{ maxWidth: '200px' }}>
                  <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} disabled={!selectedCity}>
                    <option value="">Year</option>
                    {(years.length > 0 ? years : yearOptions).map((year, idx) => (
                      <option key={idx} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <Button
                variant="danger"
                onClick={handleCalculatePrice}
                disabled={!selectedBrand || !selectedModel || !selectedType || !selectedCity || !selectedYear}
                className="btn-custom"
              >
                Calculate Price
              </Button>
              <p className="text-muted small mt-2">
                Disclaimer: Actual premium might vary based on your location, age, and other factors.
              </p>
            </div>

            {formSubmitted && filteredPolicies.length > 0 && (
              <div className="mt-4">
                <h4 className="fw-bold mb-3">Filtered Insurance Plans</h4>
                {filteredPolicies.map((item, idx) => (
                  <div className="policy-card" key={idx}>
                    <Row className="align-items-center">
                      <Col md={2} xs={12} className="text-center">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} className="img-fluid" style={{ maxHeight: "50px" }} alt={item.name} />
                        ) : (
                          <div className="d-flex justify-content-center align-items-center rounded-circle"
                            style={{
                              backgroundColor: colors[idx % colors.length],
                              width: '50px',
                              height: '50px',
                              fontSize: '20px',
                              color: '#495057',
                            }}>
                            🚲
                          </div>
                        )}
                      </Col>
                      <Col md={3} xs={12}>
                        <h6 className="fw-bold">{item.name}</h6>
                        <p className="mb-0 small text-muted">Cashless Garages: <strong>{item.cashlessGarages}</strong></p>
                        <p className="mb-0 small text-muted">Claims Settled: <strong>{item.claimsSettled}</strong></p>
                        <p className="mb-0 small text-muted">{filterType === "Comprehensive" ? "ZERO DEP. CLAIMS" : item.claimType}</p>
                      </Col>
                      <Col md={4} xs={12}>
                        <p className="mb-1 fw-bold text-success">Key Features:</p>
                        <ul className="list-inline mb-0">
                          {item.keyFeatures.map((feature, i) => (
                            <li key={i} className="list-inline-item badge bg-light text-dark border">
                              ✅ {feature}
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col md={3} xs={12} className="text-end">
                        <p className="mb-1">Starting From <strong>₹ {item.premiumStartingFrom}</strong></p>
                        <Button variant="danger" onClick={() => handleShowModal(item)} className="btn-custom">
                          Check Prices
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            )}
            {formSubmitted && filteredPolicies.length === 0 && (
              <Alert variant="warning" className="mt-4">
                No insurance plans found for the selected criteria.
              </Alert>
            )}
          </div>

          {/* Top Plans Section */}
          <div className="form-section">
            <h3 className="fw-bold mb-3">Top Bike Insurance Plans</h3>
            <Nav variant="tabs" className="mb-4">
              {["Comprehensive", "Third Party", "Own Damage"].map((type) => (
                <Nav.Item key={type}>
                  <Nav.Link
                    active={filterType === type}
                    onClick={() => {
                      setFilterType(type);
                      setVisibleCount(5);
                    }}
                  >
                    {type}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            {policies
              .filter(policy => filterType === 'All' || policy.insuranceTypes?.includes(filterType))
              .slice(0, visibleCount)
              .map((item, idx) => (
                <div className="policy-card" key={idx}>
                  <Row className="align-items-center">
                    <Col md={2} xs={12} className="text-center">
                      {item.logoUrl ? (
                        <img src={item.logoUrl} className="img-fluid" style={{ maxHeight: "50px" }} alt={item.name} />
                      ) : (
                        <div className="d-flex justify-content-center align-items-center rounded-circle"
                          style={{
                            backgroundColor: colors[idx % colors.length],
                            width: '50px',
                            height: '50px',
                            fontSize: '20px',
                            color: '#495057',
                          }}>
                          🚲
                        </div>
                      )}
                    </Col>
                    <Col md={3} xs={12}>
                      <h6 className="fw-bold">{item.name}</h6>
                      <p className="mb-0 small text-muted">Cashless Garages: <strong>{item.cashlessGarages}</strong></p>
                      <p className="mb-0 small text-muted">Claims Settled: <strong>{item.claimsSettled}</strong></p>
                      <p className="mb-0 small text-muted">{filterType === "Comprehensive" ? "ZERO DEP. CLAIMS" : item.claimType}</p>
                    </Col>
                    <Col md={4} xs={12}>
                      <p className="mb-1 fw-bold text-success">Key Features:</p>
                      <ul className="list-inline mb-0">
                        {item.keyFeatures.map((feature, i) => (
                          <li key={i} className="list-inline-item badge bg-light text-dark border">
                            ✅ {feature}
                          </li>
                        ))}
                      </ul>
                    </Col>
                    <Col md={3} xs={12} className="text-end">
                      <p className="mb-1">Starting From <strong>₹ {item.premiumStartingFrom}</strong></p>
                      <Button variant="danger" onClick={() => handleShowModal(item)} className="btn-custom">
                        Check Prices
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}

            {visibleCount < policies.filter(policy => filterType === 'All' || policy.insuranceTypes?.includes(filterType)).length && (
              <div className="text-center mt-4">
                <Button variant="outline-primary" onClick={handleSeeMore} className="btn-custom">
                  See More Plans ▼
                </Button>
              </div>
            )}
          </div>

          {/* Proposal Form Modal */}
          {selectedPlan && (
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Proposal Form</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-content-custom">
                <Row>
                  <Col md={7} xs={12}>
                    <Form>
                      <Form.Check
                        type="checkbox"
                        label="Is your bike on loan?"
                        name="loan"
                        checked={formData.loan}
                        onChange={handleChange}
                        className="mb-3"
                      />
                      <Form.Group className="mb-3">
                        <Form.Label>Owner’s Full Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!formErrors.name}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {formErrors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          isInvalid={!!formErrors.mobile}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {formErrors.mobile}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!formErrors.email}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {formErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Registration Address</Form.Label>
                        <Form.Control
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          isInvalid={!!formErrors.address}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {formErrors.address}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Registration Number</Form.Label>
                        <Form.Control
                          name="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={handleChange}
                          isInvalid={!!formErrors.registrationNumber}
                          placeholder="e.g., MH12AB1234"
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {formErrors.registrationNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>PAN Number</Form.Label>
                        <Form.Control
                          name="pan"
                          value={formData.pan}
                          onChange={handleChange}
                          isInvalid={!!formErrors.pan}
                          placeholder="e.g., ABCDE1234F"
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {formErrors.pan}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Row>
                        <Col md={6} xs={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                              isInvalid={!!formErrors.dob}
                            />
                            <Form.Control.Feedback type="invalid" className="error-text">
                              {formErrors.dob}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6} xs={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>RTO Pincode</Form.Label>
                            <Form.Control
                              name="rto"
                              value={formData.rto}
                              onChange={handleChange}
                              isInvalid={!!formErrors.rto}
                            />
                            <Form.Control.Feedback type="invalid" className="error-text">
                              {formErrors.rto}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Col>

                  <Col md={5} xs={12}>
                    <div className="p-3 bg-light rounded shadow-sm">
                      <div className="fw-bold mb-2">{selectedPlan.name}</div>
                      <div className="text-muted mb-2">{selectedPlan.claimType}</div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <div>Premium</div>
                        <div>₹{selectedPlan.premiumStartingFrom}</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>GST (18%)</div>
                        <div>₹{(selectedPlan.premiumStartingFrom * 18 / 100).toFixed(2)}</div>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <div>Total Payable</div>
                        <div>₹{(selectedPlan.premiumStartingFrom * 1.18).toFixed(2)}</div>
                      </div>
                      <Button
                        variant="primary"
                        className="mt-3 w-100 btn-custom"
                        onClick={handlePay}
                        disabled={
                          !formData.name ||
                          !formData.email ||
                          !formData.mobile ||
                          !formData.address ||
                          !formData.registrationNumber ||
                          !formData.pan ||
                          !formData.dob ||
                          !formData.rto ||
                          Object.values(formErrors).some(error => error)
                        }
                      >
                        Review & Pay ₹{(selectedPlan.premiumStartingFrom * 1.18).toFixed(2)}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          )}

          {/* Login Required Modal */}
          <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Login Required</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Please log in to proceed with viewing prices and purchasing insurance.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setShowLoginModal(false)} className="btn-custom">
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* No Model Available Modal */}
          <Modal show={showNoModelModal} onHide={() => setShowNoModelModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>No Models Available</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              No bike models are available at this time for the selected brand.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowNoModelModal(false)} className="btn-custom">
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Rating Section */}
          <div className="form-section">
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                  alt="Google Logo"
                  style={{ height: '30px', width: 'auto' }}
                />
                <div>
                  <span className="d-block fw-bold">★★★★★ 4.8 / 5</span>
                  <span className="d-block small text-muted">Read what our customers have to say</span>
                </div>
              </div>
              <Button variant="danger" className="btn-custom">Rate Us</Button>
              <span className="small text-muted mt-2">Rated 4.8 / 5 with over 5775 reviews on Google</span>
              <a href="#" className="small mt-2">See all reviews</a>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Key Features of a Bike Insurance Policy</h2>
            <p className="text-muted mb-3">
              Here are some of the key benefits of having a bike insurance policy:
            </p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong>Legal Compliance:</strong> The Indian Motor Act 1988 makes it mandatory to have at least third-party insurance for every motor vehicle.
              </li>
              <li className="mb-2">
                <strong>Third-Party Liability Coverage:</strong> Covers compensation for damages or injuries caused to a third party by your bike.
              </li>
              <li className="mb-2">
                <strong>Own Damage Protection:</strong> Covers damages to your bike due to accidents, natural calamities, theft, fire, or vandalism.
              </li>
              <li className="mb-2">
                <strong>Personal Accident Cover:</strong> Provides financial support for medical expenses in case of injuries while riding.
              </li>
              <li className="mb-2">
                <strong>Cashless Repairs at Partner Garages:</strong> Allows you to get your bike repaired at network garages without paying upfront.
              </li>
            </ul>
          </div>

          {/* Types of Bike Insurance */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Types of Bike Insurance</h2>
            <p className="text-muted mb-3">
              It is important to choose the right bike insurance policy for yourself.
            </p>
            <Row>
              {[
                {
                  title: "Preferred Comprehensive Bike Insurance",
                  description: "Covers both standalone own damage and third-party bike insurance.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                },
                {
                  title: "Third-Party Bike Insurance",
                  description: "Mandatory as per the Motor Vehicle Act of 1988, covering third-party liabilities.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                },
                {
                  title: "Standalone Own Damage Bike Insurance",
                  description: "Protects your bike from damage due to accidents or natural calamities.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8" cy="7" r="4"/><line x1="16" x2="24" y1="11" y2="11"/></svg>
                }
              ].map((type, idx) => (
                <Col md={4} xs={12} key={idx} className="mb-3">
                  <div className="addon-card">
                    <h3 className="fw-bold text-primary d-flex align-items-center gap-2">
                      {type.icon}
                      {type.title}
                    </h3>
                    <p className="text-muted">{type.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Comparison Table */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Third-Party Vs Comprehensive Vs Standalone Own Damage</h2>
            <p className="text-muted mb-3">
              The difference between a comprehensive and a third-party policy.
            </p>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th>Covers</th>
                    <th>Third-party (Mandatory)</th>
                    <th>Standalone Own Damage</th>
                    <th>Comprehensive (Recommended)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Damage to a third-party vehicle</td>
                    <td>Yes</td>
                    <td>No</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Own damage cover</td>
                    <td>No</td>
                    <td>Yes</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Personal cover</td>
                    <td>Optional Add-on</td>
                    <td>Optional Add-on</td>
                    <td>Optional Add-on</td>
                  </tr>
                  <tr>
                    <td>Cover against natural disasters</td>
                    <td>No</td>
                    <td>Yes</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Cover against theft</td>
                    <td>No</td>
                    <td>Yes</td>
                    <td>Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="small text-muted mt-3">
              Disclaimer: Coverage details may vary between insurers.
            </p>
          </div>

          {/* Add-ons Section */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Bike Insurance Add-ons</h2>
            <p className="text-muted mb-3">
              Add-ons are optional extra benefits which can be added to your policy.
            </p>
            <Row>
              {[
                {
                  title: "Zero Depreciation Cover",
                  description: "Covers the full cost of parts without factoring in depreciation.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 6-6 4 4 8-8"/><polyline points="14 11 14 2 22 2 22 10"/></svg>
                },
                {
                  title: "Engine Protection Cover",
                  description: "Covers engine repairs due to water damage or other perils.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="5" y="5" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/></svg>
                },
                {
                  title: "Return to Invoice Cover",
                  description: "Pays the invoice value of the bike in case of theft or total loss.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/></svg>
                },
                {
                  title: "Roadside Assistance Cover",
                  description: "Provides towing and emergency support in case of breakdowns.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8H6c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1z"/></svg>
                },
                {
                  title: "Key Replacement Cover",
                  description: "Covers the cost of replacing lost or stolen bike keys.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 10.29a3.535 3.535 0 1 1 4.98 4.98l-5.12 5.12-7.071-7.071 5.12-5.12z"/></svg>
                },
                {
                  title: "Consumables Cover",
                  description: "Covers the cost of consumables like oil, nuts, and bolts during repairs.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0-.73 2.73l.08.15a2 2 0 0 1 0 2l-.25.43a2 2 0 0 1-1.73 1H2a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 0 2l-.08.15a2 2 0 0 0-.73 2.73l-.38.22a2 2 0 0 0-2.73.73l-.15-.08a2 2 0 0 1-2 0v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0 .73-2.73l-.08-.15a2 2 0 0 1 0-2l.25-.43a2 2 0 0 1 1.73-1h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.73-1l-.25-.43a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73l.39-.22a2 2 0 0 0 2.73-.73l.15.08a2 2 0 0 1 2 0v-.44a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8v8"/></svg>
                },
                {
                  title: "Personal Accident Cover for Pillion Rider",
                  description: "Covers medical expenses for the pillion rider in case of an accident.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 17v-2a4 4 0 0 0-4-4H15a4 4 0 0 0-4 4v2"/><circle cx="18" cy="7" r="4"/></svg>
                },
              ].map((addon, idx) => (
                <Col md={4} xs={12} key={idx} className="mb-3">
                  <div className="addon-card">
                    <h3 className="fw-bold text-primary d-flex align-items-center gap-2">
                      {addon.icon}
                      {addon.title}
                    </h3>
                    <p className="text-muted">{addon.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Why Choose Section */}
          <div className="form-section">
            <h2 className="fw-bold mb-3 text-center">Why Choose InsuranceDekho?</h2>
            <p className="text-muted mb-3 text-center">
              Understand your options. Identify the best bike insurance price.
            </p>
            <Row>
              {[
                {
                  title: "Bike Insurance in Just 60 Seconds*",
                  description: "Get your bike insurance online in just 60 seconds with our easy process.",
                  img: "https://static.insurancedekho.com/pwa/img/benifitimg1.svg"
                },
                {
                  title: "Over 50 Lakh Happy Customers",
                  description: "InsuranceDekho has won the love and confidence of over 50 Lakh customers.",
                  img: "https://static.insurancedekho.com/pwa/img/benifitimg2.svg"
                },
                {
                  title: "7 Days Dedicated Customer Support",
                  description: "Our support team is available 7 days a week to assist you.",
                  img: "https://static.insurancedekho.com/pwa/img/benifitimg3.svg"
                }
              ].map((benefit, idx) => (
                <Col md={4} xs={12} key={idx} className="mb-3">
                  <div className="text-center addon-card">
                    <img src={benefit.img} alt={benefit.title} style={{ width: '186px', height: '186px' }} />
                    <h3 className="fw-bold mt-3">{benefit.title}</h3>
                    <p className="text-muted">{benefit.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            {[
              {
                question: "What is the validity of a bike insurance policy?",
                answer: "A bike insurance policy typically has a validity of one year for comprehensive and own damage plans. However, third-party bike insurance can be purchased for a longer tenure, such as 3 years, as per the regulations of the Indian Motor Tariff."
              },
              {
                question: "Can I renew my bike insurance online?",
                answer: "Yes, you can easily renew your bike insurance online through InsuranceDekho. Simply select your bike details, choose a plan, and complete the payment process to renew your policy instantly."
              },
              {
                question: "What factors affect my bike insurance premium?",
                answer: "Several factors influence your bike insurance premium, including the bike's make and model, age of the bike, location of registration, type of insurance plan (third-party or comprehensive), add-ons chosen, and your claim history."
              },
              {
                question: "Is third-party bike insurance mandatory in India?",
                answer: "Yes, third-party bike insurance is mandatory in India as per the Motor Vehicles Act, 1988. It covers damages or injuries caused to a third party by your bike and ensures legal compliance."
              },
              {
                question: "What is the benefit of a zero depreciation add-on for bike insurance?",
                answer: "A zero depreciation add-on ensures that you receive the full claim amount for damaged parts without any deduction for depreciation. This is particularly beneficial for expensive bike parts and can save you significant repair costs."
              }
            ].map((faq, index) => (
              <div className="faq-item" key={index}>
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  {faq.question}
                  <span>{openFaq === index ? '▲' : '▼'}</span>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BikePolicy;