import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

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
  .member-counter {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .member-counter button {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #dc3545;
    background-color: #fff;
    color: #dc3545;
    font-size: 16px;
    cursor: pointer;
  }
  .member-counter button:disabled {
    border-color: #ccc;
    color: #ccc;
    cursor: not-allowed;
  }
  .member-counter span {
    font-size: 16px;
    font-weight: bold;
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
    .member-counter button {
      width: 25px;
      height: 25px;
      font-size: 14px;
    }
    .member-counter span {
      font-size: 14px;
    }
  }
`;

const Health = ({ filter }) => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter form states
  const [insuranceForOptions] = useState(["Personal", "Couple", "Family", "Father", "Mother"]);
  const [cities] = useState([
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
    "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna", "Vadodara",
    "Coimbatore", "Surat", "Visakhapatnam", "Agra"
  ]);
  const [coverAmounts] = useState(["3L", "4L", "5L", "10L", "15L", "20L", "30L"]);
  const [selectedInsuranceFor, setSelectedInsuranceFor] = useState("");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [selectedCoverAmount, setSelectedCoverAmount] = useState("");
  const [selectedGender, setSelectedGender] = useState("Female");
  const [members, setMembers] = useState([
    { relationship: "You", count: 1, age: 18 },
    { relationship: "Spouse", count: 0, age: 0 },
    { relationship: "Daughter", count: 0, age: 0 },
    { relationship: "Son", count: 0, age: 0 },
    { relationship: "Father", count: 0, age: 0 },
    { relationship: "Mother", count: 0, age: 0 },
  ]);
  const [knownDiseases, setKnownDiseases] = useState([]);
  const [otherDisease, setOtherDisease] = useState("");
  const [formErrors, setFormErrors] = useState({
    gender: "",
    members: "",
    knownDiseases: "",
    otherDisease: "",
  });

  // Proposal form states with validation
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "example@example.com",
    mobile: "7981234567",
    address: "",
    pan: "ABCDE1234F",
    dob: "",
    policyFor: "",
    relation: "",
    nomineeName: "",
    nomineeRelation: "",
    medicalHistory: "",
    gender: "Female",
    members: [{ relationship: "You", count: 1, age: 18 }],
    knownDiseases: [],
    otherDisease: "",
    id: "682df9444ad839a180d0bc75",
  });
  const [proposalFormErrors, setProposalFormErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    pan: "",
    dob: "",
    policyFor: "",
    relation: "",
    nomineeName: "",
    nomineeRelation: "",
    medicalHistory: "",
    id: "",
  });

  // FAQ state for toggling answers
  const [openFaq, setOpenFaq] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  const lightColors = ["#e3f2fd", "#e8f5e9", "#fff3cd", "#fce4ec"];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch all health insurance providers
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${API_BASE}/api/health/all`;
        if (filter) {
          const query = new URLSearchParams(filter).toString();
          url = `${API_BASE}/api/health/filter?${query}`;
        }
        const response = await axios.get(url);
        const providers = response.data.map((item) => ({ ...item, imageError: false }));
        setData(providers);
      } catch (err) {
        console.error("Error fetching health providers", err);
      }
    };

    fetchData();
  }, [filter]);

  // Handle image error
  const handleImageError = (index) => {
    setData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, imageError: true } : item
      )
    );
    setFilteredData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, imageError: true } : item
      )
    );
  };

  // Validate filter form
  const validateFilterForm = () => {
    const errors = {};
    let isValid = true;

    if (!selectedGender) {
      errors.gender = "Gender is required";
      isValid = false;
    }

    const youMember = members.find(m => m.relationship === "You");
    if (!youMember || youMember.count === 0) {
      errors.members = "You must include yourself in the policy";
      isValid = false;
    } else if (youMember.age < 18) {
      errors.members = "Primary policyholder (You) must be at least 18 years old";
      isValid = false;
    }

    if (knownDiseases.includes("Other") && !otherDisease) {
      errors.otherDisease = "Please specify the other disease";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle filter form submission
  const handleFilterSubmit = async () => {
    if (!validateFilterForm()) return;

    try {
      const query = new URLSearchParams({
        insuranceFor: selectedInsuranceFor,
        coverAmount: selectedCoverAmount,
        gender: selectedGender,
      }).toString();
      const response = await axios.get(`${API_BASE}/api/health/filter?${query}`);
      const filtered = response.data.map((item) => ({ ...item, imageError: false }));
      setFilteredData(filtered);
      setFormSubmitted(true);

      setFormData((prev) => ({
        ...prev,
        gender: selectedGender,
        members: members.filter(member => member.count > 0),
        knownDiseases,
        otherDisease,
      }));
    } catch (err) {
      console.error("Error filtering health providers", err);
    }
  };

  // Handle member count changes
  const handleMemberCountChange = (relationship, delta) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.relationship === relationship
          ? { ...member, count: Math.max(0, member.count + delta) }
          : member
      )
    );
  };

  // Handle member age changes
  const handleMemberAgeChange = (relationship, age) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.relationship === relationship
          ? { ...member, age: parseInt(age) || 0 }
          : member
      )
    );
  };

  // Handle known diseases change
  const handleKnownDiseasesChange = (disease) => {
    if (disease === "No existing disease") {
      setKnownDiseases(["No existing disease"]);
      setOtherDisease("");
    } else {
      setKnownDiseases((prev) => {
        if (prev.includes("No existing disease")) {
          return [disease];
        }
        if (prev.includes(disease)) {
          return prev.filter(d => d !== disease);
        }
        return [...prev, disease];
      });
    }
  };

  // Validate proposal form
  const validateProposalForm = () => {
    const errors = {};
    let isValid = true;

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

    if (!formData.pan) {
      errors.pan = "PAN number is required";
      isValid = false;
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan)) {
      errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
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

    if (!formData.policyFor) {
      errors.policyFor = "Policy For is required";
      isValid = false;
    }

    if (!formData.relation) {
      errors.relation = "Relation is required";
      isValid = false;
    }

    if (!formData.nomineeName) {
      errors.nomineeName = "Nominee Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.nomineeName)) {
      errors.nomineeName = "Nominee Name can only contain letters and spaces";
      isValid = false;
    }

    if (!formData.nomineeRelation) {
      errors.nomineeRelation = "Nominee Relation is required";
      isValid = false;
    }

    if (!formData.id) {
      errors.id = "ID is required";
      isValid = false;
    }

    setProposalFormErrors(errors);
    return isValid;
  };

  // Handle proposal form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProposalFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleCheckPrices = (item) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert("Please log in to proceed with viewing prices and purchasing insurance.");
      window.location.href = '/login';
    } else {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  const handlePay = async () => {
    if (!selectedItem || !validateProposalForm()) return;

    const premium = selectedItem.premiumStartingFrom;
    if (!premium || isNaN(premium)) {
      alert("Premium amount is invalid. Please select a valid plan.");
      return;
    }

    const gst = (premium * 18) / 100;
    const totalAmount = Number((premium + gst).toFixed(2)); // Round to 2 decimal places
    console.log('Total Amount being sent to backend (in rupees):', totalAmount);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?._id || '';
    const healthPolicyId = selectedItem._id;

    try {
      // Step 1: Save the health policy details
      const policyResponse = await axios.post(`${API_BASE}/api/health-policy`, {
        userId,
        healthPolicyId,
        ...formData,
        amount: totalAmount,
      });

      // Step 2: Create a Razorpay order
      const { data: order } = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: totalAmount,
      });

      if (!order || !order.id) {
        throw new Error("Failed to create Razorpay order: Invalid response from server");
      }

      // Step 3: Configure Razorpay options
      const options = {
        key: 'rzp_test_7Hbs0bQhstZUoC',
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Health Insurance Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 4: Save payment details to the Payment collection
            await axios.post(`${API_BASE}/api/payment/save`, {
              policyNumber: healthPolicyId,
              insuredName: formData.name,
              insuranceType: "health",
              paymentAmount: totalAmount,
              paymentDate: new Date(),
              paymentMethod: "upi", // Adjust based on actual method if available
              transactionId: response.razorpay_payment_id,
              userID: userId,
            });
            console.log('Payment Success', response);
            alert('Payment successful! Your policy has been saved.');
            setShowModal(false);
            // Optionally redirect to a confirmation page
            // window.location.href = '/payment-confirmation';
          } catch (error) {
            console.error('Error saving payment:', error);
            alert('Payment successful, but failed to save payment details.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#F37254',
        },
      };

      // Step 5: Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.log('Payment Failed', response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
    } catch (error) {
      console.error('Error during payment process:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'An error occurred while processing the payment. Please try again.';
      alert(errorMessage);
    }
  };

  // FAQ toggle handler
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004038_797ae83ff3.svg",
      title: "Wide range of Plans & Companies",
      description: "(134 Plans and 22 Companies)",
    },
    {
      icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004103_ce3239a13d.svg",
      title: "Free advice to help choose best plan",
      description: "(Guaranteed assistance with guidance)*",
    },
    {
      icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004106_722ee3c5ae.svg",
      title: "24 x 7 Claim Support",
      description: "(We are there for the time of your need to support in claim processing)*",
    },
    {
      icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004106_1_40bbd2161c.svg",
      title: "Flexible payment options",
      description: "(Ability to buy 3 year plan as well as monthly EMI options)",
    },
    {
      icon: "https://staticimg.insurancedekho.com/strapi/Frame_1000004691_60c7672ae7.svg",
      title: "1 lakh+ Families insured/Happy customers",
      description: "(Hear genuine customer’s opinion & their experiences)",
    },
  ];

  const significanceItems = [
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004073_b45536e7a3.svg",
      title: "Financial Security",
      description: "A health insurance policy can free you and your family from the financial burden that comes with a medical emergency, illness or health issues",
    },
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004074_e922d34238.svg",
      title: "Peace of Mind",
      description: "Once you and your loved ones are covered under a health insurance plan, you will have peace of mind and can focus on getting the right treatment stress-free.",
    },
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004075_02d44e54a1.svg",
      title: "Access to Quality Healthcare Services",
      description: "With the rising expenses of medical treatments, a health insurance policy can provide access to better quality healthcare services.",
    },
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004076_9c99b3262b.svg",
      title: "Altering Lifestyle",
      description: "Having health insurance can shield you from diseases that may arise due to an altering lifestyle as with our current lifestyle we are faced with severe illnesses.",
    },
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="insurance-container">
        <header className="sticky-top shadow-sm">
          <Navbar />
        </header>

        <div>
          {/* Introduction Section */}
          <div className="intro-section">
            <h2>Buy Health Insurance Plans and Policies Online</h2>
            <p>
              A health or medical insurance policy covers your medical expenses for
              illnesses and injuries including hospitalisation, daycare procedures,
              ambulance charges, medical care at home, medicine costs, and more. It
              protects the individuals and families from financial burden arising from
              unexpected medical expenses. Additionally, it helps you save taxes under
              section 80D of the Income Tax Act, 1961.
            </p>
          </div>

          {/* Filter Form */}
          <div className="form-section">
            <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
              Find the Best Health Insurance Plan
            </h3>
            <div className="form-card">
              <div className="mb-3">
                <label className="form-label">Who do you want to insure?</label>
                <div className="d-flex flex-wrap gap-2">
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select
                      value={selectedInsuranceFor}
                      onChange={(e) => setSelectedInsuranceFor(e.target.value)}
                    >
                      <option value="">Select Option</option>
                      {insuranceForOptions.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">City</label>
                <div className="d-flex flex-wrap gap-2">
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedInsuranceFor}
                    >
                      <option value="">Select City</option>
                      {cities.map((city, idx) => (
                        <option key={idx} value={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Cover Amount</label>
                <div className="flex-fill" style={{ maxWidth: '200px' }}>
                  <Form.Select
                    value={selectedCoverAmount}
                    onChange={(e) => setSelectedCoverAmount(e.target.value)}
                    disabled={!selectedCity}
                  >
                    <option value="">Select Amount</option>
                    {coverAmounts.map((amount, idx) => (
                      <option key={idx} value={amount}>{amount}</option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <div className="flex-fill" style={{ maxWidth: '200px' }}>
                  <Form.Select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    isInvalid={!!formErrors.gender}
                  >
                    <option value="">Select Gender</option>
                    {["Male", "Female", "Other"].map((gender, idx) => (
                      <option key={idx} value={gender}>{gender}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="error-text">
                    {formErrors.gender}
                  </Form.Control.Feedback>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Add Members</label>
                {members.map((member, idx) => (
                  <div key={idx} className="mb-2">
                    <Row className="align-items-center">
                      <Col xs={4}>
                        <span>{member.relationship}</span>
                      </Col>
                      <Col xs={4}>
                        <div className="member-counter">
                          <Button
                            variant="outline-danger"
                            onClick={() => handleMemberCountChange(member.relationship, -1)}
                            disabled={member.relationship === "You" && member.count === 1}
                          >
                            -
                          </Button>
                          <span>{member.count}</span>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleMemberCountChange(member.relationship, 1)}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col xs={4}>
                        {member.count > 0 && (
                          <Form.Control
                            type="number"
                            placeholder="Age"
                            value={member.age || ""}
                            onChange={(e) => handleMemberAgeChange(member.relationship, e.target.value)}
                            min={member.relationship === "You" ? 18 : 0}
                          />
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}
                {selectedInsuranceFor !== "Father" && selectedInsuranceFor !== "Mother" && (
                  <p className="text-muted small mt-2">
                    Note: Parents' policy has to be selected separately by choosing "Father" or "Mother" in "Who do you want to insure?".
                  </p>
                )}
                {formErrors.members && (
                  <div className="error-text">{formErrors.members}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Does any selected member have a known disease?</label>
                <div className="d-flex flex-wrap gap-2">
                  {["No existing disease", "Diabetes", "BP/Hypertension", "Heart Disease", "Asthma", "Thyroid Disorder", "Other"].map((disease, idx) => (
                    <Form.Check
                      key={idx}
                      type="checkbox"
                      label={disease}
                      checked={knownDiseases.includes(disease)}
                      onChange={() => handleKnownDiseasesChange(disease)}
                    />
                  ))}
                </div>
                {knownDiseases.includes("Other") && (
                  <Form.Control
                    className="mt-2"
                    placeholder="Specify other disease"
                    value={otherDisease}
                    onChange={(e) => setOtherDisease(e.target.value)}
                    isInvalid={!!formErrors.otherDisease}
                  />
                )}
                <Form.Control.Feedback type="invalid" className="error-text">
                  {formErrors.otherDisease}
                </Form.Control.Feedback>
              </div>

              <Button
                variant="danger"
                onClick={handleFilterSubmit}
                disabled={
                  !selectedInsuranceFor ||
                  !selectedCity ||
                  !selectedCoverAmount ||
                  !selectedGender ||
                  Object.values(formErrors).some(error => error)
                }
                className="btn-custom"
              >
                Find Plans
              </Button>
              <p className="text-muted small mt-2">
                Disclaimer: Actual premium might vary based on your location, age, and other factors.
              </p>
            </div>

            {formSubmitted && filteredData.length > 0 && (
              <div className="mt-4">
                <h4 className="fw-bold mb-3">Filtered Health Insurance Plans</h4>
                {filteredData.map((item, idx) => (
                  <div className="policy-card" key={idx}>
                    <Row className="align-items-center">
                      <Col md={2} xs={12} className="text-center">
                        {!item.imageError ? (
                          <img
                            src={item.logoUrl}
                            onError={() => handleImageError(idx)}
                            className="img-fluid"
                            style={{ maxHeight: "50px" }}
                            alt={item.name}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: lightColors[idx % lightColors.length],
                              color: "#333",
                              fontSize: "20px",
                              margin: "0 auto",
                            }}
                          >
                            <i className="bi bi-heart-pulse-fill"></i>
                          </div>
                        )}
                      </Col>
                      <Col md={3} xs={12}>
                        <h6 className="fw-bold">{item.name}</h6>
                        <p className="mb-0 small text-muted">
                          Claim Type: <strong>{item.claimType}</strong>
                        </p>
                        <p className="mb-0 small text-muted">
                          Cover Amount: <strong>{item.coverAmount}</strong>
                        </p>
                      </Col>
                      <Col md={4} xs={12}>
                        <p className="mb-1 fw-bold text-success">Key Features:</p>
                        <ul className="list-inline mb-0">
                          {item.keyFeatures?.map((feature, i) => (
                            <li key={i} className="list-inline-item badge bg-light text-dark border">
                              ✅ {feature}
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col md={3} xs={12} className="text-end">
                        <p className="mb-1">
                          Starting From <strong>₹ {item.premiumStartingFrom}</strong>
                        </p>
                        <Button variant="danger" onClick={() => handleCheckPrices(item)} className="btn-custom">
                          Check Prices
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            )}
            {formSubmitted && filteredData.length === 0 && (
              <Alert variant="warning" className="mt-4">
                No health insurance plans found for the selected criteria.
              </Alert>
            )}
          </div>

          {/* Top Plans Section */}
          <div className="form-section">
            <h3 className="fw-bold mb-3">Top Health Insurance Plans</h3>
            {data.slice(0, visibleCount).map((item, idx) => (
              <div className="policy-card" key={idx}>
                <Row className="align-items-center">
                  <Col md={2} xs={12} className="text-center">
                    {!item.imageError ? (
                      <img
                        src={item.logoUrl}
                        onError={() => handleImageError(idx)}
                        className="img-fluid"
                        style={{ maxHeight: "50px" }}
                        alt={item.name}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: lightColors[idx % lightColors.length],
                          color: "#333",
                          fontSize: "20px",
                          margin: "0 auto",
                        }}
                      >
                        <i className="bi bi-heart-pulse-fill"></i>
                      </div>
                    )}
                  </Col>
                  <Col md={3} xs={12}>
                    <h6 className="fw-bold">{item.name}</h6>
                    <p className="mb-0 small text-muted">
                      Claim Type: <strong>{item.claimType}</strong>
                    </p>
                    <p className="mb-0 small text-muted">
                      Cover Amount: <strong>{item.coverAmount}</strong>
                    </p>
                  </Col>
                  <Col md={4} xs={12}>
                    <p className="mb-1 fw-bold text-success">Key Features:</p>
                    <ul className="list-inline mb-0">
                      {item.keyFeatures?.map((feature, i) => (
                        <li key={i} className="list-inline-item badge bg-light text-dark border">
                          ✅ {feature}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={3} xs={12} className="text-end">
                    <p className="mb-1">
                      Starting From <strong>₹ {item.premiumStartingFrom}</strong>
                    </p>
                    <Button variant="danger" onClick={() => handleCheckPrices(item)} className="btn-custom">
                      Check Prices
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}

            {visibleCount < data.length && (
              <div className="text-center mt-4">
                <Button
                  variant="outline-primary"
                  onClick={() => setVisibleCount(visibleCount + 5)}
                  className="btn-custom"
                >
                  See More Plans ▼
                </Button>
              </div>
            )}
          </div>

          {/* Proposal Form Modal */}
          {selectedItem && (
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>{selectedItem.name} - Proposal Form</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-content-custom">
                <Row>
                  <Col md={7} xs={12}>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Policyholder’s Full Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!proposalFormErrors.name}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          value={formData.email}
                          disabled
                          isInvalid={!!proposalFormErrors.email}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          name="mobile"
                          value={formData.mobile}
                          disabled
                          isInvalid={!!proposalFormErrors.mobile}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.mobile}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>PAN Number</Form.Label>
                        <Form.Control
                          name="pan"
                          value={formData.pan}
                          disabled
                          isInvalid={!!proposalFormErrors.pan}
                          placeholder="e.g., ABCDE1234F"
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.pan}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                          name="id"
                          value={formData.id}
                          disabled
                          isInvalid={!!proposalFormErrors.id}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.id}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          isInvalid={!!proposalFormErrors.address}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.address}
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
                              isInvalid={!!proposalFormErrors.dob}
                            />
                            <Form.Control.Feedback type="invalid" className="error-text">
                              {proposalFormErrors.dob}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6} xs={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Policy For</Form.Label>
                            <Form.Select
                              name="policyFor"
                              value={formData.policyFor}
                              onChange={handleChange}
                              isInvalid={!!proposalFormErrors.policyFor}
                            >
                              <option value="">Select Option</option>
                              {["Self", "Spouse", "Child", "Parent"].map((option, idx) => (
                                <option key={idx} value={option}>{option}</option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid" className="error-text">
                              {proposalFormErrors.policyFor}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Relation to Policyholder</Form.Label>
                        <Form.Select
                          name="relation"
                          value={formData.relation}
                          onChange={handleChange}
                          isInvalid={!!proposalFormErrors.relation}
                        >
                          <option value="">Select Relation</option>
                          {["Self", "Spouse", "Child", "Parent", "Sibling"].map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.relation}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Nominee Name</Form.Label>
                        <Form.Control
                          name="nomineeName"
                          value={formData.nomineeName}
                          onChange={handleChange}
                          isInvalid={!!proposalFormErrors.nomineeName}
                        />
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.nomineeName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Nominee Relation</Form.Label>
                        <Form.Select
                          name="nomineeRelation"
                          value={formData.nomineeRelation}
                          onChange={handleChange}
                          isInvalid={!!proposalFormErrors.nomineeRelation}
                        >
                          <option value="">Select Relation</option>
                          {["Spouse", "Child", "Parent", "Sibling", "Other"].map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid" className="error-text">
                          {proposalFormErrors.nomineeRelation}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Pre-existing Medical Conditions (if any)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={handleChange}
                          placeholder="e.g., Diabetes, Hypertension"
                        />
                      </Form.Group>
                    </Form>
                  </Col>

                  <Col md={5} xs={12}>
                    <div className="p-3 bg-light rounded shadow-sm">
                      <div className="fw-bold mb-2">{selectedItem.name}</div>
                      <div className="text-muted mb-2">{selectedItem.claimType}</div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <div>Premium</div>
                        <div>₹{selectedItem.premiumStartingFrom}</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>GST (18%)</div>
                        <div>₹{(selectedItem.premiumStartingFrom * 18 / 100).toFixed(2)}</div>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <div>Total Payable</div>
                        <div>₹{Number((selectedItem.premiumStartingFrom * 1.18).toFixed(2))}</div>
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
                          !formData.pan ||
                          !formData.dob ||
                          !formData.policyFor ||
                          !formData.relation ||
                          !formData.nomineeName ||
                          !formData.nomineeRelation ||
                          !formData.id ||
                          Object.values(proposalFormErrors).some(error => error)
                        }
                      >
                        Review & Pay ₹{Number((selectedItem.premiumStartingFrom * 1.18).toFixed(2))}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          )}

          {/* Key Highlights Section */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Key Highlights of Health Insurance</h2>
            <Row className="g-4">
              {features.map((feature, idx) => (
                <Col md={6} xs={12} key={idx}>
                  <div className="d-flex align-items-start bg-light rounded p-3 h-100 shadow-sm">
                    <img src={feature.icon} alt={feature.title} width={48} height={48} className="me-3" />
                    <div>
                      <p className="fw-bold mb-1">{feature.title}</p>
                      <p className="text-muted mb-0">{feature.description}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Significance Section */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Significance of Having a Health Insurance Policy</h2>
            <p className="text-muted mb-4">
              Following are some significant benefits of a comprehensive health insurance plan:
            </p>
            <Row className="g-4">
              {significanceItems.map((item, idx) => (
                <Col md={6} xs={12} key={idx}>
                  <div className="d-flex align-items-start bg-white shadow-sm p-3 h-100 rounded border">
                    <img src={item.img} alt={item.title} width={48} height={48} className="me-3" />
                    <div>
                      <p className="fw-semibold mb-1">{item.title}</p>
                      <p className="text-muted mb-0">{item.description}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Types of Health Insurance */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Types of Health Insurance</h2>
            <p className="text-muted mb-3">
              Choose the right health insurance policy for your needs.
            </p>
            <Row>
              {[
                {
                  title: "Individual Health Insurance",
                  description: "Covers medical expenses for a single person, offering personalized protection.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                },
                {
                  title: "Family Floater Plan",
                  description: "Covers the entire family under a single policy with a shared sum insured.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 17v-2a4 4 0 0 0-4-4H15a4 4 0 0 0-4 4v2"/><circle cx="18" cy="7" r="4"/></svg>
                },
                {
                  title: "Senior Citizen Plan",
                  description: "Designed for individuals above 60, covering age-related health issues.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>
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
            <h2 className="fw-bold mb-3">Individual vs Family Floater vs Senior Citizen Plans</h2>
            <p className="text-muted mb-3">
              Understand the differences between various health insurance plans.
            </p>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th>Covers</th>
                    <th>Individual Plan</th>
                    <th>Family Floater Plan</th>
                    <th>Senior Citizen Plan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Number of People Covered</td>
                    <td>One person</td>
                    <td>Entire family</td>
                    <td>One senior citizen</td>
                  </tr>
                  <tr>
                    <td>Hospitalization Expenses</td>
                    <td>Yes</td>
                    <td>Yes</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Pre-existing Disease Cover</td>
                    <td>Yes (after waiting period)</td>
                    <td>Yes (after waiting period)</td>
                    <td>Yes (shorter waiting period)</td>
                  </tr>
                  <tr>
                    <td>Age Eligibility</td>
                    <td>18-65 years</td>
                    <td>All ages (family members)</td>
                    <td>60+ years</td>
                  </tr>
                  <tr>
                    <td>Critical Illness Add-on</td>
                    <td>Optional</td>
                    <td>Optional</td>
                    <td>Optional</td>
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
            <h2 className="fw-bold mb-3">Health Insurance Add-ons</h2>
            <p className="text-muted mb-3">
              Enhance your policy with these optional add-ons for extra protection.
            </p>
            <Row>
              {[
                {
                  title: "Critical Illness Cover",
                  description: "Covers major illnesses like cancer, heart attack, and stroke.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6m0 8v6m-6-6h6m6 0h-6"/></svg>
                },
                {
                  title: "Maternity Cover",
                  description: "Covers expenses related to childbirth and newborn care.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6m-4 4h8m-8 4h8"/></svg>
                },
                {
                  title: "OPD Cover",
                  description: "Covers outpatient department expenses like doctor consultations.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6m-4 4h8"/></svg>
                },
                {
                  title: "Personal Accident Cover",
                  description: "Provides coverage for accidental injuries or death.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6m-4 4h8m-8 4h8"/></svg>
                },
              ].map((addon, idx) => (
                <Col md={3} xs={12} key={idx} className="mb-3">
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

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            {[
              {
                question: "What is the waiting period for pre-existing diseases in health insurance?",
                answer: "The waiting period for pre-existing diseases typically ranges from 1 to 4 years, depending on the insurer and the policy. Some plans offer reduced waiting periods for senior citizens or with specific add-ons."
              },
              {
                question: "Can I include my parents in a family floater plan?",
                answer: "Yes, most family floater plans allow you to include your parents. However, the premium may increase based on their age and health conditions."
              },
              {
                question: "What is a no-claim bonus in health insurance?",
                answer: "A no-claim bonus (NCB) is a reward for not making any claims in a policy year. It can increase your sum insured or provide a premium discount for the next year, depending on the insurer."
              },
              {
                question: "Is maternity cover included in all health insurance plans?",
                answer: "No, maternity cover is usually an optional add-on and not included in standard health insurance plans. It often comes with a waiting period of 9 months to 2 years."
              },
              {
                question: "Can I claim tax benefits on health insurance premiums?",
                answer: "Yes, under Section 80D of the Income Tax Act, 1961, you can claim tax deductions on health insurance premiums up to ₹25,000 for self, spouse, and children, and an additional ₹25,000 for parents (₹50,000 if they are senior citizens)."
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

export default Health;