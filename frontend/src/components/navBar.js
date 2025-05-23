import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Dropdown, Button, Modal, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InsuranceDekhoNavbar.css';
import './LoginModal.css';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [pan, setPan] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [panError, setPanError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [forgotPasswordUserId, setForgotPasswordUserId] = useState(null);
  // State for notifications
  const [carPolicies, setCarPolicies] = useState([]);
  const [bikePolicies, setBikePolicies] = useState([]);
  const [healthPolicies, setHealthPolicies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [urgentNotificationsCount, setUrgentNotificationsCount] = useState(0);

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Fetch policies when user logs in
  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      fetchPolicies(userId);
    }
  }, [user]);

  const fetchPolicies = async (userId) => {
    // Fetch car policies
    try {
      const carResponse = await axios.get(`${API_BASE}/api/car-owner/user/${userId}`);
      setCarPolicies(Array.isArray(carResponse.data) ? carResponse.data : carResponse.data ? [carResponse.data] : []);
    } catch (error) {
      console.error('Error fetching car policies:', error);
      setCarPolicies([]); // Set to empty array if the call fails
    }

    // Fetch bike policies (independent of car policies)
    try {
      const bikeResponse = await axios.get(`${API_BASE}/api/bike-policy/user/${userId}`);
      setBikePolicies(Array.isArray(bikeResponse.data) ? bikeResponse.data : bikeResponse.data ? [bikeResponse.data] : []);
    } catch (error) {
      console.error('Error fetching bike policies:', error);
      setBikePolicies([]); // Set to empty array if the call fails
    }

    // Fetch health policies (independent of others)
    try {
      const healthResponse = await axios.get(`${API_BASE}/api/health-policy/user/${userId}`);
      setHealthPolicies(Array.isArray(healthResponse.data) ? healthResponse.data : healthResponse.data ? [healthResponse.data] : []);
    } catch (error) {
      console.error('Error fetching health policies:', error);
      setHealthPolicies([]); // Set to empty array if the call fails
    }
  };

  // Process notifications whenever policies change
  useEffect(() => {
    const today = new Date('2025-05-22'); // Today's date
    const allNotifications = [];

    // Process car policies
    carPolicies.forEach((policy) => {
      const createdAt = new Date(policy.createdAt);
      const expiryDate = new Date(createdAt);
      expiryDate.setFullYear(createdAt.getFullYear() + 1); // Expiry = createdAt + 1 year

      const timeDiff = expiryDate - today;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

      allNotifications.push({
        type: 'Car',
        policyId: policy.policyId,
        expiryDate: expiryDate.toLocaleDateString('en-GB'),
        daysLeft,
        isUrgent: daysLeft <= 5 && daysLeft >= 0,
      });
    });

    // Process bike policies
    bikePolicies.forEach((policy) => {
      const createdAt = new Date(policy.createdAt);
      const expiryDate = new Date(createdAt);
      expiryDate.setFullYear(createdAt.getFullYear() + 1);

      const timeDiff = expiryDate - today;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      allNotifications.push({
        type: 'Bike',
        policyId: policy.bikePolicyId,
        expiryDate: expiryDate.toLocaleDateString('en-GB'),
        daysLeft,
        isUrgent: daysLeft <= 5 && daysLeft >= 0,
      });
    });

    // Process health policies
    healthPolicies.forEach((policy) => {
      const createdAt = new Date(policy.createdAt);
      const expiryDate = new Date(createdAt);
      expiryDate.setFullYear(createdAt.getFullYear() + 1);

      const timeDiff = expiryDate - today;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      allNotifications.push({
        type: 'Health',
        policyId: policy.healthPolicyId,
        expiryDate: expiryDate.toLocaleDateString('en-GB'),
        daysLeft,
        isUrgent: daysLeft <= 5 && daysLeft >= 0,
      });
    });

    setNotifications(allNotifications);
    const urgentCount = allNotifications.filter((notif) => notif.isUrgent).length;
    setUrgentNotificationsCount(urgentCount);
  }, [carPolicies, bikePolicies, healthPolicies]);

  const goToHome = () => {
    navigate('/register');
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginStep(1);
    setLoginError('');
    setEmailError('');
    setPhoneError('');
    setPanError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setEmail('');
    setPassword('');
    setName('');
    setPhoneNumber('');
    setGender('');
    setDob('');
    setPan('');
    setConfirmPassword('');
    setIsAdmin(false);
    setForgotPasswordUserId(null);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in)$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePan = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validatePassword = (pwd) => {
    return pwd.length >= 6;
  };

  const checkDuplicates = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/userlogin/check-duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber, pan }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return true;
    } catch (error) {
      setLoginError(error.message);
      return false;
    }
  };

  const handleEmailPasswordLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError('Email must include @ and end with .com or .in');
      return;
    }
    setEmailError('');
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE}/api/userlogin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const { token, user } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        if (user.isAdmin) {
          window.location.href = '/adminHome';
        } else {
          closeLoginModal();
        }
      } else if (data.error === 'Email not found') {
        MySwal.fire({
          title: 'User Not Found',
          text: 'Would you like to register?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Register Now',
          cancelButtonText: 'Cancel',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary',
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setLoginStep(2);
          }
        });
      } else if (data.error === 'Invalid password' && data.emailExists) {
        MySwal.fire({
          title: 'Invalid Password',
          text: 'The password you entered is incorrect. Would you like to reset your password?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Forgot Password',
          cancelButtonText: 'Try Again',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary',
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setLoginStep(3);
          }
        });
      } else {
        setLoginError(data.error || 'Login failed.');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterNewUser = async () => {
    if (!validateEmail(email)) {
      setEmailError('Email must include @ and end with .com or .in');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }
    if (!validatePan(pan)) {
      setPanError('PAN must be in the format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    if (!name.trim()) {
      setLoginError('Full name is required');
      return;
    }
    if (!gender) {
      setLoginError('Gender is required');
      return;
    }
    if (!dob) {
      setLoginError('Date of Birth is required');
      return;
    }

    setEmailError('');
    setPhoneError('');
    setPanError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setLoginError('');

    const isUnique = await checkDuplicates();
    if (!isUnique) return;

    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/userlogin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phoneNumber,
          email,
          password,
          pan,
          isAdmin,
          gender,
          dateOfBirth: dob || new Date('2000-01-01'),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        closeLoginModal();
        MySwal.fire({
          title: 'Registration Successful',
          text: 'You have been registered successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
        });
      } else {
        setLoginError(data.error || 'Registration failed.');
      }
    } catch (error) {
      setLoginError('Failed to register user.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPasswordVerify = async () => {
    if (!validateEmail(email)) {
      setEmailError('Email must include @ and end with .com or .in');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }

    setEmailError('');
    setPhoneError('');
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE}/api/userlogin/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber }),
      });

      const data = await res.json();
      if (res.ok) {
        setForgotPasswordUserId(data.userId);
        setLoginStep(4);
      } else {
        setLoginError(data.error || 'Verification failed.');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPasswordReset = async () => {
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    setConfirmPasswordError('');
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE}/api/userlogin/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: forgotPasswordUserId, newPassword: password }),
      });

      const data = await res.json();
      if (res.ok) {
        closeLoginModal();
        MySwal.fire({
          title: 'Password Reset Successful',
          text: 'Your password has been reset successfully. Please log in with your new password.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
        });
      } else {
        setLoginError(data.error || 'Password reset failed.');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCarPolicies([]);
    setBikePolicies([]);
    setHealthPolicies([]);
    setNotifications([]);
    setUrgentNotificationsCount(0);
    navigate('/');
  };

  return (
    <>
      <nav className="insurance-dekho-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              <img
                width="200"
                height="42"
                loading="eager"
                src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg"
                alt="Compare & Buy Car, Bike and Health Insurance Online - InsuranceDekho"
              />
            </Link>
            <ul className="navbar-links">
              <li className="dropdown">
                <button className="dropbtn">
                  Insurance <i className="fas fa-chevron-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/car-insurance">Car Insurance</Link>
                  <Link to="/bikePolicy">Bike Insurance</Link>
                  <Link to="/healthPolicy">Health Insurance</Link>
                  <Link to="/term">Term Insurance</Link>
                  <Link to="/investment">Investment Plans</Link>
                  <Link to="/buisness">Business Insurance</Link>
                  <Link to="/family">Family Health Insurance</Link>
                  <Link to="/investment">Guaranteed Return Plans</Link>
                  <Link to="#">View More</Link>
                </div>
              </li>
              <li className="dropdown">
                <button className="dropbtn">
                  Insurance Advisors <i className="fas fa-chevron-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/customerAdvisor">Find an Advisor</Link>
                  <Link to="https://pos.insurancedekho.com/?utm_source=b2c_website">Become an Advisor</Link>
                </div>
              </li>
              <li><Link to="/renew">Renew</Link></li>
              <li className="dropdown">
                <button className="dropbtn">
                  Support <i className="fas fa-chevron-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="https://www.insurancedekho.com/contact-us">Contact Us</Link>
                  <Link to="https://www.insurancedekho.com/disclaimer">FAQ</Link>
                  <Link to="https://www.insurancedekho.com/term-use">Claims</Link>
                </div>
              </li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="https://pos.insurancedekho.com/?utm_source=b2c_website">Become POSP Agent</Link></li>
            </ul>
            <button className="navbar-toggle">
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="https://www.insurancedekho.com/privacy-policy" className="track-policy">
              Track & Policy Download
            </Link>
            {!user ? (
              <div className="auth-buttons">
                <button className="login-button" onClick={openLoginModal}>
                  Login
                </button>
                <button
                  className="register-button"
                  onClick={() => {
                    setLoginStep(2);
                    openLoginModal();
                  }}
                >
                  New User?
                </button>
              </div>
            ) : (
              <>
                {/* Notification Bell Icon */}
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    id="notification-dropdown"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '5px 10px',
                      position: 'relative',
                      animation: urgentNotificationsCount > 0 ? 'shake 0.5s infinite' : 'none',
                    }}
                  >
                    <i
                      className="fas fa-bell"
                      style={{
                        fontSize: '20px',
                        color: urgentNotificationsCount > 0 ? '#ff4d4f' : '#343a40',
                      }}
                    ></i>
                    {urgentNotificationsCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '0',
                          backgroundColor: '#ff4d4f',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                        }}
                      >
                        {urgentNotificationsCount}
                      </span>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      width: '300px',
                      padding: '10px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      backgroundColor: '#fff',
                    }}
                  >
                    {notifications.length === 0 ? (
                      <Dropdown.Item
                        style={{
                          color: '#6c757d',
                          textAlign: 'center',
                          padding: '10px',
                          fontSize: '14px',
                        }}
                      >
                        No notifications
                      </Dropdown.Item>
                    ) : (
                      notifications.map((notif, index) => (
                        <Dropdown.Item
                          key={index}
                          style={{
                            padding: '10px',
                            borderBottom: '1px solid #e0e0e0',
                            backgroundColor: notif.isUrgent ? '#fff1f0' : '#fff',
                            color: notif.isUrgent ? '#ff4d4f' : '#343a40',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            fontSize: '14px',
                            animation: `fadeIn 0.3s ease-in ${index * 0.1}s forwards`,
                            opacity: 0,
                            borderLeft: `4px solid ${
                              notif.type === 'Car' ? '#007bff' : notif.type === 'Bike' ? '#28a745' : '#dc3545'
                            }`,
                            transition: 'background-color 0.3s ease, transform 0.2s ease',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = notif.isUrgent ? '#ffe6e6' : '#f8f9fa')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = notif.isUrgent ? '#fff1f0' : '#fff')
                          }
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontWeight: 'bold',
                            }}
                          >
                            <i
                              className={`fas ${
                                notif.type === 'Car'
                                  ? 'fa-car'
                                  : notif.type === 'Bike'
                                  ? 'fa-motorcycle'
                                  : 'fa-heartbeat'
                              }`}
                              style={{
                                color:
                                  notif.type === 'Car' ? '#007bff' : notif.type === 'Bike' ? '#28a745' : '#dc3545',
                              }}
                            ></i>
                            <span>{notif.type} Policy</span>
                          </div>
                          <div>Policy ID: {notif.policyId}</div>
                          <div>Expiry Date: {notif.expiryDate}</div>
                          <div>
                            Days Left: {notif.daysLeft >= 0 ? notif.daysLeft : 'Expired'}
                          </div>
                          {notif.isUrgent && (
                            <div
                              style={{
                                fontWeight: 'bold',
                                color: '#ff4d4f',
                                backgroundColor: '#ff4d4f1a',
                                padding: '5px',
                                borderRadius: '4px',
                                textAlign: 'center',
                              }}
                            >
                              Renew Now! ({notif.daysLeft} days left)
                            </div>
                          )}
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                {/* User Dropdown */}
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic" className="user-dropdown">
                    <i className="fas fa-user-circle mr-2"></i>
                    {user.name || 'User'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={goToHome}>Profile</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </div>
        </div>
      </nav>

      <Modal show={isLoginModalOpen} onHide={closeLoginModal} centered className="login-modal-custom">
        <Modal.Body className="p-4 modal-body-custom">
          <Form>
            {loginStep === 1 ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                    className="rounded input-custom"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError || 'Please enter a valid email.'}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded input-custom"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute end-0 top-50 translate-middle-y pe-3 cursor-pointer text-dark"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={handleEmailPasswordLogin}
                  disabled={loginLoading}
                  className="w-100 rounded btn-custom"
                >
                  {loginLoading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
                </Button>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setLoginStep(2);
                      }}
                    >
                      New User?
                    </a>
                    <a href="#" className="text-primary me-2">
                      Terms & Conditions
                    </a>
                    <a href="#" className="text-primary">
                      Privacy Policy
                    </a>
                  </small>
                </div>
              </>
            ) : loginStep === 2 ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded input-custom"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    isInvalid={!!phoneError}
                    className="rounded input-custom"
                  />
                  <Form.Control.Feedback type="invalid">
                    {phoneError || 'Phone number must be exactly 10 digits.'}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                    className="rounded input-custom"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError || 'Please enter a valid email.'}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your PAN (e.g., ABCDE1234F)"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    isInvalid={!!panError}
                    className="rounded input-custom"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {panError || 'PAN must be in the format: 5 letters, 4 digits, 1 letter.'}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!passwordError}
                      className="rounded input-custom"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute end-0 top-50 translate-middle-y pe-3 cursor-pointer text-dark"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                    <Form.Control.Feedback type="invalid">
                      {passwordError || 'Password must be at least 6 characters long.'}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Confirm Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isInvalid={!!confirmPasswordError}
                      className="rounded input-custom"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute end-0 top-50 translate-middle-y pe-3 cursor-pointer text-dark"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                    <Form.Control.Feedback type="invalid">
                      {confirmPasswordError || 'Passwords do not match.'}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Gender</Form.Label>
                  <Form.Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="rounded input-custom"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="rounded input-custom"
                  />
                </Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Is this an admin account?"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="mb-3 text-dark form-check-custom"
                />
                <Button
                  variant="primary"
                  onClick={handleRegisterNewUser}
                  disabled={loginLoading}
                  className="w-100 rounded btn-custom"
                >
                  {loginLoading ? <Spinner animation="border" size="sm" /> : 'Register'}
                </Button>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setLoginStep(1);
                      }}
                    >
                      Already have an account? Sign In
                    </a>
                    <a href="#" className="text-primary me-2">
                      Terms & Conditions
                    </a>
                    <a href="#" className="text-primary">
                      Privacy Policy
                    </a>
                  </small>
                </div>
              </>
            ) : loginStep === 3 ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                    className="rounded input-custom"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError || 'Please enter a valid email.'}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    isInvalid={!!phoneError}
                    className="rounded input-custom"
                  />
                  <Form.Control.Feedback type="invalid">
                    {phoneError || 'Phone number must be exactly 10 digits.'}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleForgotPasswordVerify}
                  disabled={loginLoading}
                  className="w-100 rounded btn-custom"
                >
                  {loginLoading ? <Spinner animation="border" size="sm" /> : 'Verify Identity'}
                </Button>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setLoginStep(1);
                      }}
                    >
                      Back to Login
                    </a>
                  </small>
                </div>
              </>
            ) : loginStep === 4 ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!passwordError}
                      className="rounded input-custom"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute end-0 top-50 translate-middle-y pe-3 cursor-pointer text-dark"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                    <Form.Control.Feedback type="invalid">
                      {passwordError || 'Password must be at least 6 characters long.'}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Confirm New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isInvalid={!!confirmPasswordError}
                      className="rounded input-custom"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute end-0 top-50 translate-middle-y pe-3 cursor-pointer text-dark"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                    <Form.Control.Feedback type="invalid">
                      {confirmPasswordError || 'Passwords do not match.'}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleForgotPasswordReset}
                  disabled={loginLoading}
                  className="w-100 rounded btn-custom"
                >
                  {loginLoading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                </Button>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setLoginStep(1);
                      }}
                    >
                      Back to Login
                    </a>
                  </small>
                </div>
              </>
            ) : null}

            {loginError && (
              <div className="alert alert-danger rounded mt-3" role="alert">
                {loginError}
              </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      <div>
        <Outlet />
      </div>

      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
            75% { transform: translateX(-2px); }
            100% { transform: translateX(0); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 768px) {
            .navbar-right {
              flex-wrap: wrap;
              gap: 5px !important;
            }
            .notification-dropdown-menu {
              width: 100% !important;
              max-width: 250px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;