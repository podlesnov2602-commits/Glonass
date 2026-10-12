import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Lock, Instagram, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredProperty, setFeaturedProperty] = useState(null);
  const [bannerProperties, setBannerProperties] = useState([]);
  const [hotProperties, setHotProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/properties`);
      const allProperties = response.data;
      setProperties(allProperties);
      
      // Set featured property (first one)
      if (allProperties.length > 0) {
        setFeaturedProperty(allProperties[0]);
      }
      
      // Set banner properties (next 4)
      if (allProperties.length > 1) {
        setBannerProperties(allProperties.slice(1, 5));
      }
      
      // Set hot properties (next 3 or loop back)
      if (allProperties.length > 5) {
        setHotProperties(allProperties.slice(5, 8));
      } else if (allProperties.length > 1) {
        // If not enough properties, loop back
        const needed = 3;
        const available = allProperties.slice(1);
        const hot = [];
        for (let i = 0; i < needed && available.length > 0; i++) {
          hot.push(available[i % available.length]);
        }
        setHotProperties(hot);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('kk-KZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' ₸';
  };

  return (
    <div className="homepage" data-testid="homepage">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-container">
          <Link to="/" className="logo-brand">
            <div className="logo-text">
              <span className="logo-primary">DARS</span>
              <span className="logo-secondary">CAPITAL</span>
            </div>
            <div className="logo-tagline">Premium Real Estate</div>
          </Link>
          <div className="nav-links">
            <Link to="/" data-testid="nav-home-link">Главная</Link>
            <Link to="/catalog" data-testid="nav-catalog-link">Каталог</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title" data-testid="hero-title">
            Найдите дом своей мечты
          </h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">
            Эксклюзивные предложения премиальной недвижимости
          </p>
          <Link to="/catalog">
            <Button className="hero-btn" data-testid="hero-cta-button">
              Посмотреть объекты
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Property Section */}
      {!loading && featuredProperty && (
        <section className="featured-section" data-testid="featured-section">
          <div className="featured-container">
            <h2 className="section-title">Избранное предложение</h2>
            <Link to={`/property/${featuredProperty.id}`} className="featured-property" data-testid="featured-property">
              <div className="featured-image">
                <img src={featuredProperty.images[0]} alt={featuredProperty.title} />
                <div className="featured-badge">Топ предложение</div>
              </div>
              <div className="featured-content">
                <h3>{featuredProperty.title}</h3>
                <div className="featured-location">
                  <MapPin size={18} />
                  <span>{featuredProperty.location}</span>
                </div>
                <p className="featured-description">{featuredProperty.description}</p>
                <div className="featured-details">
                  <span>{featuredProperty.rooms} комн.</span>
                  <span>•</span>
                  <span>{featuredProperty.area} м²</span>
                  {featuredProperty.plot_size && (
                    <>
                      <span>•</span>
                      <span>{featuredProperty.plot_size} сот.</span>
                    </>
                  )}
                  {featuredProperty.purpose && (
                    <>
                      <span>•</span>
                      <span>{featuredProperty.purpose}</span>
                    </>
                  )}
                </div>
                <div className="featured-price">{formatPrice(featuredProperty.price)}</div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Banner Properties Section */}
      {!loading && bannerProperties.length > 0 && (
        <section className="banners-section" data-testid="banners-section">
          <div className="banners-container">
            <h2 className="section-title">Популярные объекты</h2>
            <div className="banners-grid">
              {bannerProperties.map((property) => (
                <Link 
                  to={`/property/${property.id}`} 
                  key={property.id} 
                  className="banner-card"
                  data-testid={`banner-card-${property.id}`}
                >
                  <div className="banner-image">
                    <img src={property.images[0]} alt={property.title} />
                  </div>
                  <div className="banner-content">
                    <h4>{property.title}</h4>
                    <div className="banner-location">
                      <MapPin size={14} />
                      <span>{property.location}</span>
                    </div>
                    <div className="banner-price">{formatPrice(property.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hot Deals Section */}
      {!loading && hotProperties.length > 0 && (
        <section className="hot-deals-section" data-testid="hot-deals-section">
          <div className="hot-deals-container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Горящие предложения</h2>
                <p className="section-subtitle">Специальные цены на лучшие объекты</p>
              </div>
              <Link to="/catalog">
                <Button variant="outline" className="view-all-btn">
                  Смотреть все
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
            <div className="hot-deals-grid">
              {hotProperties.map((property) => (
                <Link 
                  to={`/property/${property.id}`} 
                  key={property.id} 
                  className="hot-deal-card"
                  data-testid={`hot-deal-card-${property.id}`}
                >
                  <div className="hot-deal-image">
                    <img src={property.images[0]} alt={property.title} />
                    <div className="hot-badge">Горящее</div>
                  </div>
                  <div className="hot-deal-content">
                    <h3>{property.title}</h3>
                    <div className="hot-deal-location">
                      <MapPin size={16} />
                      <span>{property.location}</span>
                    </div>
                    <div className="hot-deal-details">
                      <span>{property.rooms} комн.</span>
                      <span>•</span>
                      <span>{property.area} м²</span>
                    </div>
                    <div className="hot-deal-price">{formatPrice(property.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/77077157249" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
        data-testid="whatsapp-button"
        aria-label="Написать в WhatsApp"
      >
        <svg viewBox="0 0 32 32" className="whatsapp-icon">
          <path fill="currentColor" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.924 0-7.435 6.065-13.5 13.5-13.5s13.5 6.065 13.5 13.5-6.065 13.5-13.5 13.5zM21.82 19.138c-0.397-0.199-2.354-1.161-2.719-1.294-0.365-0.132-0.63-0.199-0.895 0.199s-1.028 1.294-1.261 1.56c-0.232 0.265-0.464 0.298-0.861 0.099s-1.68-0.619-3.199-1.973c-1.182-1.054-1.98-2.357-2.212-2.754s-0.025-0.611 0.174-0.809c0.179-0.176 0.397-0.463 0.596-0.694s0.265-0.397 0.397-0.662c0.132-0.265 0.066-0.496-0.033-0.694s-0.895-2.154-1.227-2.949c-0.323-0.774-0.651-0.67-0.895-0.682-0.232-0.012-0.496-0.015-0.761-0.015s-0.694 0.099-1.059 0.496c-0.365 0.397-1.394 1.361-1.394 3.319s1.427 3.849 1.626 4.114c0.199 0.265 2.807 4.281 6.8 6.004 0.95 0.411 1.691 0.655 2.27 0.839 0.955 0.303 1.824 0.26 2.513 0.157 0.767-0.115 2.354-0.962 2.686-1.891s0.332-1.726 0.232-1.891c-0.099-0.166-0.364-0.265-0.761-0.464z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>DARS CAPITAL</h4>
              <p>Эксклюзивные предложения премиальной недвижимости</p>
              <div className="social-links">
                <a 
                  href="https://www.instagram.com/d.darsil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  data-testid="instagram-link"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://wa.me/77077157249" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  data-testid="whatsapp-link"
                  aria-label="WhatsApp"
                >
                  <Phone size={20} />
                </a>
                <a 
                  href="mailto:darscapital@gmail.com" 
                  className="social-link"
                  data-testid="email-link"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Контакты</h4>
              <p className="footer-contact">
                <Mail size={16} className="footer-icon" />
                <a href="mailto:darscapital@gmail.com">darscapital@gmail.com</a>
              </p>
              <p className="footer-contact">
                <Phone size={16} className="footer-icon" />
                <a href="tel:+77077157249">+7 707 715 72 49</a>
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 DARS CAPITAL. Все права защищены.</p>
            <Link to="/admin-login" className="admin-lock-icon" data-testid="admin-lock-link">
              <Lock size={18} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;