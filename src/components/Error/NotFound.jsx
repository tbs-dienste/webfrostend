import React from 'react';
import './NotFound.scss';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Oops! Die Seite wurde nicht gefunden.</p>
      </div>
    </div>
  );
};

export default NotFound;
