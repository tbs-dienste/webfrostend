import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiEye,
    FiEdit,
    FiTrash2,
    FiTrendingUp,
    FiDollarSign,
    FiFileText,
    FiDownload
} from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./GetAllIncome.scss";

const sampleIncome = [
    {
      id: 1,
      date: "27.07.2026",
      document_number: "RE-2026-0001",
      customer: "Restaurant Langhaus",
      category: "service",
      description: "Webseite erstellt",
      amount: "2'450.00",
      payment_method: "Banküberweisung",
    },
    {
      id: 2,
      date: "26.07.2026",
      document_number: "RE-2026-0002",
      customer: "Wegmühle Apotheke",
      category: "service",
      description: "Hosting Premium",
      amount: "249.00",
      payment_method: "Kreditkarte",
    },
    {
      id: 3,
      date: "24.07.2026",
      document_number: "RE-2026-0003",
      customer: "",
      category: "product",
      description: "Softwarelizenz",
      amount: "890.00",
      payment_method: "TWINT",
    },
    {
      id: 4,
      date: "22.07.2026",
      document_number: "RE-2026-0004",
      customer: "Müller AG",
      category: "subscription",
      description: "Cloud Hosting",
      amount: "139.00",
      payment_method: "Lastschrift",
    },
    {
      id: 5,
      date: "20.07.2026",
      document_number: "RE-2026-0005",
      customer: "",
      category: "other",
      description: "Beratung",
      amount: "420.00",
      payment_method: "Bar",
    },
  ];
  
  const GetAllIncome = () => {
    const [income, setIncome] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
  
    useEffect(() => {
      loadIncome();
    }, []);
  
    const loadIncome = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/income");
  
        if (!response.ok) {
          throw new Error("API nicht erreichbar");
        }
  
        const data = await response.json();
  
        if (Array.isArray(data) && data.length > 0) {
          setIncome(data);
        } else {
          setIncome(sampleIncome);
        }
      } catch (err) {
        console.error(err);
        setIncome(sampleIncome);
      }
    };

    const exportPDF = () => {

        const doc = new jsPDF("p", "mm", "a4");
      
        const today = new Date().toLocaleDateString("de-CH");
      
        // Gesamtsumme berechnen
        const total = filteredIncome.reduce((sum, item) => {
      
          const value = parseFloat(
            String(item.amount)
              .replace(/'/g, "")
              .replace(",", ".")
          );
      
          return sum + (isNaN(value) ? 0 : value);
      
        }, 0);
      
        // Hintergrund Header
        doc.setFillColor(16, 185, 129);
        doc.rect(0, 0, 210, 35, "F");
      
        // Titel
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255);
        doc.setFontSize(22);
        doc.text("Einnahmenübersicht", 15, 18);
      
        doc.setFontSize(10);
        doc.text(`Exportiert am ${today}`, 15, 27);
      
        // Firmenname rechts
        doc.setFontSize(14);
        doc.text("TBS Solutions", 195, 18, { align: "right" });
      
        // Zusammenfassung
        doc.setTextColor(0);
        doc.setFontSize(12);
      
        doc.roundedRect(14, 42, 182, 25, 3, 3);
      
        doc.setFont("helvetica", "bold");
        doc.text("Zusammenfassung", 20, 50);
      
        doc.setFont("helvetica", "normal");
      
        doc.text(
          `Anzahl Buchungen: ${filteredIncome.length}`,
          20,
          59
        );
      
        doc.text(
          `Gesamteinnahmen: CHF ${total.toLocaleString("de-CH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          110,
          59
        );
      
        autoTable(doc, {
      
          startY: 75,
      
          head: [[
            "Datum",
            "Beleg",
            "Kunde",
            "Kategorie",
            "Beschreibung",
            "Zahlung",
            "Betrag"
          ]],
      
          body: filteredIncome.map(item => [
      
            item.date,
      
            item.document_number,
      
            item.customer || "Direkteinnahme",
      
            item.category,
      
            item.description,
      
            item.payment_method,
      
            `CHF ${item.amount}`
      
          ]),
      
          theme: "grid",
      
          styles: {
      
            fontSize: 9,
      
            cellPadding: 3,
      
            valign: "middle"
      
          },
      
          headStyles: {
      
            fillColor: [16,185,129],
      
            textColor: 255,
      
            fontStyle: "bold",
      
            halign: "center"
      
          },
      
          alternateRowStyles: {
      
            fillColor: [248,250,252]
      
          },
      
          columnStyles: {
      
            6: {
      
              halign: "right",
      
              fontStyle: "bold"
      
            }
      
          },
      
          margin: {
      
            left: 14,
      
            right: 14
      
          },
      
          didDrawPage: function (data) {
      
            const page = doc.getNumberOfPages();
      
            doc.setDrawColor(220);
      
            doc.line(
              14,
              286,
              196,
              286
            );
      
            doc.setFontSize(9);
      
            doc.setTextColor(120);
      
            doc.text(
              "TBS Solutions • Einnahmenübersicht",
              14,
              291
            );
      
            doc.text(
              `Seite ${page}`,
              196,
              291,
              { align: "right" }
            );
      
          }
      
        });
      
        doc.save(`Einnahmen_${today}.pdf`);
      
      };
  
    const filteredIncome = income.filter((item) => {
      const searchMatch =
        (item.customer || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());
  
      const categoryMatch =
        category === "all" || item.category === category;
  
      return searchMatch && categoryMatch;
    });


return (

<div className="income-page">


<header className="income-header">


<div>

<h1>
Einnahmen
</h1>


<p>
Verbuchte Einnahmen und Geldzuflüsse verwalten
</p>

</div>




<div className="header-actions">


<Link
to="/buchhaltung/einnahmen/create"
className="primary"
>

<FiPlus/>

Neue Einnahme

</Link>



<button onClick={exportPDF}>

    <FiDownload />

    Export PDF

</button>


</div>


</header>







<section className="stats">


<div className="stat-card">

<div className="icon green">
<FiTrendingUp/>
</div>


<div>

<span>
Gesamteinnahmen
</span>


<h2>
CHF 185'900
</h2>


</div>

</div>





<div className="stat-card">


<div className="icon">
<FiDollarSign/>
</div>


<div>

<span>
Dieser Monat
</span>


<h2>
CHF 24'500
</h2>


</div>


</div>





<div className="stat-card">


<div className="icon">
<FiFileText/>
</div>


<div>

<span>
Anzahl Buchungen
</span>


<h2>
126
</h2>


</div>


</div>



</section>









<section className="income-table">



<div className="toolbar">


<div className="search">


<FiSearch/>


<input

placeholder="Einnahmen suchen..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>


</div>





<div className="filter">


<FiFilter/>


<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

>


<option value="all">
Alle Kategorien
</option>


<option value="service">
Dienstleistung
</option>


<option value="product">
Produktverkauf
</option>


<option value="subscription">
Abo
</option>


<option value="other">
Sonstiges
</option>


</select>


</div>



</div>








<div className="table-wrapper">


<table>


<thead>

<tr>

<th>
Datum
</th>

<th>
Belegnummer
</th>


<th>
Kunde / Quelle
</th>


<th>
Kategorie
</th>


<th>
Beschreibung
</th>


<th>
Betrag
</th>


<th>
Zahlungsart
</th>


<th>
Aktion
</th>


</tr>


</thead>



<tbody>


{

filteredIncome.map(item => (


<tr key={item.id}>


<td>
{item.date}
</td>



<td>

<strong>
{item.document_number}
</strong>

</td>



<td>

{item.customer || "Direkteinnahme"}

</td>



<td>

<span className="badge">

{item.category}

</span>

</td>



<td>

{item.description}

</td>



<td className="amount">

CHF {item.amount}

</td>



<td>

{item.payment_method}

</td>





<td>


<div className="actions">


<Link
to={`/buchhaltung/einnahmen/${item.id}`}
>

<FiEye/>

</Link>



<Link
to={`/buchhaltung/einnahmen/edit/${item.id}`}
>

<FiEdit/>

</Link>




<button>

<FiTrash2/>

</button>


</div>


</td>



</tr>


))


}



</tbody>


</table>


</div>


</section>






</div>


);

};


export default GetAllIncome;
