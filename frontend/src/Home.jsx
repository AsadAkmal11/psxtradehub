import React from 'react';
import { NavLink } from 'react-router-dom';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className="home-container">
      <h2>Welcome, {user?.username || 'User'}!</h2>
      {/* <nav className="main-nav">
        { user && user.role === 'admin' && (
          <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Upload File
          </NavLink>
        )}
        <NavLink to="/watchlist" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Watchlist
        </NavLink>
        <NavLink to="/customer-portfolio" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Customer/Portfolio
        </NavLink>
      </nav> */}
      <hr/>
      {/* <p style={{marginTop: '2rem'}}></p> */}
    </div>
  );
}

export default Home; 