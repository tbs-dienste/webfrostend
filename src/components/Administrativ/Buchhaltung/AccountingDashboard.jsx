import React from "react";
import { Link } from "react-router-dom";

import {
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiFileText,
  FiCreditCard,
  FiRepeat,
  FiDollarSign,
  FiPercent,
  FiAlertTriangle,
  FiPieChart,
  FiBell,
  FiPlus,
  FiMinus,
  FiUserPlus,
  FiCalendar,
  FiUpload,
  FiDownload,
  FiArrowUpCircle,
  FiArrowDownCircle
} from "react-icons/fi";

import "./AccountingDashboard.scss";


const AccountingDashboard = () => {


const kpis = [
{
title:"Umsatz",
value:"CHF 48'250",
info:"Dieser Monat",
icon:<FiTrendingUp/>,
link:"/buchhaltung/einnahmen"
},

{
title:"Ausgaben",
value:"CHF 12'800",
info:"Dieser Monat",
icon:<FiTrendingDown/>,
link:"/buchhaltung/ausgaben"
},

{
title:"Gewinn",
value:"CHF 35'450",
info:"Gewinnmarge 73%",
icon:<FiBarChart2/>,
link:"/buchhaltung/gewinn"
},

{
title:"Offene Rechnungen",
value:"18",
info:"CHF 16'900 offen",
icon:<FiFileText/>,
link:"/buchhaltung/rechnungen"
}

];



const modules = [

{
title:"Einnahmen",
description:"Umsätze und Zahlungseingänge verwalten",
icon:<FiArrowUpCircle/>,
link:"/buchhaltung/einnahmen"
},

{
title:"Ausgaben",
description:"Kosten und Belege erfassen",
icon:<FiArrowDownCircle/>,
link:"/buchhaltung/ausgaben"
},

{
title:"Rechnungen",
description:"Erstellen, senden und verwalten",
icon:<FiFileText/>,
link:"/buchhaltung/rechnungen"
},

{
title:"Zahlungen",
description:"Transaktionen kontrollieren",
icon:<FiCreditCard/>,
link:"/buchhaltung/zahlungen"
},

{
title:"Abos",
description:"Wiederkehrende Einnahmen",
icon:<FiRepeat/>,
link:"/buchhaltung/abos"
},

{
title:"Bank & Kasse",
description:"Konten und Bewegungen",
icon:<FiDollarSign/>,
link:"/buchhaltung/bank"
},

{
title:"Steuern",
description:"MwSt. und Vorsteuer",
icon:<FiPercent/>,
link:"/buchhaltung/steuern"
},

{
title:"Mahnungen",
description:"Offene Forderungen",
icon:<FiAlertTriangle/>,
link:"/buchhaltung/mahnungen"
},


{
title:"Berichte",
description:"Finanzanalysen und Statistiken",
icon:<FiPieChart/>,
link:"/buchhaltung/berichte"
}

];



const actions = [

{
title:"Neue Rechnung",
icon:<FiPlus/>,
link:"/buchhaltung/rechnungen/create"
},

{
title:"Neue Ausgabe",
icon:<FiMinus/>,
link:"/buchhaltung/ausgaben/create"
},

{
title:"Zahlung buchen",
icon:<FiCreditCard/>,
link:"/buchhaltung/zahlungen/create"
},

{
title:"Neues Abo",
icon:<FiRepeat/>,
link:"/buchhaltung/abos/create"
},

{
title:"Neuer Kunde",
icon:<FiUserPlus/>,
link:"/kunden/create"
},

{
title:"Monatsabschluss",
icon:<FiCalendar/>,
link:"/buchhaltung/abschluss"
},

{
title:"Bank Import",
icon:<FiUpload/>,
link:"/buchhaltung/import"
},

{
title:"Export",
icon:<FiDownload/>,
link:"/buchhaltung/export"
}

];



return (

<div className="accounting-dashboard">


<header className="dashboard-header">

<div>

<h1>
Buchhaltung
</h1>

<p>
Finanzübersicht und Unternehmenszahlen
</p>

</div>


<Link 
to="/buchhaltung/rechnungen/create"
className="main-button"
>

<FiPlus/>
Neue Rechnung

</Link>


</header>





<section className="kpi-grid">


{
kpis.map((item,index)=>(

<Link
to={item.link}
className="kpi-card"
key={index}
>


<div className="icon">

{item.icon}

</div>


<div>

<h3>
{item.title}
</h3>


<strong>
{item.value}
</strong>


<p>
{item.info}
</p>


</div>


</Link>

))
}


</section>





<section className="module-section">


<h2>
Buchhaltung Module
</h2>


<div className="module-grid">


{
modules.map((item,index)=>(


<Link
to={item.link}
className="module-card"
key={index}
>


<div className="module-icon">

{item.icon}

</div>


<div>

<h3>
{item.title}
</h3>


<p>
{item.description}
</p>


</div>


</Link>


))
}


</div>


</section>






<section className="bottom-grid">


<div className="panel">


<h2>
🔔 Hinweise
</h2>


<div className="notice">
<FiBell/>
3 Rechnungen sind überfällig
</div>


<div className="notice">
<FiAlertTriangle/>
MwSt. Abrechnung steht bevor
</div>


<div className="notice">
<FiCalendar/>
2 Abos werden verlängert
</div>


</div>





<div className="panel">


<h2>
⚡ Schnellaktionen
</h2>


<div className="actions">


{
actions.map((item,index)=>(


<Link
to={item.link}
key={index}
>

{item.icon}

<span>
{item.title}
</span>


</Link>


))
}


</div>


</div>


</section>





</div>

);


};


export default AccountingDashboard;