import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import './HomeAssistance.css';
import Swal from 'sweetalert2';
const HomeAssistanceForm = ({ onBookHomeVisit }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [showLoginButton, setShowLoginButton] = useState(!user);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.phoneNumber || '');
      setShowLoginButton(false);
    }
  }, [user]);

  const handleLoginClick = () => {
    alert('Login functionality would go here.');
  };
  const handleLoginClickSwal = () => {
    Swal.fire({
      title: 'Login Required',
      text: 'Please log in to book a home visit.',
      icon: 'info',

    })
  };
  return (
    <div className="col-lg-5">
      <div className="fusionformwrap lpBannerForm">
        <div className="gs_control-group mb15">
          <div className="gsc_mtl_field relative">
            <h2 className="margin-bottom-4">Fill Your Details To Book Now</h2>
            <div className="fusionSlots">
              <div className="limitedSlots">
                <h6>Limited slots</h6>
              </div>
              <div className="totalSlots">
                <ul>
                  <li>
                    <span className="slotIcon">
                      <img
                        src="https://static.insurancedekho.com/pwa/img/icon-appointment.webp"
                        title="user"
                        alt="user"
                        width="32"
                        height="20"
                      />
                    </span>
                    <p>20000+ Home Visits</p>
                  </li>
                  <li>
                    <span className="slotIcon">
                      <img
                        src="https://static.insurancedekho.com/pwa/img/yellow-star.svg"
                        title="star"
                        alt="star"
                        width="18"
                        height="18"
                      />
                    </span>
                    <p>2000+ Experts</p>
                  </li>
                </ul>
              </div>
            </div>

               {showLoginButton ? (
              <div
                style={{
                  backgroundColor: '#f8f9fa', // Light background
                  border: '1px solid #ced4da',
                  borderRadius: '5px',
                  padding: '15px',
                  marginBottom: '15px',
                  textAlign: 'center',
                }}
                onClick={handleLoginClickSwal}
                // eslint-disable-next-line react/jsx-no-duplicate-props

              >
                <p style={{ margin: '0', color: '#007bff', fontWeight: 'bold' }}>
                  <span style={{ fontSize: '1.2em', marginRight: '5px' }}>🔑</span> You Need To Login
                </p>
              </div>
            ): (
              <form className="formwrap">
                            <ul className="malefemalewrap">
              <li className="active">
                <span>
                  <i>Male</i>
                </span>
              </li>
              <li className="">
                <span>
                  <i>Female</i>
                </span>
              </li>
            </ul>
                <div className="form-control">
                  <div className="gs_control-group ">
                    <div data-gsmtl-container="true" className="inputborderbox white left1rem">
                      <div className="gsc_mtl_field">
                        <div className="input-field">
                          <input
                            id="name"
                            type="text"
                            name="name"
                            autoComplete="name"
                            value={name}
                            readOnly
                          />
                          <label htmlFor="name" className={name ? 'active' : ''}>
                            Name
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-control withEdit">
                  <div className="gs_control-group ">
                    <div data-gsmtl-container="true" className="inputborderbox white left1rem">
                      <div className="gsc_mtl_field">
                        <div className="input-field">
                          <input
                            id="mobile"
                            type="tel"
                            name="mobile"
                            maxLength="10"
                            autoComplete="phone"
                            value={mobile}
                            readOnly
                          />
                          <label htmlFor="mobile" className={mobile ? 'active' : ''}>
                            Mobile Number
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="resendotp">Edit</span>
                </div>
                <div className="gs_control-group mrg-B15 getDwhtsap">
                  <label className="gs_control gs_checkbox pad-R20-B0 font15">
                    <input type="checkbox" name="whatsAppOptIn" defaultChecked />
                    <span className="subtext">
                      Get Details on &nbsp;
                      <img
                        loading="lazy"
                        src="https://static.insurancedekho.com/pwa/img/newImages/whatsapp-gray.svg"
                        className="hover"
                        width="20"
                        height="20"
                        title="whatsapp"
                        alt="Get Details on whatsapp"
                      />
                      &nbsp; WhatsApp
                    </span>
                    <span className="gs_control__indicator"></span>
                  </label>
                </div>
                <div className="form-control">
                  <button
                    type="button"
                    name="submitBtn"
                    className="button submitButton"
                    onClick={onBookHomeVisit}
                  >
                    Book Free Home Visit
                    <span className="arrow-animation">
                      <img
                        src="https://static.insurancedekho.com/pwa/img/arrow-animation.gif"
                        title="arrow"
                        alt="arrow"
                        width="22"
                        height="22"
                      />
                    </span>
                  </button>
                  <p className="iagree">
                    By continuing, I agree to{' '}
                    <a href="#howItWork" className="link">
                      <sup>*</sup>terms &amp; conditions{' '}
                    </a>
                    &nbsp;and{' '}
                    <a href="/privacy-policy" className="link" target="_blank" rel="noopener noreferrer">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeAssistance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(2);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(2);
    setSelectedDate(null);
    setSelectedTime('');
    setLocation('');
    setManualLocation('');
    setShowCalendar(false);
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleManualLocationChange = (event) => {
    setManualLocation(event.target.value);
  };

  const handleDetectLocation = () => {
    alert('Detecting your current location...');
    setLocation('Detected Location (Simulated)');
    setManualLocation('Detected Location (Simulated)');
  };

  const scheduleVisit = () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    if (!selectedTime) {
      alert('Please select a time.');
      return;
    }
    if (!manualLocation) {
      alert('Please enter your location.');
      return;
    }

    alert(
      `Home visit scheduled for ${selectedDate.toDateString()} at ${selectedTime} at location: ${manualLocation}`
    );
    closeModal();
  };

  const renderCalendar = () => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = date.getDay();
    const days = [];

    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && selectedDate.toDateString() === currentDate.toDateString();
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(currentDate)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-days">{days}</div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky-top shadow-sm">
        <Navbar />
      </header>
      <div className="home-assistance-page">
        <div className="adviceFromWrap healthAdvisor">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="leftCell">
                  <h1>
                    Get<span className="advice"> Free Expert Assistance </span> at Home for
                    <br />
                    your <b>Health Insurance Plan</b>
                  </h1>
                  <p>
                    Secure Your Family's Health &amp; Wealth - Compare Top Plans, Get Customized Quotes
                  </p>
                  <div className="lpBannerText">
                    <div className="bannerImg">
                      <img
                        src="https://static.insurancedekho.com/pwa/img/v3_farhan-left-thumb.webp"
                        width="256"
                        height="420"
                        alt="Advisor"
                      />
                    </div>
                    <div className="expertList">
                      <ul>
                        <li>
                          <span className="expertIcon">
                            <img
                              src="https://static.insurancedekho.com/pwa/img/expertAdvice.svg"
                              width="25"
                              height="25"
                              alt="Advisor"
                            />
                          </span>
                          <span className="expertText">
                            <h6>Expert Advice</h6>
                            <p>IRDAI Certified Professionals</p>
                          </span>
                        </li>
                        <li>
                          <span className="expertIcon">
                            <img
                              src="https://static.insurancedekho.com/pwa/img/icon_clock.svg"
                              width="25"
                              height="25"
                              alt="Advisor"
                            />
                          </span>
                          <span className="expertText">
                            <h6>60 Minutes</h6>
                            <p>Personalised Advice</p>
                          </span>
                        </li>
                        <li>
                          <span className="expertIcon">
                            <img
                              src="https://static.insurancedekho.com/pwa/img/icon_hand.svg"
                              width="25"
                              height="25"
                              alt="Advisor"
                            />
                          </span>
                          <span className="expertText">
                            <h6>24 X 7</h6>
                            <p>Claims Support</p>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <HomeAssistanceForm onBookHomeVisit={openModal} />
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <button onClick={closeModal}>&lt;</button>
                <span>Step {currentStep === 2 ? '2/3' : '3/3'}</span>
              </div>

              {currentStep === 2 && (
                <div className="modal-body">
                  <div className="home-visit-time-slot">
                    <h2>Home visit time slot</h2>
                    <p>
                      Select as per your convenience, Our Expert will be in touch with you to manage any changes
                    </p>

                    <div className="select-date">
                      <h3>Select date</h3>
                      <button onClick={() => setShowCalendar(!showCalendar)}>
                        {selectedDate ? selectedDate.toDateString() : 'Choose Date'}
                      </button>
                      {showCalendar && renderCalendar()}
                    </div>

                    <div className="select-time">
                      <h3>Select Time (visit will take approx one hour)</h3>
                      <div className="time-options">
                        <button className={selectedTime === '9 AM' ? 'selected' : ''} onClick={() => handleTimeChange('9 AM')}>9 AM</button>
                        <button className={selectedTime === '11 AM' ? 'selected' : ''} onClick={() => handleTimeChange('11 AM')}>11 AM</button>
                        <button className={selectedTime === '1 PM' ? 'selected' : ''} onClick={() => handleTimeChange('1 PM')}>1 PM</button>
                        <button className={selectedTime === '3 PM' ? 'selected' : ''} onClick={() => handleTimeChange('3 PM')}>3 PM</button>
                        <button className={selectedTime === '5 PM' ? 'selected' : ''} onClick={() => handleTimeChange('5 PM')}>5 PM</button>
                      </div>
                      {selectedTime && <p>Selected Time: {selectedTime}</p>}
                    </div>

                    <button className="button" onClick={nextStep} disabled={!selectedDate || !selectedTime}>
                      Next
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="modal-body">
                  <div className="your-location-details">
                    <div className="location-icon">
                      <img
                        src="https://static.insurancedekho.com/pwa/img/location-pin.png"
                        alt="Location"
                        width="60"
                      />
                    </div>
                    <h2>Your location details</h2>
                    <p>Let us find your nearest Health Insurance Expert</p>

                    <div className="location-input">
                      <input
                        type="text"
                        placeholder="Enter Your Location"
                        value={manualLocation}
                        onChange={handleManualLocationChange}
                      />
                      <button onClick={handleDetectLocation}>Detect Current Location</button>
                      {manualLocation && <p>Your Location: {manualLocation}</p>}
                    </div>

                    <button className="button" onClick={scheduleVisit} disabled={!manualLocation}>
                      Schedule Visit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="gsc-row">
          <div className="advantages-heading">
            <h2> What to expect from home visits </h2>
            <p>
              4 quick steps to get personalised advice for your health insurance needs from experienced IRDAI certified
              experts.
            </p>
          </div>
          <div className="advanate-text-container">
            <div className="advanateText">
              <img src="https://www.insurancedekho.com/pwa/img/homeVisit.svg" width="187" height="186" alt="policy" />
              <h3>
                <strong>Step 1</strong>
              </h3>
              <p>
                Book Free Home Visit <br />
                (As per your convenience)
              </p>
            </div>
            <div className="advanateText">
              <img
                src="https://www.insurancedekho.com/pwa/img/perfectAdvisor.svg"
                width="187"
                height="186"
                alt="policy"
              />
              <h3>
                <strong>Step 2</strong>
              </h3>
          <p>Get a perfect advisor as per your needs</p>
        </div>
        <div className="advanateText">
          <img src="https://www.insurancedekho.com/pwa/img/adviceHome.svg" width="187" height="186" alt="policy" />
          <h3>
            <strong>Step 3</strong>
          </h3>
          <p>Get 60 min unbiased advice at home</p>
        </div>
        <div className="advanateText">
          <img src="https://www.insurancedekho.com/pwa/img/plansList.svg" width="187" height="186" alt="policy" />
          <h3>
            <strong>Step 4</strong>
          </h3>
          <p>Get personalized health plans</p>
        </div>
      </div>
      <div className="expertVisitBtm">
        <button className="button" onClick={openModal}>
          Book A Home Visit Now
          <span className="arrow-animation">
            <img
              src="https://static.insurancedekho.com/pwa/img/arrow-animation.gif"
              title="arrow"
              alt="arrow"
              width="22"
              height="22"
            />
          </span>
        </button>
      </div>
      <div className="expertBgRight">
        <img src="https://static.insurancedekho.com/pwa/img/orbiOval.svg" width="77" height="33" alt="Advisor" />
      </div>
    </div>

      <section className="marginBottom20 healthHomeBenifit gsc_row">
        <div className="container">
          <div className="col-lg-12 description" data-read-more="moveTop">
            <div className="shadow24 carSummary ">
              <h2 content="Benefits of Health Insurance">Benefits of Health Insurance</h2>
              <div className="subtxt marginBottom20">
                Health insurance offers a wide array of benefits to the insured. Following are some of the key benefits of
                a health insurance plan -
              </div>
              <div className=" ">
                <div>
                  <ul>
                    <li>
                      <h3>Comprehensive Coverage</h3>
                      A health insurance policy keeps you covered for major healthcare expenses incurred in case of medical
                      emergency. Usually, health insurance plans keep you protected for in-patient hospitalisation expenses
                      pre-hospitalisation and post-hospitalisation expenses, ambulance expenses, domiciliary
                      hospitalisation expenses, daycare procedures, organ donor expenses, treatments taken under AYUSH
                      systems of medicines, etc.
                    </li>
                    <li>
                      <h3>Lifetime Renewability</h3>
                      As per the guidelines issued by Insurance Regulatory and Development Authority of India (IRDA), the
                      insurance companies offering health insurance plans are supposed to offer lifetime renewability
                      benefits to the policyholders. It allows you to renew your health insurance policy without any upper
                      restriction on the maximum age limit. The feature is most beneficial for parents and senior citizens
                      as they can renew their insurance plans without any pressure of looking for new health insurance
                      plans in old age.
                      <i> </i>
                    </li>
                    <li>
                      <i>Cashless Treatment</i>
                      Insurance companies have tie-ups with certain hospitals,&nbsp; known as network hospitals, where the
                      insured can avail cashless treatment. If you avail treatment at these hospitals, the insurance
                      company will directly settle the bills at the hospital, and you will not be required to pay anything
                      for the treatment availed, except for non-medical expenses incurred.
                    </li>
                    <i>
                      <li>
                        <h3>Portability</h3>
                        Health insurance portability allows the policyholders to switch from their existing health
                        insurance company to another, in case they are not satisfied with their existing health insurance
                        plan, or find a more suitable plan. Portability feature saves the policyholders from being taken
                        for granted and offers them flexibility to switch in case of dissatisfaction.
                      </li>
                      <li>
                        <span></span>
                        <h3>Tax Benefits Under Section 80D of the Income Tax Act, 1961</h3> The government of India
                        promotes health insurance by offering tax exemptions of up to Rs. 1.5 Lakh on the premium paid
                        for health insurance plans, under Section 80D of the Income Tax Act, 1961. An individual can also
                        claim a deduction of up to Rs. 25,000 for insurance cover for self, spouse, and dependent
                        children. You can also avail a tax deduction of up to Rs. 25,000/Rs. 50,000 for health insurance
                        plans purchased for parents aged 60 years/ more than 60 years.
                      </li>
                    </i>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomeAssistance;