// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';

import Home from './components/Home/Home';

import Login from './components/Login/Login';
import Dienstleistungen from './components/Dienstleistung/Dienstleistungen';
import ServiceDetail from './components/ServiceDetail/ServiceDetail';
import TimeTracker from './components/Zeiterfassung/TimeTracker';
import KundeErfassen from './components/Kunden/KundeErfassen';
import Rechnung from './components/Rechnung/Rechnung';
import Kunden from './components/Kunden/Kunden';
import Dankesnachricht from './components/Kunden/Dankesnachricht';


const isAdmin = localStorage.getItem('isAdmin');

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />

          <Route
            path="/dankesnachricht"
            element={
              <>
                <Navbar />
                <Dankesnachricht />
              </>
            }
          />

          <Route
            path="/dienstleistungen"
            element={
              <>
                <Navbar />
                <Dienstleistungen />
              </>
            }
          />
          <Route
            path="/zeiterfassung/:id"
            element={
              <>
                <Navbar />
                <TimeTracker />

              </>
            }
          />

<Route
            path="/rechnung/:id"
            element={
              <>
                <Navbar />
                <Rechnung />

              </>
            }
          />


         

          <Route
            path="/kunden"
            element={
              <>
                <Navbar />
                <Kunden />
              </>
            }
          />

          <Route
            path="/kundeerfassen"
            element={
              <>
                <Navbar />
                <KundeErfassen />
              </>
            }
          />



          <Route path="/service/:id" element={<ServiceDetail />} />



          {isAdmin ? (
            <Route
              path="/anmeldungen"
              element={
                <>
                  <Navbar />

                </>
              }
            />
          ) : (
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <Login />
                </>
              }
            />
          )}

        </Routes>
      </Router>
    </div>
  );
}

export default App;
