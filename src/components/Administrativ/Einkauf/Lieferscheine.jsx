import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Lieferscheine.scss";

export default function Lieferscheine() {
  const [lieferscheine, setLieferscheine] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Token aus localStorage
  const token = localStorage.getItem("token");

  // Axios Instance mit Token
  const api = axios.create({
    baseURL: "https://tbsdigitalsolutionsbackend.onrender.com/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await api.get("/lieferschein");
        setLieferscheine(res.data?.data || []);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Fehler beim Laden der Lieferscheine");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) return <p>Lieferscheine werden geladen...</p>;

  return (
    <div className="ls-list">
      <div className="ls-list__header">
        <h2 className="ls-list__title">Alle Lieferscheine</h2>
      </div>

      <div className="ls-card">
        <table className="ls-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Lieferscheinnr</th>
              <th>Auftragsnr</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {lieferscheine.map((ls, index) => (
              <tr key={ls.id}>
                <td>{index + 1}</td>
                <td>{ls.lieferschein_nr}</td>
                <td>{ls.auftragsnummer}</td>
                <td>
                  <Link to={`/lieferschein/${ls.lieferschein_nr}`}>
                    <button className="ls-btn ls-btn--view">Ansehen</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
