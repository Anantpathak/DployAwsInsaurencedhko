import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
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
  }
`;

const Car = () => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filterType, setFilterType] = useState("Comprehensive");
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Form states
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [showNoModelModal, setShowNoModelModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fetch user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const initialName = storedUser.name || '';
  const initialEmail = storedUser.email || '';
  const initialMobile = storedUser.phoneNumber || '7981234567';
  const initialPan = storedUser.pan || '';

  // Proposal form states with validation
  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    mobile: initialMobile,
    pan: initialPan,
    dob: '',
    rto: '',
    registrationNumber: '',
    address: '',
    loan: false
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    pan: '',
    dob: '',
    rto: '',
    registrationNumber: '',
    address: ''
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [existingPolicies, setExistingPolicies] = useState([]); // State to store existing policies

  const API_BASE = process.env.REACT_APP_API_URL;

  // Fetch existing policies for the user
  useEffect(() => {
    const fetchExistingPolicies = async () => {
      const storedUserForId = JSON.parse(localStorage.getItem('user'));
      const userId = storedUserForId?._id || '';
      if (userId) {
        try {
          const response = await axios.get(`${API_BASE}/api/car-owner/user/${userId}`);
          setExistingPolicies(response.data);
        } catch (err) {
          console.error("Error fetching existing policies:", err);
        }
      }
    };
    fetchExistingPolicies();
  }, []);

  // Fetch car brands
  useEffect(() => {
    axios.get(`${API_BASE}/api/insurance-provider/all`)
      .then((res) => {
        const uniqueBrands = [...new Set(res.data.map(item => item.carBrand))];
        setCarBrands(uniqueBrands);
      })
      .catch((err) => console.error("Error fetching car brands:", err));
  }, []);

  // Fetch car models
  useEffect(() => {
    if (selectedBrand) {
      axios.get(`${API_BASE}/api/insurance-provider/car-details?carBrand=${selectedBrand}`)
        .then((res) => {
          const uniqueModels = [...new Set(res.data.map(item => item.carBrandModel))];
          if (uniqueModels.length === 0) {
            setShowNoModelModal(true);
            setCarModels([]);
            setSelectedModel("");
          } else {
            setCarModels(uniqueModels);
            setShowNoModelModal(false);
          }
          setCarTypes([]);
          setCities([]);
          setYears([]);
          setSelectedModel("");
          setSelectedType("");
          setSelectedCity("");
          setSelectedYear("");
          setFilteredPolicies([]);
          setFormSubmitted(false);
        })
        .catch((err) => console.error("Error fetching car models:", err));
    }
  }, [selectedBrand]);

  // Fetch car types
  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`${API_BASE}/api/insurance-provider/car-details?carBrand=${selectedBrand}&carBrandModel=${selectedModel}`)
        .then((res) => {
          const uniqueTypes = [...new Set(res.data.map(item => item.typeOfCar))];
          setCarTypes(uniqueTypes);
          setCities([]);
          setYears([]);
          setSelectedType("");
          setSelectedCity("");
          setSelectedYear("");
          setFilteredPolicies([]);
          setFormSubmitted(false);
        })
        .catch((err) => console.error("Error fetching car types:", err));
    }
  }, [selectedBrand, selectedModel]);

  // Fetch cities
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedType) {
      axios.get(`${API_BASE}/api/insurance-provider/car-details?carBrand=${selectedBrand}&carBrandModel=${selectedModel}&typeOfCar=${selectedType}`)
        .then((res) => {
          const uniqueCities = [...new Set(res.data.map(item => item.cityCarRegistered))];
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
      axios.get(`${API_BASE}/api/insurance-provider/car-details?carBrand=${selectedBrand}&carBrandModel=${selectedModel}&typeOfCar=${selectedType}&cityCarRegistered=${selectedCity}`)
        .then((res) => {
          const uniqueYears = [...new Set(res.data.map(item => item.carBuyedYear))];
          setYears(uniqueYears);
          setSelectedYear("");
          setFilteredPolicies([]);
          setFormSubmitted(false);
        })
        .catch((err) => console.error("Error fetching years:", err));
    }
  }, [selectedBrand, selectedModel, selectedType, selectedCity]);

  // Fetch filtered policies
  const handleCalculatePrice = () => {
    if (selectedBrand && selectedModel && selectedType && selectedCity && selectedYear) {
      axios.get(`${API_BASE}/api/insurance-provider/car-details?carBrand=${selectedBrand}&carBrandModel=${selectedModel}&typeOfCar=${selectedType}&cityCarRegistered=${selectedCity}&carBuyedYear=${selectedYear}`)
        .then((res) => {
          setFilteredPolicies(res.data);
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

    // Registration Number validation (e.g., XX12XX1234)
    if (!formData.registrationNumber) {
      errors.registrationNumber = "Registration Number is required";
      isValid = false;
    } else if (!/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(formData.registrationNumber)) {
      errors.registrationNumber = "Invalid format (e.g., MH12AB1234)";
      isValid = false;
    }

    // Address validation
    if (!formData.address) {
      errors.address = "Registration Address is required";
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

  // Check user in localStorage and show appropriate modal
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
      name: initialName,
      email: initialEmail,
      mobile: initialMobile,
      pan: initialPan,
      dob: '',
      rto: '',
      registrationNumber: '',
      address: '',
      loan: false
    });
  };

  const storedUserForId = JSON.parse(localStorage.getItem('user'));
  const userId = storedUserForId?._id || '';

  const handlePay = async () => {
    if (!selectedPlan || !validateForm()) return;

    const premium = selectedPlan.premiumStartingFrom;
    const gst = (premium * 18) / 100;
    const totalAmount = premium + gst;

    try {
      const { data: order } = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: totalAmount
      });

      const payload = {
        ...formData,
        userId,
        amount: totalAmount,
        policyId: selectedPlan._id
      };

      await axios.post(`${API_BASE}/api/car-owner`, payload);

      const options = {
        key: 'rzp_test_7Hbs0bQhstZUoC',
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Insurance Payment',
        order_id: order.id,
        handler: function (response) {
          console.log('Payment Success', response);
          handleClose();
          // Refresh existing policies after successful payment
          const fetchExistingPolicies = async () => {
            try {
              const response = await axios.get(`${API_BASE}/api/car-owner/user/${userId}`);
              setExistingPolicies(response.data);
            } catch (err) {
              console.error("Error fetching existing policies:", err);
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

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Fetch initial policies
  useEffect(() => {
    axios.get(`${API_BASE}/api/insurance-provider/filter?type=${filterType}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [filterType]);

  const faqData = [
    {
      question: 'What is a car insurance policy?',
      answer: 'It is an agreement between an insurance company and a car owner under which the former provides an insurance cover to the policyholder for financial damages incurred by his/her car in unforeseen events. Depending on the coverage, there are three types of car insurance plans - third party, standalone own-damage, and comprehensive insurance. Its renewal online process provides instant e-Policy.',
    },
    {
      question: 'Why should I buy car insurance?',
      answer: 'There are a number of benefits of owning four wheeler insurance. Firstly, it helps you meet the legal requirement of owning at least a third party cover. Moreover, an insurance policy helps you meet financial liabilities that may arise towards a third party or own damages to your car due to a road accident or any other unfortunate event.',
    },
    {
      question: 'Is car insurance mandatory in India?',
      answer: 'Yes, as per the Motor Vehicles Act, 1988, it is mandatory to have at least a third party car insurance to drive legally on Indian roads. Driving without a valid car insurance policy is a punishable offence, and you may have to pay a fine of ₹2,000 and/or face imprisonment for up to 3 months.',
    },
    {
      question: 'How is car insurance premium calculated?',
      answer: 'Car insurance premium is calculated based on several factors, including the car\'s make and model, age, engine capacity, Insured Declared Value (IDV), geographical location, No Claim Bonus (NCB), and any add-on covers selected. The insurer assesses the risk associated with the vehicle and the driver to determine the premium amount.',
    },
    {
      question: 'Can car insurance be transferred to the new owner at the purchase of a second hand four wheeler?',
      answer: 'Yes, car insurance can be transferred to the new owner. The new owner must apply for the transfer of the car insurance policy within 14 days of the car\'s purchase. The new owner will also have to submit a copy of the Registration Certificate (RC) book, No Objection Certificate (NOC) from the previous owner, and other relevant documents to the insurance company.',
    },
  ];

  const addons = [
    {
      title: "Zero Depreciation Cover",
      description: "This is one of the most purchased and useful add-ons. With this add-on, the depreciation factor is out of the policy and the parts are considered to hold their original value irrespective of the age of the car.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><path d="m3 17 6-6 4 4 8-8"/><polyline points="14 11 14 2 22 2 22 10"/></svg>
    },
    {
      title: "Engine Protection Cover",
      description: "This add-on covers the repair or replacement of your car's engine due to damage from accidents, water ingression, or other specified perils. It provides financial security against hefty engine repair costs.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu"><rect width="14" height="14" x="5" y="5" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M9.4 9.4 7.6 7.6"/><path d="M16.4 7.6 14.6 9.4"/><path d="M14.6 14.6 16.4 16.4"/><path d="M7.6 16.4 9.4 14.6"/></svg>
    },
    {
      title: "Return to Invoice Cover",
      description: "Return to Invoice or invoice covers both ex-showroom + RTO tax of your vehicle in case of theft / loss of your car hence compensating you fully.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt-text"><path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><polyline points="4 17 4 21 12 21 12 17"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 6h8"/></svg>
    },
    {
      title: "Roadside Assistance Cover",
      description: "Roadside Assistance is another very popular add-on. It provides towing assistance in case your car is no longer in drivable condition. It also provides support in case of a flat tyre, dead battery, or fuel shortage.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car"><path d="M18 8H6c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1z"/><path d="M13 12v-2h-2v2H8l-2 2v3c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-3l-2-2z"/></svg>
    },
    {
      title: "Key Replacement Cover",
      description: "This add-on covers the cost of replacing your car keys if they are lost, stolen, or damaged. Modern car keys can be expensive to replace, making this a valuable add-on.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M10.29 10.29a3.535 3.535 0 1 1 4.98 4.98l-5.12 5.12-7.071-7.071 5.12-5.12z"/><path d="M10 11v-1H8v-2H6v-1H4v-2H2v-2h2v-1h2v2h2v1h2v2h2v1h2v2h-2v1H8v-2z"/></svg>
    },
    {
      title: "Tyre Protection Cover",
      description: "Protects against damage to tyres and tubes, including punctures, bursts, and cuts, which are not always covered under a standard policy. May include replacement costs.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
    },
    {
      title: "Consumables Cover",
      description: "Covers the cost of consumable items like engine oil, nuts, bolts, screws, grease, and other small parts that are typically not covered in a standard claim. These can add up in repair costs.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0-.73 2.73l.08.15a2 2 0 0 1 0 2l-.25.43a2 2 0 0 1-1.73 1H2a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 0 2l-.08.15a2 2 0 0 0-.73 2.73l-.38.22a2 2 0 0 0-2.73.73l-.15-.08a2 2 0 0 1-2 0v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0 .73-2.73l-.08-.15a2 2 0 0 1 0-2l.25-.43a2 2 0 0 1 1.73-1h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.73-1l-.25-.43a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73l.39-.22a2 2 0 0 0 2.73-.73l.15.08a2 2 0 0 1 2 0v-.44a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8v8"/></svg>
    },
    {
      title: "Loss of Personal Belongings",
      description: "Compensates for the loss of personal items from your car in case of theft or accident. Coverage limits and eligible items vary by insurer.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M7 12v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4"/></svg>
    },
    {
      title: "Daily Allowance Benefit",
      description: "Provides a daily allowance for transportation costs when your car is in the garage for repairs following an accident. Helps cover expenses while you're without your vehicle.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M12 20h.01M8 2v4"/><path d="M16 2v4"/><path d="M8 18H6a2 2 0 0 1-2-2v-5h16v5a2 2 0 0 1-2 2h-2"/><path d="M16 6H8a2 2 0 0 0-2 2v3h8V8a2 2 0 0 0-2-2z"/></svg>
    },
    {
      title: "NCB Protection",
      description: "Protects your No Claim Bonus (NCB) from being reduced even if you make a claim during the policy period. This helps you retain your accumulated NCB discount.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><path d="M9 17v-4c0-1.333-.8-4-3-4"/><path d="M15 17v-4c0-1.333.8-4 3-4"/><path d="M12 12h1"/><path d="M8 2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M9 17v-4c0-1.333-.8-4-3-4"/><path d="M15 17v-4c0-1.333.8-4 3-4"/></svg>
    },
    {
      title: "Personal Accident Cover for Unnamed Passengers",
      description: "Extends personal accident coverage to unnamed passengers in your car in case of an accident. A standard policy typically covers only the owner-driver.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 939" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M15 18v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 17v-2a4 4 0 0 0-4-4H15a4 4 0 0 0-4 4v2"/><circle cx="18" cy="7" r="4"/></svg>
    },
    {
      title: "EMI Protection",
      description: "Helps pay your car loan EMIs if your car is damaged in an accident and you are unable to use it. Provides financial relief during the repair period.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote"><rect width="22" height="12" x="1" y="6" rx="2" ry="2"/><path d="M7 10h10"/><path d="M15 14H9"/><path d="M8 6v12"/></svg>
    },
    {
      title: "Gap Value Cover",
      description: "Covers the difference between the insured declared value (IDV) of your car and the outstanding loan amount in case of total loss or theft. Useful for new cars with a large loan.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><path d="m3 17 6-6 4 4 8-8"/><polyline points="14 11 14 2 22 2 22 10"/></svg>
    },
  ];

  return (
    <>
      {/* Inject custom styles */}
      <style>{styles}</style>

      <div className="insurance-container">
        <header className="sticky-top shadow-sm">
          <Navbar />
        </header>

        <div>
          {/* Calculate Price Form */}
          <div className="form-section">
            <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
              Calculate Your Car Insurance Price Online
            </h3>
            <div className="form-card">
              <div className="mb-3">
                <label className="form-label">Which car variant do you drive?</label>
                <div className="d-flex flex-wrap gap-2">
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                      <option value="">Car Brand</option>
                      {carBrands.map((brand, idx) => (
                        <option key={idx} value={brand}>{brand}</option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
                      <option value="">Model</option>
                      {carModels.map((model, idx) => (
                        <option key={idx} value={model}>{model}</option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="flex-fill" style={{ minWidth: '150px' }}>
                    <Form.Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} disabled={!selectedModel}>
                      <option value="">Fuel</option>
                      {carTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                  {carTypes.map((type, idx) => (
                    <Button key={idx} variant={selectedType === type ? "success" : "outline-secondary"} onClick={() => setSelectedType(type)} disabled={!selectedModel}>
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Which city is your car registered in?</label>
                <div className="d-flex flex-wrap gap-2">
                  {cities.map((city, idx) => (
                    <Button key={idx} variant={selectedCity === city ? "success" : "outline-secondary"} onClick={() => setSelectedCity(city)} disabled={!selectedType}>
                      {city}
                    </Button>
                  ))}
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
                <label className="form-label">When did you buy your car?</label>
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
                Disclaimer: Actual premium might vary basis your location, age, and number of members.
              </p>
            </div>

            {formSubmitted && filteredPolicies.length > 0 && (
              <div className="mt-4">
                <h4 className="fw-bold mb-3">Filtered Insurance Plans</h4>
                {filteredPolicies.map((item, idx) => (
                  <div className="policy-card" key={idx}>
                    <Row className="align-items-center">
                      <Col md={2} xs={12} className="text-center">
                        <img src={item.logoUrl} className="img-fluid" style={{ maxHeight: "50px" }} alt={item.name} />
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
            <h3 className="fw-bold mb-3">Top Car Insurance Plans</h3>
            <ul className="nav nav-tabs mb-4">
              {["Comprehensive", "Third Party", "Own Damage"].map((type) => (
                <li className="nav-item" key={type}>
                  <button
                    className={`nav-link ${filterType === type ? "active" : ""}`}
                    onClick={() => {
                      setFilterType(type);
                      setVisibleCount(5);
                    }}
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>

            {data.slice(0, visibleCount).map((item, idx) => (
              <div className="policy-card" key={idx}>
                <Row className="align-items-center">
                  <Col md={2} xs={12} className="text-center">
                    <img src={item.logoUrl} className="img-fluid" style={{ maxHeight: "50px" }} alt={item.name} />
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

            {visibleCount < data.length && (
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
                        label="Is your car on loan?"
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
                          readOnly
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
                          readOnly
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
                          readOnly
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
                          readOnly
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
                          !formData.pan ||
                          !formData.dob ||
                          !formData.rto ||
                          !formData.registrationNumber ||
                          !formData.address ||
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
              <Button variant="secondary" onClick={() => setShowLoginModal(false)} className="btn-custom">
                Close
              </Button>
              <Button variant="primary" onClick={() => window.location.href = '/login'} className="btn-custom">
                Login
              </Button>
            </Modal.Footer>
          </Modal>

          {/* No Model Available Modal */}
          <Modal show={showNoModelModal} onHide={() => setShowNoModelModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>No Models Available</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              No brand model is available at this time for the selected car brand.
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
            <h2 className="fw-bold mb-3">Key Features of a Car Insurance Policy</h2>
            <p className="text-muted mb-3">
              Here are some of the key benefits of having a car insurance policy:
            </p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong>Financial Protection Against Damages:</strong> Covers repair and replacement costs when your car is damaged due to accidents, theft, fire, vandalism, or natural calamities.
              </li>
              <li className="mb-2">
                <strong>Third-Party Liability Coverage:</strong> Protects you from financial and legal obligations if your car injures someone or damages their property.
              </li>
              <li className="mb-2">
                <strong>Personal Accident Cover:</strong> Provides financial support if the owner-driver faces injury, disability, or death due to an accident.
              </li>
              <li className="mb-2">
                <strong>No Claim Bonus (NCB):</strong> Helps reduce your cost of renewal for having no claims made during the policy term.
              </li>
              <li className="mb-2">
                <strong>Cashless Repairs at Partner Garages:</strong> Allows you to get your car repaired at network garages without paying upfront.
              </li>
            </ul>
          </div>

          {/* Types of Car Insurance */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">Types of Car Insurance</h2>
            <p className="text-muted mb-3">
              It is important to choose the right car insurance policy for yourself.
            </p>
            <Row>
              {[
                {
                  title: "Preferred Comprehensive Car Insurance",
                  description: "Covers both standalone own damage and third-party car insurance.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                },
                {
                  title: "Third-Party Car Insurance",
                  description: "Mandatory as per the Motor Vehicle Act of 1988, covering third-party liabilities.",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                },
                {
                  title: "Standalone Own Damage Car Insurance",
                  description: "Protects your car from damage due to accidents or natural calamities.",
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
                    <td>Cover against riots and terrorism</td>
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
            <h2 className="fw-bold mb-3">Car Insurance Add-ons</h2>
            <p className="text-muted mb-3">
              Add-ons are optional extra benefits which can be added to your policy.
            </p>
            <Row>
              {addons.map((addon, idx) => (
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

          {/* How to Buy/Renew Section */}
          <div className="form-section">
            <h2 className="fw-bold mb-3">How to Buy/Renew Car Insurance Online?</h2>
            <p className="text-muted mb-3">
              The process of buying or renewing a car insurance online is simple.
            </p>
            <Row>
              {[
                {
                  title: "Fill Your Car Details",
                  description: "Provide car details such as its make, model, etc.",
                  img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg"
                },
                {
                  title: "Compare Car Insurance Quotes",
                  description: "Select the plan which fits your budget & requirements.",
                  img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg"
                },
                {
                  title: "Make Payment Online",
                  description: "Pay the policy premium online & get your document instantly.",
                  img: "https://static.insurancedekho.com/pwa/img/HowIDwork_img3.svg"
                }
              ].map((step, idx) => (
                <Col md={4} xs={12} key={idx} className="mb-3">
                  <div className="d-flex align-items-center addon-card">
                    <div className="position-relative me-3">
                      <img src={step.img} alt={step.title} style={{ width: '98px', height: '88px' }} />
                      {idx < 2 && (
                        <img
                          src="https://static.insurancedekho.com/pwa/img/fancy-arrow.svg"
                          alt="Arrow"
                          style={{ position: 'absolute', right: '-45px', top: '50%', transform: 'translateY(-50%)', width: '50px' }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="fw-bold text-primary">{step.title}</h3>
                      <p className="text-muted">{step.description}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Why Choose Section */}
          <div className="form-section">
            <h2 className="fw-bold mb-3 text-center">Why Choose InsuranceDekho?</h2>
            <p className="text-muted mb-3 text-center">
              Understand your options. Identify the best car insurance price.
            </p>
            <Row>
              {[
                {
                  title: "Car Insurance in Just 5 Minutes*",
                  description: "Get your car insurance online in just 5 minutes with our easy process.",
                  img: "https://static.insurancedekho.com/pwa/img/benifitimg1.svg"
                },
                {
                  title: "Over 45 Lakh Happy Customers",
                  description: "InsuranceDekho has won the love and confidence of over 45 Lakh customers.",
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
          <div className="form-section">
            <h2 className="fw-bold mb-3 text-center">Frequently Asked Questions</h2>
            <div className="accordion">
              {faqData.map((item, idx) => (
                <div className="accordion-item" key={idx}>
                  <h3 className="accordion-header" onClick={() => toggleAccordion(idx)}>
                    <span>{idx + 1}. {item.question}</span>
                    <span>
                      {activeAccordion === idx ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                      )}
                    </span>
                  </h3>
                  {activeAccordion === idx && (
                    <div className="text-muted p-3">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Car;