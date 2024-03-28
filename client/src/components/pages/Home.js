import React from 'react';
import "../style/home.css";

export const Home = () => {
     return (
          <div className="home">
      <header className="header">
        <h1>Welcome to URL Shortener</h1>
        <p>Shorten your URLs and manage your links with ease!</p>
      </header>
      <section className="features">
        <h2>Features</h2>
        <div className="feature">
          <h3>URL Shortening</h3>
          <p>Quickly shorten long URLs into more manageable links.</p>
        </div>
        <div className="feature">
          <h3>Link Analytics</h3>
          <p>Track click counts, referrers, and user locations for each shortened link.</p>
        </div>
        <div className="feature">
          <h3>User Authentication</h3>
          <p>Secure login and registration system for managing your links.</p>
        </div>
        <div className="feature">
          <h3>Dashboard</h3>
          <p>Manage your shortened links and view link analytics in one place.</p>
        </div>
      </section>
      <section className="call-to-action">
        <h2>Ready to get started?</h2>
        <p>Sign up or log in now to begin shortening your URLs!</p>
        {/* Add buttons for login and sign up */}
        <div className="cta-buttons">
          <button className="btn-signup">Sign Up</button>
          <button className="btn-login">Log In</button>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 URL Shortener. All rights reserved.</p>
      </footer>
    </div>
  );
};