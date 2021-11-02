import React from 'react';
import fireExtinguisher from '../../assets/images/fire-extinguisher.png';

const Logo = () => {
  return (
    <div className="logo-container">
      <h1>fire-alarm </h1>
      <div
        className="logo"
        style={{ backgroundImage: `url(${fireExtinguisher})` }}
      />
    </div>
  );
};

export default Logo;
