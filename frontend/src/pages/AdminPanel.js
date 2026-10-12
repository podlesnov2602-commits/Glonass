import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, Edit2, Trash2, X, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    property_type: 'apartment',
    area: '',
    rooms: '',
    bathrooms: '',
    plot_size: '',
    purpose: '',
    images: '',
    features: '',
    tour_3d_url: '',
    krisha_url: '',
    status: 'available'
  });

  useEffect(() => {
    checkAuth();
    fetchProperties();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin-login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Вы вышли из системы');
    navigate('/');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/properties`);
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Ошибка при загрузке объектов');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      property_type: 'apartment',
      area: '',
      rooms: '',
      bathrooms: '',
      plot_size: '',
      purpose: '',
      images: '',
      features: '',
      tour_3d_url: '',
      krisha_url: '',
      status: 'available'
    });
    setEditingProperty(null);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      location: property.location,
      property_type: property.property_type,
      area: property.area.toString(),
      rooms: property.rooms.toString(),
      bathrooms: property.bathrooms?.toString() || '',
      plot_size: property.plot_size?.toString() || '',
      purpose: property.purpose || '',
      images: property.images.join(', '),
      features: property.features.join(', '),
      tour_3d_url: property.tour_3d_url || '',
      krisha_url: property.krisha_url || '',
      status: property.status
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        property_type: formData.property_type,
        area: parseFloat(formData.area),
        rooms: parseInt(formData.rooms),
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        plot_size: formData.plot_size ? parseFloat(formData.plot_size) : null,
        purpose: formData.purpose.trim() || null,
        images: formData.images.split(',').map(url => url.trim()).filter(url => url),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        tour_3d_url: formData.tour_3d_url.trim() || null,
        krisha_url: formData.krisha_url.trim() || null,
        status: formData.status
      };

      if (editingProperty) {
        await axios.put(`${API}/properties/${editingProperty.id}`, propertyData, getAuthHeaders());
        toast.success('Объект успешно обновлен');
      } else {
        await axios.post(`${API}/properties`, propertyData, getAuthHeaders());
        toast.success('Объект успешно создан');
      }

      setDialogOpen(false);
      resetForm();
      fetchProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      if (error.response?.status === 401) {
        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        navigate('/admin-login');
      } else {
        toast.error('Ошибка при сохранении объекта');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        await axios.delete(`${API}/properties/${id}`, getAuthHeaders());
        toast.success('Объект успешно удален');
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        if (error.response?.status === 401) {
          toast.error('Сессия истекла. Пожалуйста, войдите снова');
          navigate('/admin-login');
        } else {
          toast.error('Ошибка при удалении объекта');
        }
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('kk-KZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' ₸';
  };

  return (
    <div className="admin-panel" data-testid="admin-panel">
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
            <span className="admin-label">Админ-панель</span>
            <Button variant="outline" onClick={handleLogout} className="logout-btn" data-testid="logout-button">
              <LogOut size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <div className="admin-container">
        <div className="admin-header">
          <h1 data-testid="admin-title">Управление объектами</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="add-btn" 
                onClick={resetForm}
                data-testid="add-property-button"
              >
                <Plus size={18} />
                Добавить объект
              </Button>
            </DialogTrigger>
            <DialogContent className="admin-dialog" data-testid="property-form-dialog">
              <DialogHeader>
                <DialogTitle data-testid="dialog-title">
                  {editingProperty ? 'Редактировать объект' : 'Добавить новый объект'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="property-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Название</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      data-testid="form-title-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Цена (₸)</label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      data-testid="form-price-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Район</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      data-testid="form-location-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Тип недвижимости</label>
                    <Select 
                      value={formData.property_type} 
                      onValueChange={(value) => handleSelectChange('property_type', value)}
                    >
                      <SelectTrigger data-testid="form-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Квартира</SelectItem>
                        <SelectItem value="house">Дом</SelectItem>
                        <SelectItem value="villa">Вилла</SelectItem>
                        <SelectItem value="penthouse">Пентхаус</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group">
                    <label>Площадь (м²)</label>
                    <Input
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      data-testid="form-area-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Комнаты</label>
                    <Input
                      name="rooms"
                      type="number"
                      value={formData.rooms}
                      onChange={handleInputChange}
                      required
                      data-testid="form-rooms-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Участок (соток)</label>
                    <Input
                      name="plot_size"
                      type="number"
                      step="0.01"
                      value={formData.plot_size}
                      onChange={handleInputChange}
                      placeholder="25"
                      data-testid="form-plot-size-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Назначение</label>
                    <Input
                      name="purpose"
                      type="text"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      placeholder="Жилое, Коммерческое"
                      data-testid="form-purpose-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Статус</label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger data-testid="form-status-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Доступно</SelectItem>
                        <SelectItem value="sold">Продано</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group full-width">
                    <label>URL изображений (через запятую)</label>
                    <Textarea
                      name="images"
                      value={formData.images}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      data-testid="form-images-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Особенности (через запятую)</label>
                    <Textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      rows={2}
                      data-testid="form-features-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>URL 3D-тура (опционально)</label>
                    <Input
                      name="tour_3d_url"
                      type="url"
                      value={formData.tour_3d_url}
                      onChange={handleInputChange}
                      placeholder="https://my.matterport.com/show/?m=..."
                      data-testid="form-tour-3d-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Ссылка на Krisha.kz (опционально)</label>
                    <Input
                      name="krisha_url"
                      type="url"
                      value={formData.krisha_url}
                      onChange={handleInputChange}
                      placeholder="https://krisha.kz/..."
                      data-testid="form-krisha-url-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Описание</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      data-testid="form-description-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <Button type="submit" data-testid="form-submit-button">
                    {editingProperty ? 'Обновить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Properties Table */}
        <div className="properties-table-container">
          {loading ? (
            <div className="loading" data-testid="loading-indicator">Загрузка...</div>
          ) : properties.length === 0 ? (
            <div className="no-properties" data-testid="no-properties-message">
              <p>Нет объектов. Добавьте первый объект!</p>
            </div>
          ) : (
            <div className="properties-table">
              {properties.map((property) => (
                <div key={property.id} className="property-row" data-testid={`admin-property-${property.id}`}>
                  <div className="property-row-image">
                    <img src={property.images[0]} alt={property.title} data-testid="admin-property-image" />
                  </div>
                  <div className="property-row-content">
                    <h3 data-testid="admin-property-title">{property.title}</h3>
                    <p className="property-row-location" data-testid="admin-property-location">{property.location}</p>
                    <div className="property-row-details">
                      <span data-testid="admin-property-type">{property.property_type}</span>
                      <span>•</span>
                      <span data-testid="admin-property-area">{property.area} м²</span>
                      <span>•</span>
                      <span data-testid="admin-property-rooms">{property.rooms} комнат</span>
                    </div>
                    <div className="property-row-price" data-testid="admin-property-price">{formatPrice(property.price)}</div>
                  </div>
                  <div className="property-row-actions">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(property)}
                      data-testid="edit-property-button"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(property.id)}
                      className="delete-btn"
                      data-testid="delete-property-button"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;