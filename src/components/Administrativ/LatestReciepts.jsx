import React, { useState, useEffect, useRef } from "react";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import axios from "axios";
import Logo from "./black.png"; // Pfad zum Logo
import ReceiptPDF from "./ReceiptPDF";



const LastReceiptViewer = () => {
  const [lastReceipt, setLastReceipt] = useState(null);
  const pdfContainerRef = useRef(null);
  const API_BASE_URL = "https://tbsdigitalsolutionsbackend.onrender.com/api/payment";

  useEffect(() => {
    const fetchLastReceipt = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Kein Token vorhanden!");
          return;
        }
  
        const response = await axios.get(`${API_BASE_URL}/latest-receipt`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setLastReceipt(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der letzten Quittung:", error);
      }
    };
  
    fetchLastReceipt();
  }, []);
  

  const printPDF = async () => {
    if (!lastReceipt) return;
    const blob = await pdf(<ReceiptPDF receipt={lastReceipt} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Quittung.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!lastReceipt) {
    return <p>Lade letzte Quittung...</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        id="pdf-container"
        ref={pdfContainerRef}
        style={{
          width: "100%",
          height: "600px",
          overflowY: "auto",
        }}
      >
        <PDFViewer width="100%" height="100%">
          <ReceiptPDF receipt={lastReceipt} />
        </PDFViewer>
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={printPDF}
      >
        Drucken
      </button>
    </div>
  );
};

export default LastReceiptViewer;
