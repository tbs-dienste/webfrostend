import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InventurDifferenzen = () => {
  const { inventurId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDiff = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/inventur/${inventurId}/differenzen`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Fehler beim Laden der Differenzen");
      }
    };
    fetchDiff();
  }, [inventurId]);

  if (!data) return <p className="p-6">Lade...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Differenzen Inventur {inventurId}</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Artikel</th>
            <th className="p-2">Soll</th>
            <th className="p-2">Ist</th>
            <th className="p-2">Differenz</th>
            <th className="p-2">Preis</th>
            <th className="p-2">Wert</th>
          </tr>
        </thead>
        <tbody>
          {data.differenzen.map((d, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{d.article_number}</td>
              <td className="p-2">{d.soll}</td>
              <td className="p-2">{d.ist}</td>
              <td className="p-2">{d.differenz}</td>
              <td className="p-2">{d.preis} €</td>
              <td className="p-2">{d.wert} €</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 font-semibold">
        Gesamtbestand: {data.gesamtBestand} | Gesamtwert: {data.gesamtWert} €
      </div>
    </div>
  );
};

export default InventurDifferenzen;
