import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
const Car = () => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Load 5 initially
  const [filterType, setFilterType] = useState("Comprehensive");
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
      setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqData = [
      {
          question: 'What is a car insurance policy?',
          answer: 'It is an agreement between an insurance company and a car owner under which the former provides an insurance cover to the policyholder for financial damages incurred by his/her car in unforeseen events. Depending on the coverage, there are three types of car insurance plans - third party , standalone own-damage and comprehensive insurance. It\'s renewal online process provides instant e-Policy.',
      },
      {
          question: 'Why should I buy car insurance?',
          answer: 'There are a number of benefits of owning four wheeler insurance. Firstly, it helps you meet the legal requirement of owning at least a third party cover. Moreover, an insurance policy helps you meet financial liabilities that may arise towards a third party or own damages to your car due to a road accident or any other unfortunate event.',
      },
      {
          question: 'Is car insurance mandatory in India?',
          answer: 'Yes, as per the Motor Vehicles Act, 1988, it is mandatory to have at least a third party car insurance to drive legally on Indian roads.  Driving without a valid car insurance policy is a punishable offence, and you may have to pay a fine of ₹2,000 and/or face imprisonment for up to 3 months.',
      },
      {
          question: 'How is car insurance premium calculated?',
          answer: 'Car insurance premium is calculated based on several factors, including the car\'s make and model, age, engine capacity, Insured Declared Value (IDV), geographical location, No Claim Bonus (NCB), and any add-on covers selected.  The insurer assesses the risk associated with the vehicle and the driver to determine the premium amount.',
      },
      {
          question: 'Can car insurance be transferred to the new owner at the purchase of a second hand four wheeler?',
          answer: 'Yes, car insurance can be transferred to the new owner.  The new owner must apply for the transfer of the car insurance policy within 14 days of the car\'s purchase. The new owner will also have to submit a copy of the Registration Certificate (RC) book, No Objection Certificate (NOC) from the previous owner, and other relevant documents to the insurance company.',
      },
  ];

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API_BASE}/api/insurance-provider/filter?type=${filterType}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [filterType]);


  
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      pan: '',
      dob: '',
      rto: '',
      address: '',
      loan: false
    });
  


    const handleShowModal = (item) => {
        setSelectedPlan(item);
        setShowModal(true);
      };
    
      const handleClose = () => {
        setShowModal(false);
        setSelectedPlan(null);
      };
    
      const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value
        }));
      };
    
      const storedUser = JSON.parse(localStorage.getItem('user'));
