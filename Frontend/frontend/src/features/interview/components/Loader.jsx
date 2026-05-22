import React from 'react';
import './loader.scss';

const Loader = ({ text = "Generating your AI Resume PDF..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loader-text">{text}</p>
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
