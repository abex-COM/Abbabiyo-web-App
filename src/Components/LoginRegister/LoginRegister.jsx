import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { register, login } from './api'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginRegister.css';

const LoginRegister = () => {
   const [formData, setFormData] = useState({
      fullname: '',
      username: '',
      email: '',
      password: '',
   });
   const [action, setAction] = useState('');
   const navigate = useNavigate(); // Initialize navigate

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const res = await login(formData);
         console.log('Login successful:', res.data.token);
         localStorage.setItem('token', res.data.token); // Store token in localStorage
         navigate('/admin'); // Redirect to the Admin Dashboard
      } catch (err) {
         console.error('Login failed:', err.response?.data || err.message);
         alert('Login failed. Please check your credentials.');
      } finally {
         // Clear the input fields
         setFormData({
            fullName: '',
            username: '',
            email: '',
            password: '',
         });
      }
   };

   const handleRegister = async (e) => {
      e.preventDefault();
      try {
         const res = await register(formData);
         console.log('Registration response:', res); // Log the full response

         // Check if the response contains a token
         if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token); // Store token in localStorage
            alert('Registration successful!');

            // Clear the input fields
            setFormData({
               fullName: '',
               username: '',
               email: '',
               password: '',
            });
         } else {
            throw new Error('Token not found in response');
         }
      } catch (err) {
         console.error('Registration failed:', err.response?.data || err.message);
         alert(err.response?.data?.message || 'Registration failed. Please try again.');
         // Clear the input fields
         setFormData({
            fullName: '',
            username: '',
            email: '',
            password: '',
         });
      }
   };

   const registerLink = () => setAction(' active');
   const loginLink = () => setAction('');

   return (
     <div className="containerbox">
      <div className={`wrapper${action}`}>
         {/* Login Form */}
         <div className="form-box login">
            <form onSubmit={handleLogin}>
               <h1>Login</h1>
               <div className="input-box">
                  <input
                     type="text"
                     placeholder="Username"
                     name="username"
                     value={formData.username}
                     onChange={handleChange}
                     required
                  />
                  <FaUser className="icon" />
               </div>
               <div className="input-box">
                  <input
                     type="password"
                     placeholder="Password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                  />
                  <FaLock className="icon" />
               </div>
               <div className="remember-forgot">
                  <label htmlFor=""><input type="checkbox" />Remember me</label>
                  Forgot Password
               </div>
               <button type="submit">Login</button>
               <div className="register-link">
                  <p>Don't have an account? <button type="button" className="link-button" onClick={registerLink}>Register</button></p>
               </div>
            </form>
         </div>

         {/* Register Form */}
         <div className="form-box register">
            <form onSubmit={handleRegister}>
               <h1>Registration</h1>
               <div className="input-box">
                  <input
                     type="text"
                     placeholder="Full Name"
                     name="fullName"
                     value={formData.fullName}
                     onChange={handleChange}
                     required
                  />
                  <FaUser className="icon" />
               </div>
               <div className="input-box">
                  <input
                     type="text"
                     placeholder="Username"
                     name="username"
                     value={formData.username}
                     onChange={handleChange}
                     required
                  />
                  <FaUser className="icon" />
               </div>
               <div className="input-box">
                  <input
                     type="email"
                     placeholder="Email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                  />
                  <FaEnvelope className="icon" />
               </div>
               <div className="input-box">
                  <input
                     type="password"
                     placeholder="Password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                  />
                  <FaLock className="icon" />
               </div>
               <div className="remember-forgot">
                  <label htmlFor="">
                     <input type="checkbox" /> I agree to the terms & conditions
                  </label>
               </div>
               <button type="submit">Register</button>
               <div className="register-link">
                  <p>Already have an account? <button type="button" className="link-button" onClick={loginLink}>Login</button></p>
               </div>
            </form>
         </div>
      </div>
      </div>
   );
};

export default LoginRegister;