const userId = storedUser?._id || '';
      const handlePay = async () => {
        if (!selectedPlan) return;
    
        const premium = selectedPlan.premiumStartingFrom;
        const gst = (premium * 18) / 100;
        const totalAmount = premium + gst;
    
        try {
          const { data: order } = await axios.post(`${API_BASE}/api/payment/create-order`, {
            amount: totalAmount
            
          });
    const payload = { ...formData, userId,amount:totalAmount };
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
  const tableHeaderStyle = {
    backgroundColor: '#f2f2f2',
    padding: '12px',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
    fontSize: '14px',
    color: '#333',
    fontWeight: 'bold'
};

const tableCellStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    fontSize: '14px',
    color: '#555'
};
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
        description: "This add-on covers the cost of replacing your car keys if they are lost, stolen, or damaged.  Modern car keys can be expensive to replace, making this a valuable add-on.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M10.29 10.29a3.535 3.535 0 1 1 4.98 4.98l-5.12 5.12-7.071-7.071 5.12-5.12z"/><path d="M10 11v-1H8v-2H6v-1H4v-2H2v-2h2v-1h2v2h2v1h2v2h2v1h2v2h-2v1H8v-2z"/></svg>
    },
    {
        title: "Tyre Protection Cover",
        description: "Protects against damage to tyres and tubes, including punctures, bursts, and cuts, which are not always covered under a standard policy.  May include replacement costs.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
    },
    {
        title: "Consumables Cover",
        description: "Covers the cost of consumable items like engine oil, nuts, bolts, screws, grease, and other small parts that are typically not covered in a standard claim.  These can add up in repair costs.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0-.73 2.73l.08.15a2 2 0 0 1 0 2l-.25.43a2 2 0 0 1-1.73 1H2a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 0 2l-.08.15a2 2 0 0 0-.73 2.73l-.38.22a2 2 0 0 0-2.73.73l-.15-.08a2 2 0 0 1-2 0v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0 .73-2.73l-.08-.15a2 2 0 0 1 0-2l.25-.43a2 2 0 0 1 1.73-1h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.73-1l-.25-.43a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73l.39-.22a2 2 0 0 0 2.73-.73l.15.08a2 2 0 0 1 2 0v-.44a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8v8"/></svg>
    },
    {
        title: "Loss of Personal Belongings",
        description: "Compensates for the loss of personal items from your car in case of theft or accident.  Coverage limits and eligible items vary by insurer.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M7 12v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4"/></svg>
    },
    {
        title: "Daily Allowance Benefit",
        description: "Provides a daily allowance for transportation costs when your car is in the garage for repairs following an accident.  Helps cover expenses while you're without your vehicle.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M12 20h.01M8 2v4"/><path d="M16 2v4"/><path d="M8 18H6a2 2 0 0 1-2-2v-5h16v5a2 2 0 0 1-2 2h-2"/><path d="M16 6H8a2 2 0 0 0-2 2v3h8V8a2 2 0 0 0-2-2z"/></svg>
    },
    {
        title: "NCB Protection",
        description: "Protects your No Claim Bonus (NCB) from being reduced even if you make a claim during the policy period.  This helps you retain your accumulated NCB discount.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><path d="M9 17v-4c0-1.333-.8-4-3-4"/><path d="M15 17v-4c0-1.333.8-4 3-4"/><path d="M12 12h1"/><path d="M8 2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M9 17v-4c0-1.333-.8-4-3-4"/><path d="M15 17v-4c0-1.333.8-4 3-4"/></svg>
    },
    {
        title: "Personal Accident Cover for Unnamed Passengers",
        description: "Extends personal accident coverage to unnamed passengers in your car in case of an accident.  A standard policy typically covers only the owner-driver.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M15 18v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 17v-2a4 4 0 0 0-4-4H15a4 4 0 0 0-4 4v2"/><circle cx="18" cy="7" r="4"/></svg></svg>
    },
    {
        title: "EMI Protection",
        description: "Helps pay your car loan EMIs if your car is damaged in an accident and you are unable to use it.  Provides financial relief during the repair period.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote"><rect width="22" height="12" x="1" y="6" rx="2" ry="2"/><path d="M7 10h10"/><path d="M15 14H9"/><path d="M8 6v12"/></svg>
    },
    {
        title: "Gap Value Cover",
        description: "Covers the difference between the insured declared value (IDV) of your car and the outstanding loan amount in case of total loss or theft.  Useful for new cars with a large loan.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><path d="m3 17 6-6 4 4 8-8"/><polyline points="14 11 14 2 22 2 22 10"/></svg>
    },
];
  return (
    <>
    <div className="bg-white">
      {/* Navbar */}
      <header className="sticky-top shadow-sm">
        <Navbar />
      </header>


    <div>

    <div className="container py-4" style={{ paddingLeft: '200px', paddingTop: '60px', backgroundColor: '#f8f9fa' }}>
      <h3 className="fw-bold mb-3">Top Car Insurance Plans</h3>
      <ul className="nav nav-tabs mb-4">
        {["Comprehensive", "Third Party", "Own Damage"].map((type) => (
          <li className="nav-item" key={type}>
            <button className={`nav-link ${filterType === type ? "active" : ""}`} onClick={() => {
              setFilterType(type);
              setVisibleCount(5);
            }}>
              {type}
            </button>
          </li>
        ))}
      </ul>

      {data.slice(0, visibleCount).map((item, idx) => (
        <div className="card shadow-sm mb-4" key={idx}>
          <div className="card-body row align-items-center">
            <div className="col-md-2 text-center">
              <img src={item.logoUrl} className="img-fluid" style={{ maxHeight: "50px" }} alt={item.name} />
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold">{item.name}</h6>
              <p className="mb-0 small text-muted">Cashless Garages: <strong>{item.cashlessGarages}</strong></p>
              <p className="mb-0 small text-muted">Claims Settled: <strong>{item.claimsSettled}</strong></p>
              <p className="mb-0 small text-muted">{filterType === "Comprehensive" ? "ZERO DEP. CLAIMS" : item.claimType}</p>
            </div>
            <div className="col-md-4">
              <p className="mb-1 fw-bold text-success">Key Features:</p>
              <ul className="list-inline mb-0">
                {item.keyFeatures.map((feature, i) => (
                  <li key={i} className="list-inline-item badge bg-light text-dark border">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-3 text-end">
              <p className="mb-1">Starting From <strong>₹ {item.premiumStartingFrom}</strong></p>
              <button className="btn btn-danger" onClick={() => handleShowModal(item)}>Check Prices</button>
            </div>
          </div>
        </div>
      ))}

      {visibleCount < data.length && (
        <div className="text-center">
          <button className="btn btn-outline-primary" onClick={handleSeeMore}>
            See More Plans ▼
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedPlan && (
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Proposal Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={7}>
                <Form>
                  <Form.Check
                    type="checkbox"
                    label="Is your car on loan?"
                    name="loan"
                    checked={formData.loan}
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <Form.Group className="mb-2">
                    <Form.Label>Owner’s Full Name</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control value="798****968" disabled />
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
                        <Form.Label>RTO Pincode</Form.Label>
                        <Form.Control name="rto" value={formData.rto} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>

              <Col md={5}>
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
                  <Button variant="primary" className="mt-3 w-100" onClick={handlePay}>
                    Review & Pay ₹{(selectedPlan.premiumStartingFrom * 1.18).toFixed(2)}
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      )}
    </div>
    
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Rating Section */}
      <div style={{ paddingLeft: '400px',paddingTop:'60px', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <img
            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            alt="Google Logo"
            style={{ height: '30px', width: 'auto' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>★★★★★ 4.8 / 5</span>
            <span style={{ fontSize: '12px', color: '#666' }}>Read what our customers have to say</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            style={{
              backgroundColor: '#ff6f61',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              fontSize: '14px',
            }}
          >
            Rate Us
          </button>
          <span style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Rated 4.8 / 5 with over 5775 reviews on Google</span>
          <a href="#" style={{ fontSize: '12px', color: '#007bff', textDecoration: 'none', marginTop: '5px' }}>
            See all reviews
          </a>
        </div>
      </div>

      {/* Key Features Section */}
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', marginTop: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px', paddingLeft: '320px',paddingTop:'20px', }}>Key Features of a Car Insurance Policy</h2>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '10px,', paddingLeft: '310px' ,paddingTop:'5px',paddingBottom:'10px'}}>Here are some of the key benefits of having a car insurance policy:</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#555' }}>
          <li style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Financial Protection Against Damages:</span> Covers repair and replacement costs when your car is damaged due to accidents, theft, fire, vandalism, or natural calamities, reducing your out-of-pocket expenses.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Third-Party Liability Coverage:</span> Legally required to drive in India, it protects you from financial and legal obligations if your car injures someone, damages their vehicle or their property.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Personal Accident Cover:</span> Provides financial support if the owner-driver faces injury, disability, or death due to an accident, helping cover medical bills and loss of income.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>No Claim Bonus (NCB):</span> Helps reduce your cost of renewal for having no claims made during the policy term, helping you save money over time.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Cashless Repairs at Partner Garages:</span> Allows you to get your car repaired at network garages without paying upfront, with the insurer settling costs directly with the repair center.
          </li>
        </ul>
      </div>

      {/* Types of Car Insurance (Title) */}
      <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '20px auto',
        paddingLeft: '20px',
        paddingRight: '20px'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'left' , paddingLeft: '320px',paddingTop:'20px',}}>
        Types of Car Insurance
      </h2>
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px', textAlign: 'left' }}>
        It is important to choose the right car insurance policy for yourself and before you do that, here's all that you need to learn about the different types of car insurance policies.
      </p>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white', padding: '15px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#007BFF', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, marginBottom: '10px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Preferred Comprehensive Car Insurance
          </h3>
          <p  style={{ fontSize: '14px', color: '#555', margin: 0 }}>
              A comprehensive car insurance is an insurance that covers you for both standalone own damage and third-party car insurance. Its benefits cover you financially and legally from damage done to third-party property, injury or death of third party.
          </p>
        </div>

        <div style={{ flex: 1, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white', padding: '15px' }}>
          <h3  style={{ fontSize: '18px', fontWeight: 'bold', color: '#007BFF', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, marginBottom: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Third-Party Car Insurance
          </h3>
          <p  style={{ fontSize: '14px', color: '#555', margin: 0 }}>
              A third-party car insurance is an insurance that is mandatory as per the Motor Vehicle Act of 1988. With this insurance plan you are safeguarding yourself with any legal or financial liabilities arising due to an injury caused to a third-party, or any damage to their property or vehicle by your car.
          </p>
        </div>

        <div style={{ flex: 1, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white', padding: '15px' }}>
          <h3  style={{ fontSize: '18px', fontWeight: 'bold', color: '#007BFF', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, marginBottom: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-minus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8" cy="7" r="4"/><line x1="16" x2="24" y1="11" y2="11"/></svg>
              Standalone Own Damage Car Insurance
          </h3>
          <p  style={{ fontSize: '14px', color: '#555', margin: 0 }}>
              A standalone own damage car insurance gives you legal and financial protection to your car from any damage caused due to accident or natural and manmade calamities. This car insurance also protects your car from theft, fire, vandalism.
          </p>
        </div>
      </div>

    </div>

    <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '20px auto',
            paddingLeft: '20px',
            paddingRight: '20px',
        }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px', textAlign: 'left',paddingTop:'50px' }}>
                Third-Party Vs Comprehensive Car Insurance Vs Standalone Own Damage Car Insurance
            </h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px', textAlign: 'left' }}>
                The difference between a comprehensive and a third-party policy can be drawn from the below-mentioned table.
            </p>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Covers</th>
                            <th style={tableHeaderStyle}>Third-party (Mandatory)</th>
                            <th style={tableHeaderStyle}>Standalone Own Damage Car Insurance</th>
                            <th style={tableHeaderStyle}>Comprehensive Car Insurance (Recommended)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={tableCellStyle}>Damage to a third-party vehicle in an accident</td>
                            <td style={tableCellStyle}>Yes</td>
                            <td style={tableCellStyle}>No</td>
                            <td style={tableCellStyle}>Yes</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>Own damage cover (damage caused to your car in an accident)</td>
                            <td style={tableCellStyle}>No</td>
                            <td style={tableCellStyle}>Yes</td>
                            <td style={tableCellStyle}>Yes</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>Personal cover (damage caused to you in an accident)</td>
                            <td style={tableCellStyle}>Optional Add-on</td>
                            <td style={tableCellStyle}>Optional Add-on</td>
                            <td style={tableCellStyle}>Optional Add-on</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>Cover against natural disasters (fire, flood, earthquake, etc.)</td>
                            <td style={tableCellStyle}>No</td>
                            <td style={tableCellStyle}>Yes</td>
                            <td style={tableCellStyle}>Yes</td>
                        </tr>
                         <tr>
                            <td style={tableCellStyle}>Cover against riots and terrorism</td>
                            <td style={tableCellStyle}>No</td>
                            <td style={tableCellStyle}>Yes</td>
                            <td style={tableCellStyle}>Yes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <p style={{ fontSize: '12px', color: '#666', marginTop: '20px', textAlign: 'left' }}>
             Disclaimer: Coverage details may vary between insurers.  Always refer to the policy document for specific details.
             </p>
        </div>

        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '20px auto',
            paddingLeft: '20px',
            paddingRight: '20px'
        }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'left', paddingLeft: '320px',paddingTop:'50px' }}>
                Car Insurance Add-ons
            </h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px', textAlign: 'left' }}>
                Add-ons are optional extra benefits which can be added to your policy to extend the coverage. Add-ons come with a price so every added add-on increases your premium. By adding add-ons to your car insurance policy you can extend the overall protection of your car.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Responsive grid
                gap: '20px',
                marginTop: '20px'
            }}>
                {addons.map((addon, index) => (
                    <div key={index} style={{
                        flex: 1,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'space-between' // push content to the top and bottom
                    }}>
                        <div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                margin: 0,
                                marginBottom: '10px',
                                textAlign: 'left'
                            }}>
                                {addon.icon}
                                {addon.title}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#555', margin: 0, textAlign: 'left' }}>
                                {addon.description}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '20px auto',
            paddingLeft: '20px',
            paddingRight: '20px',
        }}>
            <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '10px',
                textAlign: 'left', paddingLeft: '320px',paddingTop:'50px'
            }}>How to Buy/Renew Car Insurance Online?</h2>
            <p style={{
                fontSize: '14px',
                color: '#555',
                marginBottom: '20px',
                textAlign: 'left'
            }}>The process of buying or renewing a car insurance online is quite simple and easy. Here’s how you can easily do it for your four-wheeler with us.</p>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '20px',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '380px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box',
                    textAlign: 'left'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '15px',
                        position: 'relative',
                    }}>
                        <img
                            loading="lazy"
                            src="https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg"
                            alt="Fill Your Car Details"
                            style={{
                                width: '98px',
                                height: '88px',
                                borderRadius: '8px',
                            }}
                        />
                        <img
                            loading="lazy"
                            alt="Step 1"
                            src="https://static.insurancedekho.com/pwa/img/fancy-arrow.svg"
                            style={{
                                position: 'absolute',
                                right: '-45px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '50px',
                                height: 'auto',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#007BFF',
                            marginBottom: '5px',
                            textAlign: 'left'
                        }}>Fill Your Car Details</div>
                        <p style={{
                            fontSize: '14px',
                            color: '#555',
                            textAlign: 'left'
                        }}>Provide car details such as its make, model, etc, to see car insurance price offered by top insurance providers in India.</p>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '380px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box',
                    textAlign: 'left'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '15px',
                        position: 'relative',
                    }}>
                        <img
                            loading="lazy"
                            src="https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg"
                            alt="Compare Car Insurance Quotes"
                            style={{
                                width: '98px',
                                height: '88px',
                                borderRadius: '8px',
                            }}
                        />
                        <img
                            loading="lazy"
                            alt="Step 2"
                            src="https://static.insurancedekho.com/pwa/img/fancy-arrow.svg"
                            style={{
                                position: 'absolute',
                                right: '-45px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '50px',
                                height: 'auto',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#007BFF',
                            marginBottom: '5px',
                            textAlign: 'left'
                        }}>Compare Car Insurance Quotes</div>
                        <p style={{
                            fontSize: '14px',
                            color: '#555',
                            textAlign: 'left'
                        }}>Select the plan which fits your budget & requirements best, out of all the available car insurance plans. </p>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '380px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box',
                    textAlign: 'left'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '15px',
                        position: 'relative',
                    }}>
                        <img
                            loading="lazy"
                            src="https://static.insurancedekho.com/pwa/img/HowIDwork_img3.svg"
                            alt="Make Payment Online"
                            style={{
                                width: '98px',
                                height: '88px',
                                borderRadius: '8px',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#007BFF',
                            marginBottom: '5px',
                            textAlign: 'left'
                        }}>Make Payment Online</div>
                        <p style={{
                            fontSize: '14px',
                            color: '#555',
                            textAlign: 'left'
                        }}>Pay the policy premium online & get your car insurance document delivered instantly to your inbox.</p>
                    </div>
                </div>
            </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px',paddingTop:'50px' }}>Why Choose InsuranceDekho for Car Insurance Online?</h2>
                    <div style={{ fontSize: '14px', color: '#555' }}>Understand your options. Identify the best car insurance price. Enjoy peace of mind.</div>
                </div>
                <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', listStyle: 'none', padding: 0, margin: '20px 0', gap: '20px' }}>
                    <li style={{ flex: '1', minWidth: '300px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', height: '186px' }}>
                            <img
                                loading="lazy"
                                src="https://static.insurancedekho.com/pwa/img/benifitimg1.svg"
                                alt="Car Insurance in Just 5 Minutes*"
                                style={{ width: '186px', height: '186px', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Car Insurance in Just 5 Minutes*</div>
                        <div>
                            <p style={{ fontSize: '14px', color: '#666' }}>Wait no more! Get your car insurance online in just 5 minutes with our easy, quick and paperless car insurance policy issuance process.</p>
                        </div>
                    </li>
                    <li style={{ flex: '1', minWidth: '300px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', height: '186px' }}>
                            <img
                                loading="lazy"
                                src="https://static.insurancedekho.com/pwa/img/benifitimg2.svg"
                                alt="Over 45 Lakh Happy Customers"
                                style={{ width: '186px', height: '186px', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Over 45 Lakh Happy Customers</div>
                        <div>
                            <p style={{ fontSize: '14px', color: '#666' }}>InsuranceDekho is a favourable choice among insurance buyers. Our transparent and quick process, availability of top-rated four wheeler insurance and dedicated customer support team has helped us win the love and confidence of over 45 Lakh happy customers</p>
                        </div>
                    </li>
                    <li style={{ flex: '1', minWidth: '300px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', height: '186px' }}>
                            <img
                                loading="lazy"
                                src="https://static.insurancedekho.com/pwa/img/benifitimg3.svg"
                                alt="7 Days Dedicated Customer Support"
                                style={{ width: '186px', height: '186px', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>7 Days Dedicated Customer Support</div>
                        <div>
                            <p style={{ fontSize: '14px', color: '#666' }}>Our dedicated customer support team is available at your service all the 7 days of the week. Feel free to reach out to us for any four wheeler insurance related assistance, be it for policy purchase or claim settlement, we are always there to help you.</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '20px auto',
            paddingLeft: '20px',
            paddingRight: '20px',
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '20px',paddingTop:'50px'
                }}>Frequently Asked Questions</h2>
            </div>
            <div style={{ marginTop: '25px' }}>
                <div style={{}} className="accordion">
                    <ul style={{}} className="gsc_row">
                        {faqData.map((item, index) => (
                            <li key={index} style={{}} className="gsc_col-sm-6 accordion">
                                <div style={{}} className="serialno">{index + 1}</div>
                                <div
                                    style={{
                                        borderBottom: index < faqData.length - 1 ? '1px solid #ddd' : 'none',
                                        cursor: 'pointer',
                                    }}
                                    className={activeAccordion === index ? 'expandviewAccor active' : 'expandviewAccor'}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <h3
                                        title={item.question}
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 0',
                                        }}
                                    >
                                        {item.question}
                                        <span style={{ marginLeft: '10px' }}>
                                            {activeAccordion === index ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                                            )}
                                        </span>
                                    </h3>
                                    {activeAccordion === index && (
                                        <div
                                            style={{
                                                padding: '15px 0',
                                                fontSize: '14px',
                                                color: '#555',
                                                lineHeight: '1.5',
                                            }}
                                            className="content on"
                                        >
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    </div>

</div>
    </div>
<Footer/>
    </>
  );
};

export default Car;
