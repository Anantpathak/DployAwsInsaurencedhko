import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';


import './InsuranceDekhoNavbar.css'; // Keep the CSS import
import './LoginModal.css'; // Import CSS for the modal

import { Dropdown, Button, Modal, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const Navbar = () => {



  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState(1); // 1: Mobile Number, 2: OTP

  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);



  const [showPassword, setShowPassword] = useState(false);
const API_BASE = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);
 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openLoginModal = () => setIsLoginModalOpen(true);

 const handleEmailPasswordLogin = async () => {
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
        // Redirect admin to /adminHome
        window.location.href = '/adminHome';
      } else {
        // Regular user login behavior
        setIsLoginModalOpen(false);
      }
    } else if (data.error === 'Invalid credentials') {
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
          setLoginStep(2); // Show registration form
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
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/api/userlogin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phoneNumber,
          email,
          password,
          isAdmin,
          gender,
          dateOfBirth: dob || new Date('2000-01-01'),
    
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoginModalOpen(false);
      } else {
        setLoginError(data.error || 'Registration failed.');
      }
    } catch (error) {
      setLoginError('Failed to register user.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };



  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <nav className="insurance-dekho-navbar" style={{ height: 'auto' }}>
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
                  Insurance <img alt="down-arrow" width="8" height="5" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgOCA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC4zMzAzMTQgMS44NjE3M0wzLjIxNTkxIDQuNjgxNTVDMy42NTA0MiA1LjEwNjE1IDQuMzUyMzIgNS4xMDYxNSA0Ljc4Njg0IDQuNjgxNTVMNy42NzI0MyAxLjg2MTczQzguMzc0MzQgMS4xNzU4MyA3Ljg3Mjk4IDAgNi44ODE0IDBIMS4xMTAyMUMwLjExODYyOSAwIC0wLjM3MTU4OCAxLjE3NTgzIDAuMzMwMzE0IDEuODYxNzNaIiBmaWxsPSIjMzMzODQ2Ii8+Cjwvc3ZnPgo=" loading="eager"></img>
                </button>
                
                <div className="dropdown-content">
                <Link to="/car-insurance" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Car Insurance
                  </Link>
                  <Link to="/bikePolicy" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Bike Insurance</Link>
                  <Link to="/healthPolicy" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Health Insurance</Link>
                  <Link to="/term" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Term Insurance</Link>
                  <Link to="/investment" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Investment Plans</Link>
                  <Link to="/buisness" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Business Insurance</Link>
                  <Link to="/family" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Family Health Insurance</Link>
                  <Link to="/investment" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Guaranteed Return Plans</Link>
                  View More
                </div>
              </li>
              <li className="dropdown">
                <button className="dropbtn">
                  Insurance Advisors <img alt="down-arrow" width="8" height="5" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgOCA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC4zMzAzMTQgMS44NjE3M0wzLjIxNTkxIDQuNjgxNTVDMy42NTA0MiA1LjEwNjE1IDQuMzUyMzIgNS4xMDYxNSA0Ljc4Njg0IDQuNjgxNTVMNy42NzI0MyAxLjg2MTczQzguMzc0MzQgMS4xNzU4MyA3Ljg3Mjk4IDAgNi44ODE0IDBIMS4xMTAyMUMwLjExODYyOSAwIC0wLjM3MTU4OCAxLjE3NTgzIDAuMzMwMzE0IDEuODYxNzNaIiBmaWxsPSIjMzMzODQ2Ii8+Cjwvc3ZnPgo=" loading="eager"></img>
                </button>
                <div className="dropdown-content">
                  <Link to="/customerAdvisor" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Find an Advisor 
                  </Link>

                  Become an Advisor
                </div>
              </li>
              <li><Link to="/renew">Renew</Link></li>
              <li className="dropdown">
                <button className="dropbtn">
                  Support <img alt="down-arrow" width="8" height="5" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgOCA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC4zMzAzMTQgMS44NjE3M0wzLjIxNTkxIDQuNjgxNTVDMy42NTA0MiA1LjEwNjE1IDQuMzUyMzIgNS4xMDYxNSA0Ljc4Njg0IDQuNjgxNTVMNy42NzI0MyAxLjg2MTczQzguMzc0MzQgMS4xNzU4MyA3Ljg3Mjk4IDAgNi44ODE0IDBIMS4xMTAyMUMwLjExODYyOSAwIC0wLjM3MTU4OCAxLjE3NTgzIDAuMzMwMzE0IDEuODYxNzNaIiBmaWxsPSIjMzMzODQ2Ii8+Cjwvc3ZnPgo=" loading="eager"></img>
                </button>
                <div className="dropdown-content">
                  Contact Us
                  FAQ
                  Claims
                </div>
              </li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/become-posp">Become POSP Agent</Link></li>
            </ul>
          </div>
          <div className="navbar-right">
            <Link to="/track-policy" className="track-policy">
              Track & Policy <br /> Download
            </Link>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
  {!user ? (
    <button  className="login-button" onClick={openLoginModal}>
      Login
    </button>
  ) : (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>👤 {user.name || 'User'}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        <Dropdown.Item onClick={() => { window.location.href = 'http://localhost:3001/register'; }}>Profile</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )}

  <Modal show={isLoginModalOpen} onHide={closeLoginModal} centered>
    <Modal.Header closeButton>
      <Modal.Title>{loginStep === 1 ? 'Sign In to InsuranceDekho' : 'Register with InsuranceDekho'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer', marginLeft: '8px' }}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </Form.Group>

        {loginStep === 2 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Is this an admin account?"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </>
        )}

        {loginError && (
          <div className="alert alert-danger mt-3" role="alert">
            {loginError} <br />
            <span
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => {
                setLoginStep(2);
                setLoginError('');
              }}
            >
              New here? Register with us.
            </span>
          </div>
        )}

        <Button
          variant="primary"
          onClick={loginStep === 1 ? handleEmailPasswordLogin : handleRegisterNewUser}
          disabled={loginLoading}
          className="w-100 mt-3"
        >
          {loginLoading ? <Spinner animation="border" size="sm" /> : loginStep === 1 ? 'Login' : 'Register'}
        </Button>
      </Form>
    </Modal.Body>
  </Modal>
</div>

          </div>
        </div>
      </nav>




      <div>
        <Outlet />
      </div>
    </>
  );
};

// 🌈 Stylish inline styles (keep these)
const logoutBtnStyle = {
  transition: 'all 0.3s ease-in-out',
  fontWeight: 500,
};

export default Navbar;