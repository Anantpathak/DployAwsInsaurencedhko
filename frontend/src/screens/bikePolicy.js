import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Card, Nav } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
const colors = ['#e0f7fa', '#e8f5e9', '#fff3e0', '#fce4ec', '#ede7f6'];

const BikePolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('Comprehensive');
  const [visibleCount, setVisibleCount] = useState(5);
  const [filteredPolicies, setFilteredPolicies] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    loan: false,
    name: "",
    email: "",
    address: "",
    pan: "",
    dob: "",
    rto: "",
  });
const API_BASE = process.env.REACT_APP_API_URL;
console.log('API_BASE:', API_BASE);
  useEffect(() => {
    fetch(`${API_BASE}/api/bike-insurance-provider/all`)
      .then((res) => res.json())
      .then((data) => {
        setPolicies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching bike policies:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = policies.filter(policy =>
      filterType === 'All' || policy.insuranceTypes?.includes(filterType)
    );
    setFilteredPolicies(filtered);
    setVisibleCount(5); // Reset visible count on filter change
  }, [policies, filterType]);



  if (loading) return <div className="text-center my-5">Loading...</div>;


  const handleSeeMore = () => setVisibleCount(prev => prev + 5);
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

  const handlePay = async () => {
    if (!selectedPlan) return;

    const premium = selectedPlan.premiumStartingFrom;
    const gst = (premium * 18) / 100;
    const totalAmount = premium + gst;
       const storedUser = JSON.parse(localStorage.getItem('user'));
const userId = storedUser?._id || '';
const bikePolicyId = selectedPlan._id;

axios.post(`${API_BASE}/api/bike-policy`, {
  userId,
  bikePolicyId,
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

  return (
    <>
    
 

    {/* Navbar */}
    <header className="sticky-top shadow-sm">
      <Navbar />
    </header>
<div  style={{ paddingLeft: '140px', paddingRight: '140px' }}>
<div className="bg-white">
<div className="gsc_container" style={{ paddingLeft: '140px', paddingRight: '140px' }}>
  <div className="titlewraper h2height">
    <h2 className="margin-bottom-35" style={{ marginBottom: '35px',paddingLeft: '180px' }}>
      What Is Bike Insurance?
    </h2>
    <h3></h3>
    <p className="nextP">
      If you own a bike, you know its value: the thrill of adventure, fun rides with the
      family, and the convenience of travelling in the local area. Indian households very
      quickly become attached to their bikes, and to ensure these sentiments are protected,
      getting bike insurance is very important. Bike Insurance protects your vehicle from the
      potential risk of damage and ensures that your bike continues to provide memories
      even after a setback.
    </p>
    <img
      loading="lazy"
      className="motorGrpahic"
      width="266"
      height="170"
      src="https://static.insurancedekho.com/pwa/img/bike-landing.svg"
      alt="What Is Bike Insurance?"
      style={{ width: '266px', height: '170px' }}
    />
  </div>
</div>
    
<div className="container py-4" style={{ paddingLeft: '20px', paddingTop: '20px', backgroundColor: '#f8f9fa' }}>
      <h3 className="fw-bold mb-3">Top Bike Insurance Plans</h3>
      <Nav variant="tabs" className="mb-4">
        {["Comprehensive", "Third Party", "Own Damage"].map((type) => (
          <Nav.Item key={type}>
            <Nav.Link active={filterType === type} onClick={() => {
              setFilterType(type);
              setVisibleCount(5);
            }}>
              {type}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row xs={1} md={1} lg={1}>
        {filteredPolicies.slice(0, visibleCount).map((item, index) => (
          <Col key={index}>
            <Card className="shadow-sm mb-4 border-0">
              <Card.Body className="row align-items-center">
                <Col md={2} className="text-center">
                  {item.logoUrl ? (
                    <img src={item.logoUrl} className="img-fluid" style={{ maxHeight: '50px' }} alt={item.name} />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center rounded-circle"
                      style={{
                        backgroundColor: colors[index % colors.length],
                        width: '50px',
                        height: '50px',
                        fontSize: '20px',
                        color: '#495057',
                      }}>
                      🚲
                    </div>
                  )}
                </Col>
                <Col md={3}>
                  <h6 className="fw-bold mb-1">{item.name}</h6>
                  <p className="mb-0 small text-muted">Cashless Garages: <strong>{item.cashlessGarages}</strong></p>
                  <p className="mb-0 small text-muted">Claims Settled: <strong>{item.claimsSettled}</strong></p>
                  <p className="mb-0 small text-muted">{item.claimType}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1 fw-bold text-success">Key Features:</p>
                  <ul className="list-inline mb-0">
                    {item.keyFeatures?.map((feature, i) => (
                      <li key={i} className="list-inline-item badge bg-light text-dark border">
                        ✅ {feature}
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col md={3} className="text-end">
                  <p className="mb-1">Starting From <strong>₹ {item.premiumStartingFrom}</strong></p>
                  <Button variant="danger" onClick={() => handleShowModal(item)}>Check Prices</Button>
                </Col>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {visibleCount < filteredPolicies.length && (
        <div className="text-center">
          <Button variant="outline-primary" onClick={handleSeeMore}>
            See More Plans ▼
          </Button>
        </div>
      )}

      {/* Payment Modal */}
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
                    label="Is your bike on loan?"
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

<div className="id_container">
  <div className="cardInner" style={{ display: 'flex', flexDirection: 'row', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
    <div className="googleLogo" style={{ marginRight: '16px' }}>
      <img
        loading="lazy"
        src="https://static.insurancedekho.com/pwa/img/landingpages/google-rating-icon.svg"
        className="policyBoxesImg"
        height="96"
        width="96"
        style={{ height: '96px', width: '96px' }}
      />
    </div>
    <div className="innerContent" style={{ flexGrow: 1 }}>
      <div className="reviewStars" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <img
          src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg"
          alt="Full Star"
          className="fullStar"
          style={{ height: '22px', width: '22px', marginRight: '2px' }}
        />
        <img
          src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg"
          alt="Full Star"
          className="fullStar"
          style={{ height: '22px', width: '22px', marginRight: '2px' }}
        />
        <img
          src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg"
          alt="Full Star"
          className="fullStar"
          style={{ height: '22px', width: '22px', marginRight: '2px' }}
        />
        <img
          src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg"
          alt="Full Star"
          className="fullStar"
          style={{ height: '22px', width: '22px', marginRight: '2px' }}
        />
        <img
          width="22"
          height="22"
          src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingHalf.svg"
          alt="Half Star"
          className="halfStar"
          style={{ height: '22px', width: '22px', marginRight: '4px' }}
        />
        <p className="ratingValue" style={{ margin: 0, fontWeight: 'bold', color: '#4CAF50' }}>4.8/5</p>
      </div>
      <p className="mainHeading" style={{ fontWeight: 'bold', marginBottom: '4px' }}>Read what our customers have to say</p>
      <p className="subHeading" style={{ fontSize: '0.9em', color: '#757575', marginBottom: '8px' }}>
        Rated <span style={{ fontWeight: 'bold' }}>4.8/5</span> with over <span style={{ fontWeight: 'bold' }}>5775</span> reviews on Google
      </p>
      <a href="https://www.google.com/maps/place/InsuranceDekho/@28.507052,77.0879523,17z/data=!4m8!3m7!1s0x390ce5641a67f799:0x6b964b8c54f9d65a!8m2!3d28.507052!4d77.0879523!9m1!1b1!16s%2Fg%2F11h4dk98k0?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoASAFQAw%3D%3D" className="reviewLink" style={{ color: '#1976D2', textDecoration: 'none', fontSize: '0.9em' }}>See all reviews</a>
    </div>
    <div className="rateButton" style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
      <a
        href="https://www.google.com/search?q=InsuranceDekho,+Gurugram&ludocid=1556488470313798378#lrd=0x390ce5641a67f799:0x6b964b8c54f9d65a,3"
        className="button rateUsButton"
        style={{ backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.9em', textDecoration: 'none' }}
      >
        Rate Us
      </a>
    </div>
  </div>
</div>
<div className="gsc_col-xs-12 gsc_col-lg-12 description" data-read-more="moveTop">
  <div className="shadow24 carSummary " style={{ boxShadow: '0 2px 4px rgba(0,0,0,.1)', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: 'white' }}>
    <h2 content="Why Do You Need Bike Insurance? " style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#212121', marginBottom: '16px' }}>Why Do You Need Bike Insurance? </h2>
    <div className="text-justify ">
      <div>
        <ol style={{ paddingLeft: '20px', margin: 0 }}>
          <li style={{ marginBottom: '8px', color: '#424242' }}>
            <strong style={{ color: '#212121' }}>Legal Requirement -</strong> In India, having at least a third-party liability cover is mandatory to legally ride on the roads. Failure to comply can lead to fines or even license suspension.
          </li>
          <li style={{ marginBottom: '8px', color: '#424242' }}>
            <strong style={{ color: '#212121' }}>Financial Security -</strong> Bike insurance protects you from the financial burden of repairing damages to your vehicle or another party’s, especially in accidents.
          </li>
          <li style={{ marginBottom: '8px', color: '#424242' }}>
            <strong style={{ color: '#212121' }}>Protection Against Theft</strong> - If your bike is stolen, comprehensive coverage can compensate you for the loss, mitigating out-of-pocket expenses.
          </li>
          <li style={{ marginBottom: '8px', color: '#424242' }}>
            <strong style={{ color: '#212121' }}>Personal Accident Cover</strong> - Most bike insurance policies include personal accident coverage, providing financial support for medical treatment in case of injuries sustained due to an accident.
          </li>
          <li style={{ marginBottom: '8px', color: '#424242' }}>
            <strong style={{ color: '#212121' }}>Third-Party Liability</strong> - If your bike is involved in an accident causing damage or injury to someone else, third-party liability coverage pays for their expenses or legal claims, reducing your financial risk.
          </li>
        </ol>
      </div>
    </div>
  </div>
</div>
<div className="gsc_container">
  <div className="titlewraper h2height"></div>
  <div className="typofPolicy" style={{ marginTop: '24px' }}>
    <h2 className="text-center" content="Types of Two Wheeler Insurance" style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#212121', marginBottom: '16px', textAlign: 'center' }}>Types of Two Wheeler Insurance</h2>
    <h3 style={{ textAlign: 'center', color: '#757575', marginBottom: '24px', fontSize: '1.1em' }}>There are 3 types of bike insurance policy in India and InsuranceDekho offers all of them.</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <ul className="gsc_col-lg-12 gsc_col-xs-12 right text-left" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <li className="gsc_col-lg-4 gsc_col-xs-12 cipanel" style={{ width: 'calc(33.33% - 16px)', margin: '0 8px 24px', minWidth: '300px' }}>
          <div className="shadownew relative min-height-420" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.1)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', minHeight: '420px', position: 'relative' }}>
            <span className="mostPopular" style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#FFC107', color: '#212121', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' }}> Preferred</span>
            <div className="difImgBox_cls aa" style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img loading="lazy" src="https://static.insurancedekho.com/pwa/img/comprehensive.svg" alt="Comprehensive Bike Insurance" width="36" height="36" style={{ height: '36px', width: '36px' }} />
            </div>
            <a className="cartitleLink" href="/bike-insurance/comprehensive" style={{ textDecoration: 'none' }}>
              <h3 className="carintitle" style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#212121', marginBottom: '8px', textAlign: 'center' }}>Comprehensive Bike Insurance</h3>
            </a>
            <p style={{ color: '#424242', fontSize: '0.9em', marginBottom: 'auto' }}>
              The Comprehensive bike insurance policy is a combination of both Standalone and Third-party car insurance. It is the most recommended policy as it protects you from the financial risks of causing damage or injury to a third person or property and covers the damages sustained by your bike as well.
            </p>
            <button className="button submitButton gsc_col-xs-12 gsc_col-md-12 cbfooter" style={{ backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 16px', cursor: 'pointer', fontSize: '0.9em', width: '100%', marginTop: '16px' }}>Check Prices</button>
          </div>
        </li>
        <li className="gsc_col-lg-4 gsc_col-xs-12 cipanel" style={{ width: 'calc(33.33% - 16px)', margin: '0 8px 24px', minWidth: '300px' }}>
          <div className="shadownew relative min-height-420" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.1)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', minHeight: '420px', position: 'relative' }}>
            <div className="difImgBox_cls aa" style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img loading="lazy" src="https://static.insurancedekho.com/pwa/img/thirdparty.svg" alt="Third Party Bike Insurance" width="36" height="36" style={{ height: '36px', width: '36px' }} />
            </div>
            <a className="cartitleLink" href="/bike-insurance/third-party-insurance" style={{ textDecoration: 'none' }}>
              <h3 className="carintitle" style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#212121', marginBottom: '8px', textAlign: 'center' }}>Third Party Bike Insurance</h3>
            </a>
            <p style={{ color: '#424242', fontSize: '0.9em', marginBottom: 'auto' }}>
              This insurance policy is mandatory for all motor vehicles. The Indian law makes it compulsory for people to purchase third-party bike insurance policies for their bikes. This policy covers the legal obligation to compensate for damages or injuries caused to a third person or property due to an accident by your bike.
            </p>
            <button className="button submitButton gsc_col-xs-12 gsc_col-md-12 cbfooter" style={{ backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 16px', cursor: 'pointer', fontSize: '0.9em', width: '100%', marginTop: '16px' }}>Check Prices</button>
          </div>
        </li>
        <li className="gsc_col-lg-4 gsc_col-xs-12 cipanel" style={{ width: 'calc(33.33% - 16px)', margin: '0 8px 24px', minWidth: '300px' }}>
          <div className="shadownew relative min-height-420" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.1)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', minHeight: '420px', position: 'relative' }}>
            <img loading="lazy" src="https://static.insurancedekho.com/pwa/img/carinsurancepolicy.svg" alt="Own-Damage Bike Insurance" width="36" height="36" style={{ height: '36px', width: '36px', textAlign: 'center', marginBottom: '16px' }} />
            <a className="cartitleLink" href="/car-insurance/standalone-own-damage-cover" style={{ textDecoration: 'none' }}>
              <h3 className="carintitle" style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#212121', marginBottom: '8px', textAlign: 'center' }}>Own-Damage Bike Insurance</h3>
            </a>
            <p style={{ color: '#424242', fontSize: '0.9em', marginBottom: 'auto' }}>
              The standalone own-damage policy covers the damages incurred by your vehicle. This policy safeguards your two-wheeler financially as it covers the cost of repair. If your bike gets damaged due to an accident, vandalism, or natural calamities such as earthquakes, floods, and riots, you can file a claim and the insurer will pay for the repair of your bike.
            </p>
            <button className="button submitButton gsc_col-xs-12 gsc_col-md-12 cbfooter" style={{ backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 16px', cursor: 'pointer', fontSize: '0.9em', width: '100%', marginTop: '16px' }}>Check Prices</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>

<div style={{ padding: '20px', backgroundColor: '#f8f9fa', fontFamily: 'Segoe UI, sans-serif', fontSize: '15px', color: '#333' }}>
  <div className="shadow-sm p-4 mb-4 bg-white rounded">
    <h2 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Key Features of a Bike Insurance Policy</h2>
    <p>Below listed are the key features and benefits of buying a bike insurance policy:</p>
    <p><strong>Legal Compliance: </strong>The Indian Motor Act 1988 makes it mandatory to purchase third-party insurance for every motor vehicle. Hence third-party bike insurance is necessary to purchase as it fulfils a legal obligation. </p>
    <p><strong>Third-Party Liability Coverage: </strong>The Third-party liability policy covers the compensation you are obliged to pay for damaging any third person's property or causing injury to a third person by your bike. It also covers the compensation to be paid if the accident caused a disability or death of the victim. </p>
    <p><strong>Own Damage Protection:</strong> In a Comprehensive Plan or a standalone own damage insurance policy, the risks of your bike getting damaged are covered in the insurance plan. It covers the damages caused by accidents, natural calamities, theft, fire, vandalism, etc. </p>

    <h2 style={{ fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Covered vs Not Covered Under Bike Insurance Policies</h2>
    <p>There are inclusions and exclusions in every policy. Bike insurance policy clearly outlines in the policy documents what is covered and what is not covered in the policy. You can refer to the table below to find out the basic coverages and not covered of a bike insurance policy.</p>

    <div className="table-responsive">
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-light">
          <tr>
            <th>Cover</th>
            <th>Stand Alone Own Damage</th>
            <th>Third-Party</th>
            <th>Comprehensive</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Damage/Losses happened to own bike due to an accident</td><td>YES</td><td>NO</td><td>YES</td></tr>
          <tr><td>Damage/Losses happened to own bike due to fire</td><td>YES</td><td>NO</td><td>YES</td></tr>
          <tr><td>Damage/Losses happened to own bike due to natural calamity</td><td>YES</td><td>NO</td><td>YES</td></tr>
          <tr><td>Damages to Third-Party vehicle</td><td>NO</td><td>YES</td><td>YES</td></tr>
          <tr><td>Damage to Third-Party Property</td><td>NO</td><td>YES</td><td>YES</td></tr>
          <tr><td>Personal Accident Cover</td><td>NO</td><td>YES</td><td>YES</td></tr>
          <tr><td>Injuries or Death of Third Person due to Accident</td><td>NO</td><td>YES</td><td>YES</td></tr>
          <tr><td>Theft of Bike</td><td>YES</td><td>NO</td><td>YES</td></tr>
          <tr><td>Customisable IDV</td><td>YES</td><td>NO</td><td>YES</td></tr>
          <tr><td>Available Add-ons</td><td>YES</td><td>NO</td><td>YES</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div className="shadow-sm p-4 mb-4 bg-white rounded">
    <h2 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Key Factors to Consider While Choosing a Bike Insurance Plan</h2>
    <p>While choosing an insurance policy for your bike, you have to find the policy that meets your expectations and fulfils your requirements. Here are the key factors to consider before selecting a bike insurance policy.</p>
    <p><strong>1. Type of Coverage:</strong> The policy's coverage is its primary component. Although some insurers require personal accident coverage, third-party liability typically only covers damages that your vehicle causes to another person or piece of property. The benefits of the own damage and third party policies are covered by the comprehensive coverage.</p>
    <p><strong>2. Insured Declared Value (IDV):</strong> The IDV is the current market value of your bike. Your IDV affects your premium, higher IDV has a higher premium. It also is the price the insurer pays in case your bike is stolen or damaged beyond repair.</p>
    <p><strong>3. Add-on Covers:</strong> Among the list of more than 10 add-ons in the market, some are fairly very popular given the benefits they add to the insurance policy. The most brought add-ons are Zero Depreciation Cover, Roadside Assistance, and Engine Protection.</p>
    <p><strong>4. Claim Settlement Ratio:</strong> CSR is a crucial metric to analyse the efficiency of the insurer in terms of settling claims. Look for insurers that have a CSR between 95-98%.</p>
    <p><strong>5. Network of Cashless Garages:</strong> A large network of cashless garages means you can get repairs done without upfront payment, wherever you are.</p>
    <p><strong>6. Premium Cost:</strong> Choose a plan that offers balanced coverage and cost after comparing quotes and add-ons.</p>
  </div>

  <div className="shadow-sm p-4 bg-white rounded">
    <h2 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Eligibility Criteria for Purchasing a Bike Insurance Policy</h2>
    <p>To purchase bike insurance, you must fulfil the following conditions:</p>
    <ul>
      <li>The bike should be registered under your name.</li>
      <li>You must have a Government authorised identification card.</li>
      <li>You should have a proof of address.</li>
      <li>You must be above the age of 18 years and have a valid driving license.</li>
      <li>The bike must be registered under the RTO (Regional Transport Office).</li>
    </ul>

    <h2 style={{ fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Benefits of Buying Bike Insurance</h2>
    <ul>
      <li>Financial protection: The insurer covers the cost of repair if you crash or damage your bike.</li>
      <li>Covers theft: If your bike gets stolen, the insurer will give you the market value of the bike.</li>
      <li>Personal Accident cover: Covers medical expenses in case of injury while riding.</li>
      <li>Legal support: The insurer helps with third-party claims and court representation.</li>
      <li>Peace of mind: No worry about rising repair expenses.</li>
      <li>Legal Obligation: Third-party coverage is mandatory; absence can lead to penalties.</li>
      <li>Roadside Assistance: On-road breakdown help with immediate support.</li>
    </ul>
  </div>
</div>

<div className="tipsBuyInsuranceSection" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
  <div className="id_container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
    <h2 className="text-center subheading" style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textAlign: 'center' }}>Two Wheeler Insurance Add-ons</h2>
    <p className="text-center subtext" style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>
      Add-ons bring extra protection to your policy. Each add-on comes with a price and hence increases the premium. Here is a list of the most popular add-ons that are favoured to go with Bike insurance plans.
    </p>
    <div className="tipInner" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="https://www.insurancedekho.com/bike-insurance/zero-depreciation" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/zero-dep.svg"
              className=""
              title="Zero Depreciation Cover Bike insurance Add-ons"
              alt="Zero Depreciation Cover Bike insurance Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#007bff', margin: 0 }}>Zero Depreciation Cover Bike insurance</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          With this add-on, the policyholder does not have to pay for the depreciated value of parts while filing a claim as the insurer covers that cost as well. This add-on is most suitable for new bike owners
        </p>
      </div>

      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="https://www.insurancedekho.com/bike-insurance/add-on-covers/return-to-invoice" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/invoice.svg"
              className=""
              title="Return To Invoice Cover Bike insurance Add-ons"
              alt="Return To Invoice Cover Bike insurance Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#28a745', margin: 0 }}>Return To Invoice Cover Bike insurance</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          The Return to Invoice is a very exciting add-on as in case of theft or damage beyond repair, the insurer provides the invoice value of the bike including road tax and RTO registration.
        </p>
      </div>

      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="https://www.insurancedekho.com/bike-insurance/add-on-covers/protection-of-ncb" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/ncb.svg"
              className=""
              title="NCB Protection Cover Bike insurance Add-ons"
              alt="NCB Protection Cover Bike insurance Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#dc3545', margin: 0 }}>NCB Protection Cover Bike insurance</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          This add-on allows you to file a claim that does not exhaust your NCB. This means your NCB bonus will continue on renewal unaffected by the claim you made during the policy.
        </p>
      </div>

      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="https://www.insurancedekho.com/bike-insurance/add-on-covers/engine-safe" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/engine-protection-new.svg"
              className=""
              title="Engine Protection Cover Bike insurance Add-ons"
              alt="Engine Protection Cover Bike insurance Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>Engine Protection Cover Bike insurance</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          The Engine Protection add-on covers the risk of water damage in the engine. Engine repair is usually very expensive and hence this add-on is a must-have for people living near flood-prone areas.
        </p>
      </div>

      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="/bike-insurance/add-on-covers/roadside-assistance" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/roadside_Assistance.svg"
              className=""
              title="Roadside Assistance Add-ons"
              alt="Roadside Assistance Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#17a2b8', margin: 0 }}>Roadside Assistance</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          This is a very essential service that must be in your policy. Roadside assistance cover provides a 24/7 helpline that sends immediate help to your location in case of an emergency. This emergency can be an accident, a flat tyre, an empty fuel tank, etc.
        </p>
      </div>

      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="/bike-insurance/add-on-covers/consumables" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/consumables_Cover.svg"
              className=""
              title="Consumables Cover Bike insurance Add-ons"
              alt="Consumables Cover Bike insurance Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#6f42c1', margin: 0 }}>Consumables Cover Bike insurance</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          When your bike is getting repaired at the garage, the mechanic uses screws, nuts, oil, etc for which the policyholder is charged. With this cover, you will not have to worry about these expenses as they will be covered under this cover.
        </p>
      </div>

      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="/bike-insurance/add-on-covers/tyre-damage" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/roadside_Assistance.svg"
              className=""
              title="Key Replacement Cover Add-ons"
              alt="Key Replacement Cover Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#e83e8c', margin: 0 }}>Key Replacement Cover</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          This cover covers the cost of replacing the keys and lock system if the keys are stolen or lost. This cover is suitable for bikes with advanced lock systems as it can be expensive to replace.
        </p>
      </div>

      <div className="bgCard" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', margin: '10px', width: 'calc(33% - 20px)', minWidth: '250px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <div className="bgCardHeading" style={{ marginBottom: '10px' }}>
          <a className="clickableCard" href="/bike-insurance/add-on-covers/tyre-damage" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              loading="lazy"
              src="https://static.insurancedekho.com/pwa/img/roadside_Assistance.svg"
              className=""
              title="Personal Accident Cover for Pillion Rider Add-ons"
              alt="Personal Accident Cover for Pillion Rider Add-ons"
              style={{ height: '48px', marginBottom: '8px' }}
            />
            <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#fd7e14', margin: 0 }}>Personal Accident Cover for Pillion Rider</h3>
          </a>
        </div>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: 'auto' }}>
          This add-on should be a priority for people who do not ride alone. This add-on covers the medical expenses in case of injuries and provides compensation in case of disabilities or death of a pillion rider.
        </p>
      </div>
    </div>
  </div>
</div>

<div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>Why Choose InsuranceDekho for Bike Insurance Online?</h2>
                    <div style={{ fontSize: '18px', color: '#666', lineHeight: '1.5' }}>InsuranceDekho is a one-stop insurance platform that allows you to compare various bike insurance policies and select the best two wheeler insurance.</div>
                </div>
                <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', listStyle: 'none', padding: '0', margin: '0' }}>
                    <li style={{ flex: '1', minWidth: '280px', marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <img
                                    loading="lazy"
                                    src="https://static.insurancedekho.com/pwa/img/benifitimg1.svg"
                                    alt="Best Bike Insurance in Just 60 Seconds*"
                                    width="186"
                                    height="186"
                                    style={{ borderRadius: '50%', border: '2px solid #81c784' }}
                                />
                            </div>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#4caf50', marginBottom: '10px' }}>Best Bike Insurance in Just 60 Seconds*</div>
                            <div>
                                <p style={{ fontSize: '0.9em', color: '#555', lineHeight: '1.4' }}>We issue your bike insurance in just 60 Seconds with our simple, swift and paperless process.</p>
                            </div>
                        </div>
                    </li>
                    <li style={{ flex: '1', minWidth: '280px', marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <img
                                    loading="lazy"
                                    src="https://static.insurancedekho.com/pwa/img/benifitimg2.svg"
                                    alt="Over 50 Lakh Happy Customers"
                                    width="186"
                                    height="186"
                                    style={{ borderRadius: '50%', border: '2px solid #ffb74d' }}
                                />
                            </div>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#ff8a00', marginBottom: '10px' }}>Over 50 Lakh Happy Customers</div>
                            <div>
                                <p style={{ fontSize: '0.9em', color: '#555', lineHeight: '1.4' }}>InsuranceDekho is a preferred choice of every insurance seeker. With our quick process, top-rated insurance plans, and committed customer care staff, we have managed to get the love and support of over 50 Lakh satisfied customers till now.</p>
                            </div>
                        </div>
                    </li>
                    <li style={{ flex: '1', minWidth: '280px', marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <img
                                    loading="lazy"
                                    src="https://static.insurancedekho.com/pwa/img/benifitimg3.svg"
                                    alt="7 Days Dedicated Customer Support"
                                    width="186"
                                    height="186"
                                    style={{ borderRadius: '50%', border: '2px solid #f44336' }}
                                />
                            </div>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#d32f2f', marginBottom: '10px' }}>7 Days Dedicated Customer Support</div>
                            <div>
                                <p style={{ fontSize: '0.9em', color: '#555', lineHeight: '1.4' }}>We have a dedicated customer support team which is available at your service everyday. You can reach out to our support staff for any insurance related assistance be it related to policy purchase or claim settlement, we are always there to assist you.</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>



</div>
</div>
<Footer/>

    </>
  );
};

export default BikePolicy;