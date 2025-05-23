import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Spinner, Alert, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from './navBar';
import Footer from './footer';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const calculateExpiryDate = (createdAt) => {
  const createdDate = new Date(createdAt);
  createdDate.setFullYear(createdDate.getFullYear() + 3); // Add 3 years
  return formatDate(createdDate);
};

const PolicyCard = ({ type, policy, onShowDetails }) => (
  <div
    style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '1.5rem',
      width: '100%',
      maxWidth: '350px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      transition: 'transform 0.2s',
      margin: '0.5rem',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    <h5 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '1rem' }}>{type} Insurance</h5>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Name:</strong> {policy.name}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Email:</strong> {policy.email}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Address:</strong> {policy.address}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Registration No:</strong> {policy.registrationNumber || 'N/A'}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>PAN:</strong> {policy.pan}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>DOB:</strong> {formatDate(policy.dob)}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>RTO:</strong> {policy.rto || 'N/A'}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Loan:</strong> {policy.loan ? 'Yes' : 'No'}</p>
    {policy.amount && (
      <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Amount:</strong> ₹{policy.amount.toFixed(2)}</p>
    )}
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Purchase Date:</strong> {formatDate(policy.createdAt)}</p>
    <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}><strong>Policy No.:</strong> {policy.bikePolicyId || policy.policyId || policy.healthPolicyId || policy.termInsuranceId}</p>
    <Button
      onClick={() => onShowDetails(policy)}
      style={{
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        borderRadius: '5px',
        marginTop: '0.5rem',
        width: '100%',
      }}
    >
      Show Policy Details
    </Button>
  </div>
);

