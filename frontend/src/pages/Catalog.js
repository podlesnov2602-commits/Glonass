import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Lock, Instagram, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Catalog = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/properties`);
      setProperties(response.data);
      setFilteredProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    setFilteredProperties(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('kk-KZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' ₸';
  };

  return (
    <div className="catalog-page" data-testid="catalog-page">
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

      {/* Catalog Content */}
      <div className="catalog-content">
        {/* Page Header */}
        <div className="catalog-header">
          <h1 data-testid="catalog-title">Каталог недвижимости</h1>
          <p>Найдите идеальный вариант среди наших предложений</p>
        </div>

        {/* Filters */}
        <div className="catalog-filters" data-testid="catalog-filters">
          <div className="filters-grid-simple">
            <div className="filter-item">
              <label>Минимальная цена (₸)</label>
              <Input 
                type="number" 
                placeholder="От"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                data-testid="filter-min-price-input"
              />
            </div>

            <div className="filter-item">
              <label>Максимальная цена (₸)</label>
              <Input 
                type="number" 
                placeholder="До"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                data-testid="filter-max-price-input"
              />
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="catalog-list-container">
          {loading ? (
            <div className="loading" data-testid="loading-indicator">Загрузка...</div>
          ) : filteredProperties.length === 0 ? (
            <div className="no-results" data-testid="no-results-message">
              <p>Объекты не найдены. Попробуйте изменить фильтры.</p>
            </div>
          ) : (
            <div className="catalog-list">
              {filteredProperties.map((property) => (
                <Link 
                  to={`/property/${property.id}`} 
                  key={property.id} 
                  className="catalog-item"
                  data-testid={`catalog-item-${property.id}`}
                >
                  <div className="catalog-item-image">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      data-testid="catalog-item-image"
                    />
                    <div className="catalog-item-badge" data-testid="catalog-item-status">
                      {property.status === 'available' ? 'Доступно' : 'Продано'}
                    </div>
                  </div>
                  <div className="catalog-item-content">
                    <h3 className="catalog-item-title" data-testid="catalog-item-title">{property.title}</h3>
                    <div className="catalog-item-location" data-testid="catalog-item-location">
                      <MapPin size={16} />
                      <span>{property.location}</span>
                    </div>
                    <p className="catalog-item-description">{property.description}</p>
                    <div className="catalog-item-details">
                      <span data-testid="catalog-item-rooms">{property.rooms} комн.</span>
                      <span>•</span>
                      <span data-testid="catalog-item-area">{property.area} м²</span>
                      {property.plot_size && (
                        <>
                          <span>•</span>
                          <span data-testid="catalog-item-plot">{property.plot_size} сот.</span>
                        </>
                      )}
                      {property.purpose && (
                        <>
                          <span>•</span>
                          <span data-testid="catalog-item-purpose">{property.purpose}</span>
                        </>
                      )}
                    </div>
                    <div className="catalog-item-price" data-testid="catalog-item-price">{formatPrice(property.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

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

export default Catalog;
