import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/details" element={<Details />} />
    </Routes>
  )
}

function Form() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    countryCode: '+1',
    country: '',
    city: '',
    pan: '',
    aadhaar: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const validateField = (name, value) => {
    let error = ''
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} is required`
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Email is invalid'
    } else if (name === 'pan' && (value.length !== 10 || !/^[A-Z0-9]+$/i.test(value))) {
      error = 'PAN must be 10 alphanumeric characters'
    } else if (name === 'aadhaar' && (value.length !== 12 || !/^\d{12}$/.test(value))) {
      error = 'Aadhaar must be 12 digits'
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.pan.trim()) newErrors.pan = 'PAN is required'
    else if (formData.pan.length !== 10 || !/^[A-Z0-9]+$/i.test(formData.pan)) newErrors.pan = 'PAN must be 10 alphanumeric characters'
    if (!formData.aadhaar.trim()) newErrors.aadhaar = 'Aadhaar is required'
    else if (formData.aadhaar.length !== 12 || !/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = 'Aadhaar must be 12 digits'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      navigate('/details', { state: formData })
    }
  }

  const isFormValid = () => {
    return Object.values(errors).every(err => err === '') && Object.values(formData).every(val => val.trim() !== '')
  }

  return (
    <div className="form-container">
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'error' : ''} />
          {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'error' : ''} />
          {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className={errors.username ? 'error' : ''} />
          {errors.username && <span className="error-msg">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-group">
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={errors.password ? 'error' : ''} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          </div>
          {errors.password && <span className="error-msg">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label>Phone No</label>
          <div className="phone-group">
            <select name="countryCode" value={formData.countryCode} onChange={handleChange}>
              <option value="+1">+1 (US)</option>
              <option value="+91">+91 (IN)</option>
              <option value="+44">+44 (UK)</option>
            </select>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'error' : ''} />
          </div>
          {errors.phone && <span className="error-msg">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} className={errors.country ? 'error' : ''} />
          {errors.country && <span className="error-msg">{errors.country}</span>}
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'error' : ''} />
          {errors.city && <span className="error-msg">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label>PAN</label>
          <input type="text" name="pan" value={formData.pan} onChange={handleChange} className={errors.pan ? 'error' : ''} />
          {errors.pan && <span className="error-msg">{errors.pan}</span>}
        </div>
        <div className="form-group">
          <label>Aadhaar</label>
          <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} className={errors.aadhaar ? 'error' : ''} />
          {errors.aadhaar && <span className="error-msg">{errors.aadhaar}</span>}
        </div>
        <button type="submit" disabled={!isFormValid()}>Submit</button>
      </form>
    </div>
  )
}

function Details() {
  const { state } = useLocation()
  if (!state) return <div>No data</div>
  return (
    <div className="details-container">
      <h1>Form Details</h1>
      <p><strong>First Name:</strong> {state.firstName}</p>
      <p><strong>Last Name:</strong> {state.lastName}</p>
      <p><strong>Username:</strong> {state.username}</p>
      <p><strong>Email:</strong> {state.email}</p>
      <p><strong>Password:</strong> {state.password}</p>
      <p><strong>Phone:</strong> {state.countryCode} {state.phone}</p>
      <p><strong>Country:</strong> {state.country}</p>
      <p><strong>City:</strong> {state.city}</p>
      <p><strong>PAN:</strong> {state.pan}</p>
      <p><strong>Aadhaar:</strong> {state.aadhaar}</p>
      <button onClick={() => window.history.back()}>Back</button>
    </div>
  )
}

export default App
