import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllProducts.scss';

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Kein Token gefunden.');
      return;
    }

    axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setProducts(res.data.data);
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Produkte:', err);
    });
  }, []);

  return (
    <div className="all-products-wrapper">
      <h2 className="all-products-title">Produktübersicht</h2>
      <div className="all-products-table-wrapper">
        <table className="all-products-table">
          <thead>
            <tr>
              <th>Artikel-Nr</th>
              <th>Bezeichnung</th>
              <th>Barcode</th>
              <th>Preis (CHF)</th>
              <th>Lagerbestand</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.article_number}>
                <td>{product.article_number}</td>
                <td>{product.article_short_text}</td>
                <td>{product.barcode}</td>
                <td>{parseFloat(product.price).toFixed(2)}</td>
                <td>{product.current_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts;
