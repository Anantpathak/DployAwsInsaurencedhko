import React, { useState, useEffect } from 'react';
import CarProvider from "../screens/carProvider";
import BikeProvider from "../screens/bikePovider";
import InvestmentProvider from "../screens/investmentProvider";
import NewsProvider from "../screens/news";
import Advisor from "../screens/advisor";
import Dasboard from "./AdminDashboard";
import { Dropdown,  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HealthProvider from "../screens/healthProvider";
import GuarnteeProvider from "../screens/guarntee";
// Dummy page components for demonstration

const InsurancePage = () => (
    <div style={{ padding: '20px' }}>
       
        <h1>Health Insurance</h1>
     
         <HealthProvider/>
    </div>
);

const CarInsurancePage = () => (
    <div style={{ padding: '20px' }}>
        <h1>Car Insurance</h1>
        <CarProvider/>
    </div>
);

const BikeInsurancePage = () => (
    <div style={{ padding: '20px' }}>
        <h1>Bike Insurance</h1>
        <BikeProvider/>
    </div>
);

const LifeInsurancePage = () => (
    <div style={{ padding: '20px' }}>
        <h1>Life Insurance</h1>
        <p>This is the Life Insurance page content.</p>
        <GuarnteeProvider/>
    </div>
);

const TermInsurancePage = () => (
    <div style={{ padding: '20px' }}>
        <h1>Term Insurance</h1>
        <InvestmentProvider/>
    </div>
);

const NewsPage = () => (  // Corrected this section
    <div style={{ padding: '20px' }}>
        <h1>News</h1>
        <NewsProvider/>
    </div>
);
const AdvisorPage = () => (  // Corrected this section
    <div style={{ padding: '20px' }}>
        <h1>News</h1>
        <Advisor/>
    </div>

    
);

const HomePage = () => (  // Added Home Page
    <div style={{ padding: '20px' }}>
        <p>Welcome to InsuranceDekho!</p>
        <Dasboard/>
    </div>
);

const Header = () => {
    const [currentPage, setCurrentPage] = useState('home'); // Start at a home page
    const [isMobile, setIsMobile] = useState(false);
     const [user, setUser] = useState(null);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Example breakpoint
        };

        handleResize(); // Check on initial load
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigation = (page) => {
        setCurrentPage(page);
        if (isMobile) {
            // Handle mobile menu closing if needed
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'insurance':
                return <InsurancePage />;
            case 'car-insurance':
                return <CarInsurancePage />;
            case 'bike-insurance':
                return <BikeInsurancePage />;
            case 'life-insurance':
                return <LifeInsurancePage />;
            case 'term-insurance':
                return <TermInsurancePage />;
            case 'news': // Corrected case for news
                return <NewsPage />;
                case 'advisor': // Corrected case for news
                return <AdvisorPage />;
            default:
                return <HomePage />;
        }
    };
    const navigate = useNavigate();
 useEffect(() => {
const token = localStorage.getItem('token');
 const userData = localStorage.getItem('user');
  if (token && userData) {
 setUser(JSON.parse(userData));
}
}, []);
 const handleLogout = () => {

localStorage.removeItem('token');
localStorage.removeItem('user');
navigate('/')
setUser(null);
 };
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop:'10PX'}}>
                <a
                    title="Compare & Buy Car, Bike and Health Insurance Online - InsuranceDekho"
                    href="#"
                    onClick={() => handleNavigation('home')}
                    style={{ marginRight: '20px', textDecoration: 'none' }}
                >
                    <img
                        width="200"
                        height="42"
                        loading="eager"
                        src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg"
                        alt="Compare & Buy Car, Bike and Health Insurance Online - InsuranceDekho"
                    />
                </a>
                <div>
                    <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                        <li style={{ margin: '0 10px' }}>
                            <a
                                title="Insurance"
                                href="#"
                                onClick={() => handleNavigation('insurance')}
                                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, textDecoration: 'none', color: '#333' }}
                            >
                                <img
                                    loading="lazy"
                                    width="24"
                                    height="24"
                                    alt="Insurance Page"
                                    src="https://static.insurancedekho.com/pwa/img/v2_icon_health.svg"
                                    style={{ marginRight: '10px' }}
                                />
                                Insurance
                            </a>
                        </li>

                        <li style={{ margin: '0 10px' }}>
                            <a
                                title="Car Insurance"
                                href="#"
                                onClick={() => handleNavigation('car-insurance')}
                                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, textDecoration: 'none', color: '#333' }}
                            >
                                <img
                                    loading="lazy"
                                    width="24"
                                    height="24"
                                    alt="Car Insurance Page"
                                    src="https://static.insurancedekho.com/pwa/img/v2_icon_car.svg"
                                    style={{ marginRight: '10px' }}
                                />
                                Car Insurance
                            </a>
                        </li>

                        <li style={{ margin: '0 10px' }}>
                            <a
                                title="Bike Insurance"
                                href="#"
                                onClick={() => handleNavigation('bike-insurance')}
                                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, textDecoration: 'none', color: '#333' }}
                            >
                                <img
                                    loading="lazy"
                                    width="24"
                                    height="24"
                                    alt="Bike Insurance Page"
                                    src="https://static.insurancedekho.com/pwa/img/v2_icon_bike.svg"
                                    style={{ marginRight: '10px' }}
                                />
                                Bike Insurance
                            </a>
                        </li>

                        <li style={{ margin: '0 10px' }}>
                            <a
                                title="Guanteed Return"
                                href="#"
                                onClick={() => handleNavigation('life-insurance')}
                                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, textDecoration: 'none', color: '#333' }}
                            >
                                <img
                                    loading="lazy"
                                    width="24"
                                    height="24"
                                    alt="Life Insurance Page"
                                    src="https://static.insurancedekho.com/pwa/img/life_insurance.svg"
                                    style={{ marginRight: '10px' }}
                                />
                               Guanteed Return
                            </a>
                        </li>

                        <li style={{ margin: '0 10px' }}>
                            <a
                                title="Term Insurance"
                                href="#"
                                onClick={() => handleNavigation('term-insurance')}
                                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, textDecoration: 'none', color: '#333' }}
                            >
                                <img
                                    loading="lazy"
                                    width="24"
                                    height="24"
                                    alt="Term Insurance Page"
                                    src="https://static.insurancedekho.com/pwa/img/v2_icon_life.svg"
                                    style={{ marginRight: '10px' }}
                                />
                                Term Insurance
                            </a>
                        </li>

                        <li style={{ margin: '0 10px' }}>
                            <a
                                title="News"
                                href="#"
                                onClick={() => handleNavigation('news')}
                                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, textDecoration: 'none', color: '#333' }}
                            >
                                <img
                                    loading="lazy"
                                    width="24"
                                    height="24"
                                    alt="News Page"
                                    src="https://static.insurancedekho.com/pwa/img/v2_icon_life.svg"
                                    style={{ marginRight: '10px' }}
                                />
                                News
                            </a>
                        </li>
                        <li style={{ margin: '0 10px' }}>
                            <a
                                title="News"
                                href="#"
                                onClick={() => handleNavigation('advisor')}
                                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, textDecoration: 'none', color: '#333' }}
                            >
                                <img
                                    loading="lazy"
                                    width="24"
                                    height="24"
                                    alt="News Page"
                                    src="https://static.insurancedekho.com/pwa/img/v2_icon_life.svg"
                                    style={{ marginRight: '10px' }}
                                />
                                Advisors
                            </a>
                        </li>

    <Dropdown style={{paddingLeft:'150px'}}>
      <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>👤 {user?.name || 'User'}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
                    </ul>
                </div>
            </div>
            {renderPage()} {/* Render the selected page content */}
        </div>
    );
};

export default Header;
