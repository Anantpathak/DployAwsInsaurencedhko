import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from './navBar';
import Footer from './footer';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const PolicyCard = ({ type, policy }) => (
  <div style={cardStyle}>
    <h5>{type} Insurance</h5>
    <p><strong>Name:</strong> {policy.name}</p>
    <p><strong>Email:</strong> {policy.email}</p>
    <p><strong>Address:</strong> {policy.address}</p>
    <p><strong>Registration No:</strong> {policy.RegisterationNumber}</p>
    <p><strong>PAN:</strong> {policy.pan}</p>
    <p><strong>DOB:</strong> {formatDate(policy.dob)}</p>
    <p><strong>RTO:</strong> {policy.rto}</p>
    <p><strong>Loan:</strong> {policy.loan ? 'Yes' : 'No'}</p>
    {policy.amount && <p><strong>Amount:</strong> ₹{policy.amount}</p>}
    <p><strong>Purchase Date:</strong> {formatDate(policy.updatedAt)}</p>
    <p><strong>Policy No.:</strong> {policy.bikePolicyId}</p>
  </div>
);
const API_BASE = process.env.REACT_APP_API_URL;
const PoliciesByUser = ({ userId }) => {
  const [carPolicies, setCarPolicies] = useState([]);
  const [bikePolicies, setBikePolicies] = useState([]);
    const [healthPolicies, setHealthPolicies] = useState([]);
  const [activeTab, setActiveTab] = useState('car');

useEffect(() => {
  if (userId) {
    axios.get(`${API_BASE}/api/car-owner/user/${userId}`)
      .then(res => {
        const data = res.data;
        setCarPolicies(Array.isArray(data) ? data : [data]); // 👈 Ensure array
      })
      .catch(err => console.error('Car policy fetch error:', err));

    axios.get(`${API_BASE}/api/bike-policy/user/${userId}`)
      .then(res => {
        const data = res.data;
        setBikePolicies(Array.isArray(data) ? data : [data]); // 👈 Ensure array
      })
      .catch(err => console.error('Bike policy fetch error:', err));

    axios.get(`${API_BASE}/api/health-policy/user/${userId}`)
      .then(res => {
        const data = res.data;
        setHealthPolicies(Array.isArray(data) ? data : [data]); // 👈 Ensure array
      })
      .catch(err => console.error('Health policy fetch error:', err));
  }
}, [userId]);


  const renderPolicies = () => {
    const policies =
      activeTab === 'car'
        ? carPolicies
        : activeTab === 'bike'
        ? bikePolicies
        : activeTab === 'health'
        ? healthPolicies
        : [];

    if (!policies.length) return <p>No {activeTab} policies found.</p>;

    return (
      <div style={gridStyle}>
        {policies.map(policy => (
          <PolicyCard
            key={policy._id}
            type={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            policy={policy}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Your Insurance Policies</h3>

      <div style={tabContainer}>
        <button
          onClick={() => setActiveTab('car')}
          style={activeTab === 'car' ? activeTabStyle : tabStyle}
        >
          Car Policies
        </button>
        <button
          onClick={() => setActiveTab('bike')}
          style={activeTab === 'bike' ? activeTabStyle : tabStyle}
        >
          Bike Policies
        </button>
        {/* Future tab for Health */}
        { <button
          onClick={() => setActiveTab('health')}
          style={activeTab === 'health' ? activeTabStyle : tabStyle}
        >
          Health Policies
        </button> }
      </div>

      {renderPolicies()}
    </div>
  );
};

// 🔧 Styling
const tabContainer = {
  marginBottom: '1rem',
};

const tabStyle = {
  marginRight: '10px',
  padding: '10px 20px',
  border: '1px solid #007bff',
  backgroundColor: '#fff',
  color: '#007bff',
  cursor: 'pointer',
  borderRadius: '4px',
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: '#007bff',
  color: '#fff',
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  width: '300px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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

  // Error states
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
      setGender(parsedUser.gender);
      setDob(parsedUser.dateOfBirth ? new Date(parsedUser.dateOfBirth).toISOString().split('T')[0] : '');
      setMobile(parsedUser.phoneNumber);
      setEmail(parsedUser.email);
      setIsAdmin(parsedUser.isAdmin || false);
      setUserId(parsedUser._id || parsedUser.id);
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
      let url = `${API_BASE}/api/userlogin/register`;
      let method = 'POST';

      if (isEditing) {
        if (!userId) throw new Error('Missing user ID');
        url = `${API_BASE}/api/userlogin/${userId}`;
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
        if (dob) calculateAge(dob);
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
      setGender(user.gender);
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
      <header className="sticky-top shadow-sm">
        <Navbar />
      </header>

      <Container className="my-4">
        <Card className="p-4 shadow-sm">
          <h3 className="mb-4">{isEditing ? 'Edit Profile' : 'Register'}</h3>

          {registerError && <Alert variant="danger">{registerError}</Alert>}

          <Form>
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} isInvalid={!!nameError} />
              <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="gender" className="mt-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="dob" className="mt-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={dob} onChange={e => setDob(e.target.value)} isInvalid={!!dobError} />
              <Form.Control.Feedback type="invalid">{dobError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="mobile" className="mt-2">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="tel" value={mobile} onChange={e => setMobile(e.target.value)} isInvalid={!!mobileError} />
              <Form.Control.Feedback type="invalid">{mobileError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} isInvalid={!!emailError} />
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            </Form.Group>

            {!isEditing && (
              <>
                <Form.Group controlId="password" className="mt-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} isInvalid={!!passwordError} />
                  <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mt-2">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} isInvalid={!!confirmPasswordError} />
                  <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
                </Form.Group>
              </>
            )}

            <div className="mt-4">
              <Button variant="primary" onClick={handleSaveUser} disabled={registerLoading}>
                {registerLoading ? <Spinner animation="border" size="sm" /> : isEditing ? 'Update Profile' : 'Register'}
              </Button>{' '}
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            </div>
          </Form>
        </Card>

        {isRegistered && userId && (
          <Card className="mt-4 p-3">
            <PoliciesByUser userId={userId} />
          </Card>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default CustomerRegister;
