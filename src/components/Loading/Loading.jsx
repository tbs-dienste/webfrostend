import React from 'react';
import loadingGif from './loadingani.gif'; // Pfad zum GIF anpassen
import './Loading.scss'; // Importiere die SCSS-Datei

const Loading = () => {
  return (
    <div className="loading-container">
      <img src={loadingGif} alt="Loading..." />
    </div>
  );
};

export default Loading;
