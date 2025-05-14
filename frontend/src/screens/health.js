import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
const Health = ({ filter }) => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
const API_BASE = process.env.REACT_APP_API_URL;
  const lightColors = ["#e3f2fd", "#e8f5e9", "#fff3cd", "#fce4ec"]; // Light Blue, Green, Yellow, Pink
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${API_BASE}/api/health/all`;
        if (filter) {
          const query = new URLSearchParams(filter).toString();
          url = `${API_BASE}/api/health/filter?${query}`;
        }
        const response = await axios.get(url);
        // Add `imageError` tracking to each item
        setData(response.data.map((item) => ({ ...item, imageError: false })));
      } catch (err) {
        console.error("Error fetching health providers", err);
      }
    };

    fetchData();
  }, [filter]);

  const handleImageError = (index) => {
    setData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, imageError: true } : item
      )
    );
  };

  const [selectedItem, setSelectedItem] = useState(null);
const [showModal, setShowModal] = useState(false);

const handleCheckPrices = (item) => {
  setSelectedItem(item);
  setShowModal(true);
};
  const [formData, setFormData] = useState({
    loan: false,
    name: "",
    email: "",
    address: "",
    pan: "",
    dob: "",
    rto: "",
  });
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  const handlePay = async () => {
    if (!selectedItem) return;

    const premium = selectedItem.premiumStartingFrom;
    const gst = (premium * 18) / 100;
    const totalAmount = premium + gst;
       const storedUser = JSON.parse(localStorage.getItem('user'));
const userId = storedUser?._id || '';
const healthPolicyId = selectedItem._id;

axios.post(`${API_BASE}/api/health-policy`, {
  userId,
  healthPolicyId,
  ...formData,amount: totalAmount,
});
    try {
      const { data: order } = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: totalAmount , 
      });
      

      const options = {
        key: 'rzp_test_7Hbs0bQhstZUoC',
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Bike Insurance Payment',
        order_id: order.id,
        handler: function (response) {
          console.log('Payment Success', response);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: '9999999999',
        },
        theme: {
          color: '#F37254'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        alert('Payment failed. Please try again!');
        console.error(response.error);
      });
    } catch (error) {
      alert('Payment initiation failed');
      console.error(error);
    }
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
      description:
        "(We are there for the time of your need to support in claim processing)*",
    },
    {
      icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004106_1_40bbd2161c.svg",
      title: "Flexible payment options",
      description:
        "(Ability to buy 3 year plan as well as monthly EMI options)",
    },
    {
      icon: "https://staticimg.insurancedekho.com/strapi/Frame_1000004691_60c7672ae7.svg",
      title: "1 lakh+ Families insured/Happy customers",
      description:
        "(Hear genuine customer’s opinion & their experiences)",
    },
  ];
  const significanceItems = [
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004073_b45536e7a3.svg",
      title: "Financial Security",
      description:
        "A health insurance policy can free you and your family from the financial burden that comes with a medical emergency, illness or health issues",
    },
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004074_e922d34238.svg",
      title: "Peace of Mind",
      description:
        "Once you and your loved ones are covered under a health insurance plan, you will have peace of mind and can focus on getting the right treatment stress-free.",
    },
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004075_02d44e54a1.svg",
      title: "Access to Quality Healthcare Services",
      description:
        "With the rising expenses of medical treatments, a health insurance policy can provide access to better quality healthcare services.",
    },
    {
      img: "https://staticimg.insurancedekho.com/strapi/Group_1000004076_9c99b3262b.svg",
      title: "Altering Lifestyle",
      description:
        "Having health insurance can shield you from diseases that may arise due to an altering lifestyle as with our current lifestyle we are faced with severe illnesses.",
    },
  ];
  return (
 <>
    

    {/* Navbar */}
    <header className="sticky-top shadow-sm">
      <Navbar />
    </header>
<div  style={{ paddingLeft: '140px', paddingRight: '140px' }}>

<div className="container my-4">
      <h1
        className="fw-bold mb-3"
        style={{ fontSize: "2rem", color: "#1e3a8a" }}
      >
        Buy Health Insurance Plans and Policies Online
      </h1>
      <p className="text-muted" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
        A health or medical insurance policy covers your medical expenses for
        illnesses and injuries including hospitalisation, daycare procedures,
        ambulance charges, medical care at home, medicine costs, and more. It
        protects the individuals and families from financial burden arising from
        unexpected medical expenses. Additionally, it helps you save taxes under
        section 80D of the Income Tax Act, 1961.
      </p>

      <div className="mt-4">
        <h3 className="fw-semibold  mb-3">Key Highlights</h3>
        <div className="row g-4">
          {features.map((feature, idx) => (
            <div className="col-md-6" key={idx}>
              <div
                className="d-flex align-items-start bg-light rounded p-3 h-100 shadow-sm"
                style={{ minHeight: "100px" }}
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  width={48}
                  height={48}
                  className="me-3"
                />
                <div>
                  <p className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
                    {feature.title}
                  </p>
                  <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="container my-4">
      {data.slice(0, visibleCount).map((item, idx) => (
        <div className="card shadow-sm mb-4" key={idx}>
          <div className="card-body row align-items-center">
            <div className="col-md-2 text-center">
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
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: lightColors[idx % lightColors.length],
                    color: "#333",
                    fontSize: "32px",
                    margin: "0 auto",
                  }}
                >
                  <i className="bi bi-heart-pulse-fill"></i>
                </div>
              )}
            </div>

            <div className="col-md-3">
              <h6 className="fw-bold">{item.name}</h6>
              <p className="mb-0 small text-muted">
                Claim Type: <strong>{item.claimType}</strong>
              </p>
              <p className="mb-0 small text-muted">
                Cover Amount: <strong>{item.coverAmount}</strong>
              </p>
            </div>

            <div className="col-md-4">
              <p className="mb-1 fw-bold text-success">Key Features:</p>
              <ul className="list-inline mb-0">
                {item.keyFeatures?.map((feature, i) => (
                  <li
                    key={i}
                    className="list-inline-item badge bg-light text-dark border"
                  >
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-3 text-end">
              <p className="mb-1">
                Starting From <strong>₹ {item.premiumStartingFrom}</strong>
              </p>
              <button
                className="btn btn-primary"
                onClick={() => handleCheckPrices(item)}
              >
                Check Prices
              </button>
            </div>
          </div>
        </div>
      ))}

      {visibleCount < data.length && (
        <div className="text-center">
          <button
            className="btn btn-outline-primary"
            onClick={() => setVisibleCount(visibleCount + 5)}
          >
            See More
          </button>
        </div>
      )}

      {/* Razorpay Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.name} - Premium Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
    
            <Row>
              <Col md={7}>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Owner’s Full Name</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" value={formData.email} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Registration Address</Form.Label>
                    <Form.Control name="address" value={formData.address} onChange={handleChange} />
                  </Form.Group>
                                  <Form.Group className="mb-2">
                    <Form.Label>Registration Number</Form.Label>
                    <Form.Control name="RegisterationNumber" value={formData.RegisterationNumber} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control name="pan" value={formData.pan} onChange={handleChange} />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label>Policy For</Form.Label>
                        <Form.Control name="rto" value={formData.rto} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                              <Col>
                      <Form.Group className="mb-2">
                        <Form.Label>Relation</Form.Label>
                        <Form.Control name="rto" value={formData.rto} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>

              <Col md={5}>
<div className="p-3 bg-light rounded shadow-sm">
    <p><strong>Claim Type:</strong> {selectedItem?.claimType}</p>
    <p><strong>Cover Amount:</strong> ₹ {selectedItem?.coverAmount}</p>
    <p><strong>Base Premium:</strong> ₹ {selectedItem?.premiumStartingFrom}</p>
    <p><strong>GST (18%):</strong> ₹ {(selectedItem?.premiumStartingFrom * 0.18)?.toFixed(2)}</p>
    <hr />
    <h5>Total Payable: ₹ {(selectedItem?.premiumStartingFrom * 1.18)?.toFixed(2)}</h5>
    <div className="fw-bold mb-2">{selectedItem?.name}</div>
    <div className="text-muted mb-2">{selectedItem?.claimType}</div>
    <hr />
    <div className="d-flex justify-content-between">
        <div>Premium</div>
        <div>₹{selectedItem?.premiumStartingFrom}</div>
    </div>
    <div className="d-flex justify-content-between">
        <div>GST (18%)</div>
        <div>₹{(selectedItem?.premiumStartingFrom * 18 / 100)?.toFixed(2)}</div>
    </div>
    <hr />
    <div className="d-flex justify-content-between fw-bold">
        <div>Total Payable</div>
        <div>₹{(selectedItem?.premiumStartingFrom * 1.18)?.toFixed(2)}</div>
    </div>
    <Button variant="primary" className="mt-3 w-100" onClick={handlePay}>
        Review & Pay ₹{(selectedItem?.premiumStartingFrom * 1.18)?.toFixed(2)}
    </Button>
</div>
              </Col>
            </Row>
         

        </Modal.Body>
      </Modal>
    </div>

    <div className="container my-5">
      <h2 className="fw-bold mb-2" style={{ color: "#1e3a8a" }}>
        Significance of having a health insurance policy
      </h2>
      <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>
        Following are some significant benefits of a comprehensive health
        insurance plan
      </p>
      <div className="row g-4">
        {significanceItems.map((item, idx) => (
          <div className="col-md-6 col-lg-6" key={idx}>
            <div
              className="d-flex align-items-start bg-white shadow-sm p-3 h-100 rounded border"
              style={{ minHeight: "120px" }}
            >
              <img
                src={item.img}
                alt={item.title}
                width={48}
                height={48}
                className="me-3"
              />
              <div>
                <p
                  className="fw-semibold mb-1"
                  style={{ fontSize: "1.05rem", color: "#0f172a" }}
                >
                  {item.title}
                </p>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    </div>
    <Footer/>
    </>
  );
};

export default Health;
