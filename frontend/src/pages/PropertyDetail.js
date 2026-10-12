import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Home, Maximize, BedDouble, Bath, ArrowLeft, Check, Layers, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${API}/properties/${id}`);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('kk-KZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' ₸';
  };

  if (loading) {
    return (
      <div className="loading-container" data-testid="loading-indicator">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-container" data-testid="error-container">
        <p>Объект не найден</p>
        <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
      </div>
    );
  }

  return (
    <div className="property-detail" data-testid="property-detail-page">
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
            <Link to="/" data-testid="nav-home-link">
              <Button variant="ghost" className="back-btn">
                <ArrowLeft size={18} />
                Назад
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Property Content */}
      <div className="detail-container">
        {/* Image Gallery */}
        <div className="gallery-section" data-testid="gallery-section">
          <Carousel className="property-carousel">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="carousel-image-wrapper">
                    <img 
                      src={image} 
                      alt={`${property.title} - ${index + 1}`}
                      className="carousel-image"
                      data-testid={`property-image-${index}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="carousel-nav-btn carousel-nav-prev" />
            <CarouselNext className="carousel-nav-btn carousel-nav-next" />
          </Carousel>
        </div>

        {/* Property Info */}
        <div className="info-section">
          <div className="info-container">
            <div className="info-header">
              <div>
                <h1 className="detail-title" data-testid="property-title">{property.title}</h1>
                <div className="detail-location" data-testid="property-location">
                  <MapPin size={20} />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="detail-price" data-testid="property-price">{formatPrice(property.price)}</div>
            </div>

            {/* Key Features */}
            <div className="features-grid">
              <div className="feature-item" data-testid="feature-rooms">
                <BedDouble className="feature-icon" />
                <div>
                  <div className="feature-label">Комнаты</div>
                  <div className="feature-value">{property.rooms}</div>
                </div>
              </div>
              <div className="feature-item" data-testid="feature-area">
                <Maximize className="feature-icon" />
                <div>
                  <div className="feature-label">Площадь</div>
                  <div className="feature-value">{property.area} м²</div>
                </div>
              </div>
              {property.plot_size && (
                <div className="feature-item" data-testid="feature-plot">
                  <Layers className="feature-icon" />
                  <div>
                    <div className="feature-label">Участок</div>
                    <div className="feature-value">{property.plot_size} соток</div>
                  </div>
                </div>
              )}
              {property.purpose && (
                <div className="feature-item" data-testid="feature-purpose">
                  <Target className="feature-icon" />
                  <div>
                    <div className="feature-label">Назначение</div>
                    <div className="feature-value">{property.purpose}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>Описание</h2>
              <p className="description-text" data-testid="property-description">{property.description}</p>
            </div>

            {/* Additional Features */}
            {property.features && property.features.length > 0 && (
              <div className="additional-features">
                <h2>Особенности</h2>
                <div className="features-list" data-testid="property-features-list">
                  {property.features.map((feature, index) => (
                    <div key={index} className="feature-tag" data-testid={`feature-${index}`}>
                      <Check size={16} className="check-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3D Tour */}
            {property.tour_3d_url && (
              <div className="tour-3d-section">
                <h2>3D-тур</h2>
                <div className="tour-3d-container" data-testid="tour-3d-container">
                  <iframe
                    src={property.tour_3d_url}
                    className="tour-3d-iframe"
                    allowFullScreen
                    title="3D тур объекта"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="contact-section">
              <div className="contact-buttons">
                <a 
                  href="https://wa.me/77077157249" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="whatsapp-contact-link"
                >
                  <Button className="contact-btn" data-testid="contact-button">
                    Связаться с нами
                  </Button>
                </a>
                {property.krisha_url && (
                  <a 
                    href={property.krisha_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-testid="krisha-link"
                  >
                    <Button variant="outline" className="krisha-btn">
                      Смотреть на Krisha.kz
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;