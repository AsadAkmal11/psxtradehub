import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');
  useEffect(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  }, []);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      if(res.data){
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));

      //alert('Login successful!');
      console.log('Login success:', res.data);
      navigate('/home'); // Always go to home after login
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Login failed!');
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
        role,
      });

      alert('Signup successful! You can now log in.');
      console.log('Signup success:', res.data);
      setIsLogin(true);
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      alert('Signup failed!');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h1 className="login-title">PSX Trade Hub</h1>
        <div className="login-form">
          {!isLogin && (
            <div className="signup-extra">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <div className="email-buttons">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login-buttons">
            {isLogin ? (
              <button onClick={handleLogin}>Login</button>
            ) : (
              <button onClick={handleSignup}>Sign Up</button>
            )}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
