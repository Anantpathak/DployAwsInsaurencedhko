import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
const newsTypeIcons = {
  "All": <i className="fas fa-newspaper"></i>,
  "Car Insurance": <i className="fas fa-car"></i>,
  "Bike Insurance": <i className="fas fa-motorcycle"></i>,
  "Health Insurance": <i className="fas fa-heartbeat"></i>,
  "Life Insurance": <i className="fas fa-user-shield"></i>,
  "Term Insurance": <i className="fas fa-umbrella"></i>,
  "Investment News": <i className="fas fa-chart-line"></i>,
  "Business News": <i className="fas fa-store"></i>,
  "Travel Insurance": <i className="fas fa-plane"></i>,
};
const API_BASE = process.env.REACT_APP_API_URL;
const NewsComponent = () => {
  const [newsList, setNewsList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newsTypes, setNewsTypes] = useState(Object.keys(newsTypeIcons));

  useEffect(() => {
    fetchNews();
  }, [selectedType, currentPage]);

  const fetchNews = async () => {
    try {
      let url = `${API_BASE}/api/news/filter`;
      if (selectedType && selectedType !== "All") {
        url += `?type=${selectedType}`;
      }
      const response = await axios.get(url);
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleTypeClick = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getIconForType = (type) => newsTypeIcons[type] || <i className="fas fa-info-circle"></i>;

  const getCardLeftColor = (type) => {
    switch (type) {
      case "Car Insurance": return '#a8dadc';
      case "Bike Insurance": return '#457b9d';
      case "Health Insurance": return '#1d3557';
      case "Life Insurance": return '#e63946';
      case "Term Insurance": return '#f1faee';
      case "Investment News": return '#4caf50';
      case "Business News": return '#ff9800';
      case "Travel Insurance": return '#9c27b0';
      default: return '#333';
    }
  };

  return (
    <>
    <header className="sticky-top bg-white shadow-sm">
      <Navbar />
    </header>
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {newsTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeClick(type)}
            className={`btn ${selectedType === type ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              borderRadius: '25px',
              padding: '10px 20px',
              border: `1px solid ${selectedType === type ? '#007bff' : '#007bff'}`,
              backgroundColor: selectedType === type ? '#007bff' : 'white',
              color: selectedType === type ? 'white' : '#007bff',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
          >
            {getIconForType(type)} <span style={{ display: 'inline-block' }}>{type}</span>
          </button>
        ))}
      </div>

      <h2 style={{ marginBottom: '25px', color: '#333', textAlign: 'left' }}>
        {selectedType && selectedType !== "All" ? `${selectedType} Articles` : 'Latest News'}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {currentNews.map((news) => (
          <div key={news._id} style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s ease-in-out', maxWidth: '800px' }} // Added maxWidth
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '20px', minWidth: '120px', textAlign: 'center', backgroundColor: getCardLeftColor(news.newsType) }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{getIconForType(news.newsType)}</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{news.newsType}</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'white', flexGrow: 1 }}>
              <h5 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>{news.heading}</h5>
              <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '15px' }}>{news.content.substring(0, 180)}...</p>
              <p style={{ fontSize: '0.8rem', color: '#777' }}>
                <small>Writer: {news.writer} | Published On: {new Date(news.publishedDate).toLocaleDateString()}</small>
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <nav style={{ marginTop: '30px' }}>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
                <button onClick={() => paginate(number)} className="page-link" style={{ color: '#007bff', borderColor: '#ddd', backgroundColor: currentPage === number ? '#007bff' : 'white', color: currentPage === number ? 'white' : '#007bff' }}>
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
<Footer/>
    </>
  );
};

export default NewsComponent;