const PolicyDetailsModal = ({ show, onHide, policy, type, policyDetails, loading, error }) => {
  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner animation="border" style={{ color: '#007bff' }} />
            <p style={{ marginTop: '1rem', color: '#2c3e50' }}>Loading policy details...</p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body>
          <Alert variant="danger" style={{ margin: '1rem 0' }}>{error}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onHide}
            style={{
              backgroundColor: '#6c757d',
              borderColor: '#6c757d',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              borderRadius: '5px',
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (!policyDetails) return null;

  const expiryDate = calculateExpiryDate(policy.createdAt);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: '#2c3e50', fontWeight: '600' }}>{type} Insurance Provider Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ padding: '1rem' }}>
          <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Provider Name:</strong> {policyDetails.name}</p>
          <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Policy No.:</strong> {policy.bikePolicyId || policy.policyId || policy.healthPolicyId || policy.termInsuranceId}</p>
          {type.toLowerCase() !== 'term' ? (
            <>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Premium Starting From:</strong> ₹{policyDetails.premiumStartingFrom}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Cashless Garages:</strong> {policyDetails.cashlessGarages}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Claims Settled:</strong> {policyDetails.claimsSettled}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Claim Type:</strong> {policyDetails.claimType}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Insurance Types:</strong> {policyDetails.insuranceTypes.join(', ')}</p>
              {policyDetails.keyFeatures && policyDetails.keyFeatures.length > 0 && (
                <div>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 'bold' }}>Key Features:</p>
                  {policyDetails.keyFeatures.map((feature, index) => (
                    <p key={index} style={{ margin: '0.3rem 0', fontSize: '1rem' }}>- {feature}</p>
                  ))}
                </div>
              )}
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Car Brand:</strong> {policyDetails.carBrand}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Car Model:</strong> {policyDetails.carBrandModel}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Type of Car:</strong> {policyDetails.typeOfCar}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>City Registered:</strong> {policyDetails.cityCarRegistered}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Car Bought Year:</strong> {policyDetails.carBuyedYear}</p>
            </>
          ) : (
            <>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Premium Starting From:</strong> ₹{(policyDetails.premiumStartingFrom / 100).toFixed(2)}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Claim Type:</strong> {policyDetails.claimType}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Life Cover Amount:</strong> {policyDetails.lifeCoverAmount}</p>
              {policyDetails.keyFeatures && policyDetails.keyFeatures.length > 0 && (
                <div>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 'bold' }}>Key Features:</p>
                  {policyDetails.keyFeatures.map((feature, index) => (
                    <p key={index} style={{ margin: '0.3rem 0', fontSize: '1rem' }}>- {feature}</p>
                  ))}
                </div>
              )}
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Annual Income:</strong> ₹{policy.annualIncome}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Nominee Name:</strong> {policy.nomineeName}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Nominee Relationship:</strong> {policy.nomineeRelationship}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Tobacco Use Confirmed:</strong> {policy.tobaccoUseConfirmed ? 'Yes' : 'No'}</p>
            </>
          )}
          <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Purchase Date:</strong> {formatDate(policy.createdAt)}</p>
          <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}><strong>Expiry Date:</strong> {expiryDate}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          style={{
            backgroundColor: '#6c757d',
            borderColor: '#6c757d',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            borderRadius: '5px',
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const PoliciesByUser = ({ userId }) => {
  const [carPolicies, setCarPolicies] = useState([]);
  const [bikePolicies, setBikePolicies] = useState([]);
  const [healthPolicies, setHealthPolicies] = useState([]);
  const [termPolicies, setTermPolicies] = useState([]);
  const [activeTab, setActiveTab] = useState('car');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedPolicyType, setSelectedPolicyType] = useState('');
  const [policyDetails, setPolicyDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [fetchedTabs, setFetchedTabs] = useState({ car: false, bike: false, health: false, term: false });

  const fetchPolicies = async (tab) => {
    setLoading(true);
    setError('');

    try {
      const API_BASE = process.env.REACT_APP_API_URL;
      let response;

      if (tab === 'car') {
        response = await axios.get(`${API_BASE}/api/car-owner/user/${userId}`);
        setCarPolicies(Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
      } else if (tab === 'bike') {
        response = await axios.get(`${API_BASE}/api/bike-policy/user/${userId}`);
        setBikePolicies(Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
      } else if (tab === 'health') {
        response = await axios.get(`${API_BASE}/api/health-policy/user/${userId}`);
        setHealthPolicies(Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
      } else if (tab === 'term') {
        response = await axios.get(`${API_BASE}/api/term-payment/user/${userId}`);
        setTermPolicies(Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
      }

      setFetchedTabs((prev) => ({ ...prev, [tab]: true }));
    } catch (err) {
      setError(`Failed to fetch ${tab} policies. Please try again later.`);
      console.error(`Policy fetch error (${tab}):`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && !fetchedTabs.car) {
      fetchPolicies('car');
    }
  }, [userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!fetchedTabs[tab]) {
      fetchPolicies(tab);
    }
  };

  const fetchPolicyDetails = async (policy, type) => {
    setDetailsLoading(true);
    setDetailsError('');
    setPolicyDetails(null);

    try {
      const API_BASE = process.env.REACT_APP_API_URL;
      let url;
      let policyId;

      if (type.toLowerCase() === 'car') {
        policyId = policy.policyId;
        url = `${API_BASE}/api/insurance-provider/${policyId}`;
      } else if (type.toLowerCase() === 'bike') {
        policyId = policy.bikePolicyId;
        url = `${API_BASE}/api/bike-insurance-provider/${policyId}`;
      } else if (type.toLowerCase() === 'health') {
        policyId = policy.healthPolicyId;
        url = `${API_BASE}/api/health-insurance-provider/${policyId}`;
      } else if (type.toLowerCase() === 'term') {
        policyId = policy.termInsuranceId;
        url = `${API_BASE}/api/term/${policyId}`;
      }

      if (!url || !policyId) {
        throw new Error('Invalid policy type or ID');
      }

      const response = await axios.get(url);
      setPolicyDetails(response.data);
    } catch (err) {
      setDetailsError(
        err.response?.status === 404
          ? 'Insurance provider not found for this policy.'
          : 'Failed to fetch policy details. Please try again later.'
      );
      console.error('Policy details fetch error:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleShowDetails = (policy, type) => {
    setSelectedPolicy(policy);
    setSelectedPolicyType(type);
    setShowModal(true);
    fetchPolicyDetails(policy, type);
  };

  const renderPolicies = () => {
    const policies =
      activeTab === 'car'
        ? carPolicies
        : activeTab === 'bike'
        ? bikePolicies
        : activeTab === 'health'
        ? healthPolicies
        : activeTab === 'term'
        ? termPolicies
        : [];

    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner animation="border" style={{ color: '#007bff' }} />
          <p style={{ marginTop: '1rem', color: '#2c3e50' }}>Loading policies...</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger" style={{ margin: '1rem 0' }}>{error}</Alert>;
    }

    if (!fetchedTabs[activeTab]) {
      return (
        <p style={{ color: '#6c757d', textAlign: 'center', margin: '2rem 0' }}>
          Click the tab to load {activeTab} policies.
        </p>
      );
    }

    if (!policies.length) {
      return (
        <p style={{ color: '#6c757d', textAlign: 'center', margin: '2rem 0' }}>
          No {activeTab} policies found.
        </p>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        {policies.map((policy) => (
          <PolicyCard
            key={policy._id}
            type={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            policy={policy}
            onShowDetails={(policy) =>
              handleShowDetails(policy, activeTab.charAt(0).toUpperCase() + activeTab.slice(1))
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}>
      <h3 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
        Your Insurance Policies
      </h3>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => handleTabChange('car')}
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #007bff',
            backgroundColor: activeTab === 'car' ? '#007bff' : '#fff',
            color: activeTab === 'car' ? '#fff' : '#007bff',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
        >
          Car Policies
        </button>
        <button
          onClick={() => handleTabChange('bike')}
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #007bff',
            backgroundColor: activeTab === 'bike' ? '#007bff' : '#fff',
            color: activeTab === 'bike' ? '#fff' : '#007bff',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
        >
          Bike Policies
        </button>
        <button
          onClick={() => handleTabChange('health')}
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #007bff',
            backgroundColor: activeTab === 'health' ? '#007bff' : '#fff',
            color: activeTab === 'health' ? '#fff' : '#007bff',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
        >
          Health Policies
        </button>
        <button
          onClick={() => handleTabChange('term')}
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #007bff',
            backgroundColor: activeTab === 'term' ? '#007bff' : '#fff',
            color: activeTab === 'term' ? '#fff' : '#007bff',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
        >
          Term Policies
        </button>
      </div>

      {renderPolicies()}

      <PolicyDetailsModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setPolicyDetails(null);
          setDetailsError('');
        }}
        policy={selectedPolicy}
        type={selectedPolicyType}
        policyDetails={policyDetails}
        loading={detailsLoading}
        error={detailsError}
      />
    </div>
  );
};

const CustomerRegister = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [age, setAge] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [nameError, setNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsRegistered(true);
      setIsEditing(true);
      setName(parsedUser.name);
      setGender(parsedUser.gender || 'male');
      setDob(parsedUser.dateOfBirth ? new Date(parsedUser.dateOfBirth).toISOString().split('T')[0] : '');
      setMobile(parsedUser.phoneNumber);
      setEmail(parsedUser.email);
      setIsAdmin(parsedUser.isAdmin || false);
      setUserId(parsedUser._id || parsedUser.id);
      if (parsedUser.dateOfBirth) calculateAge(parsedUser.dateOfBirth);
    }
  }, []);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setAge(age);
  };

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setDobError('');
    setMobileError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    if (!dob) {
      setDobError('Date of Birth is required');
      isValid = false;
    } else if (new Date(dob) > new Date()) {
      setDobError('DOB cannot be in the future');
      isValid = false;
    } else {
      calculateAge(dob);
      if (age !== null && age < 18) {
        setDobError('You must be at least 18 years old');
        isValid = false;
      }
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setMobileError('Mobile must be 10 digits');
      isValid = false;
    }
    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Invalid email');
      isValid = false;
    }
    if (!isEditing) {
      if (!password || password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        isValid = false;
      }
      if (confirmPassword !== password) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    setRegisterLoading(true);
    setRegisterError('');

    try {
      let url = `${process.env.REACT_APP_API_URL}/api/userlogin/register`;
      let method = 'POST';

      if (isEditing) {
        if (!userId) throw new Error('Missing user ID');
        url = `${process.env.REACT_APP_API_URL}/api/userlogin/${userId}`;
        method = 'PUT';
      }

      const body = isEditing
        ? { name, phoneNumber: mobile, email, gender, dateOfBirth: dob, isAdmin }
        : { name, phoneNumber: mobile, email, password, gender, dateOfBirth: dob, isAdmin };

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setIsRegistered(true);
        setIsEditing(true);
        setUserId(data._id || data.id);
      } else {
        setRegisterError(data.error || 'Failed to register/update.');
      }
    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setGender(user.gender || 'male');
      setDob(user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '');
      setMobile(user.phoneNumber);
      setEmail(user.email);
      setIsAdmin(user.isAdmin || false);
    } else {
      setName('');
      setGender('male');
      setDob('');
      setMobile('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsAdmin(false);
    }
    setRegisterError('');
    setNameError('');
    setDobError('');
    setMobileError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Navbar />
      </header>

      <Container
        style={{
          padding: '2rem 1rem',
          backgroundColor: '#f1f3f5',
          minHeight: '100vh',
        }}
      >
        <Card
          style={{
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <h3
            style={{
              color: '#2c3e50',
              fontWeight: '600',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            {isEditing ? 'Edit Profile' : 'Register'}
          </h3>

          {registerError && (
            <Alert
              variant="danger"
              style={{
                marginBottom: '1.5rem',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.95rem',
              }}
            >
              {registerError}
            </Alert>
          )}

          <Form>
            <Form.Group controlId="name" style={{ marginBottom: '1.5rem' }}>
              <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!nameError}
                style={{
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ced4da',
                }}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
              >
                {nameError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="gender" style={{ marginBottom: '1.5rem' }}>
              <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Gender</Form.Label>
              <Form.Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ced4da',
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="dob" style={{ marginBottom: '1.5rem' }}>
              <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                isInvalid={!!dobError}
                style={{
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ced4da',
                }}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
              >
                {dobError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="mobile" style={{ marginBottom: '1.5rem' }}>
              <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                isInvalid={!!mobileError}
                style={{
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ced4da',
                }}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
              >
                {mobileError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email" style={{ marginBottom: '1.5rem' }}>
              <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!emailError}
                style={{
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ced4da',
                }}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
              >
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            {!isEditing && (
              <>
                <Form.Group controlId="password" style={{ marginBottom: '1.5rem' }}>
                  <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!passwordError}
                    style={{
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #ced4da',
                    }}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                  >
                    {passwordError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" style={{ marginBottom: '1.5rem' }}>
                  <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!confirmPasswordError}
                    style={{
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #ced4da',
                    }}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                  >
                    {confirmPasswordError}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '2rem',
              }}
            >
              <Button
                variant="primary"
                onClick={handleSaveUser}
                disabled={registerLoading}
                style={{
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
              >
                {registerLoading ? (
                  <Spinner animation="border" size="sm" style={{ marginRight: '0.5rem' }} />
                ) : isEditing ? (
                  'Update Profile'
                ) : (
                  'Register'
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                style={{
                  backgroundColor: '#6c757d',
                  borderColor: '#6c757d',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#5a6268')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#6c757d')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card>

        {isRegistered && userId && (
          <Card
            style={{
              marginTop: '2rem',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
            }}
          >
            <PoliciesByUser userId={userId} />
          </Card>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default CustomerRegister;