import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { register, login } from './api'; // Ensure this path is correct
import './LoginRegister.css';

const LoginRegister = () => {
   const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
   });
   const [action, setAction] = useState('');

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const res = await login(formData);
         console.log('Login successful:', res.data.token);
         localStorage.setItem('token', res.data.token);
         alert('Login successful!');
      } catch (err) {
         console.error('Login failed:', err.response?.data || err.message);
         alert('Login failed. Please check your credentials.');
      }
   };

   const handleRegister = async (e) => {
      e.preventDefault();
      try {
         const res = await register(formData);
         console.log('Registration successful:', res.data.token);
         localStorage.setItem('token', res.data.token);
         alert('Registration successful!');
      } catch (err) {
         console.error('Registration failed:', err.response?.data || err.message);
         alert('Registration failed. Please try again.');
      }
   };

   const registerLink = () => setAction(' active');
   const loginLink = () => setAction('');

   return (
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
                  <a href="#">Forgot Password</a>
               </div>
               <button type="submit">Login</button>
               <div className="register-link">
                 <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
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
                  <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
               </div>
            </form>
         </div>
      </div>
   );
};

export default LoginRegister;