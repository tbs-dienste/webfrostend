
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiSave,
    FiArrowLeft,
    FiDollarSign,
    FiUser,
    FiCalendar,
    FiFileText,
    FiCreditCard,
    FiUpload
} from "react-icons/fi";

import "./CreateIncome.scss";


const CreateIncome = () => {


const navigate = useNavigate();



const [formData,setFormData] = useState({

date:"",
customer:"",
category:"Dienstleistung",
description:"",
amount:"",
vatRate:"8.1",
paymentMethod:"Banküberweisung",
account:"Bank",
document:"",
notes:""

});





const handleChange = (e)=>{


setFormData({

...formData,

[e.target.name]:e.target.value

});


};






const handleSubmit = async(e)=>{


e.preventDefault();



try{


await fetch(
"http://localhost:4000/api/income",
{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(formData)

}

);



navigate("/buchhaltung/einnahmen");


}

catch(error){

console.error(error);

}


};








return (

<div className="create-income">



<header className="page-header">


<div>

<h1>
Neue Einnahme
</h1>


<p>
Eine neue Einnahmenbuchung erfassen
</p>


</div>



<button
onClick={()=>navigate(-1)}
>

<FiArrowLeft/>

Zurück

</button>


</header>









<form 
className="income-form"
onSubmit={handleSubmit}
>



<div className="form-grid">





<div className="form-card">


<h2>
Grunddaten
</h2>




<div className="input-group">


<label>
Datum
</label>


<div className="input-icon">

<FiCalendar/>


<input

type="date"

name="date"

value={formData.date}

onChange={handleChange}

/>


</div>


</div>





<div className="input-group">


<label>
Kunde / Quelle
</label>


<div className="input-icon">

<FiUser/>


<input

type="text"

name="customer"

placeholder="z.B. Muster AG"

value={formData.customer}

onChange={handleChange}

/>


</div>


</div>






<div className="input-group">


<label>
Kategorie
</label>


<select

name="category"

value={formData.category}

onChange={handleChange}

>


<option>
Dienstleistung
</option>


<option>
Produktverkauf
</option>


<option>
Abo
</option>


<option>
Sonstiges
</option>


</select>


</div>






<div className="input-group">


<label>
Beschreibung
</label>


<div className="input-icon">


<FiFileText/>


<input

type="text"

name="description"

placeholder="Beschreibung der Einnahme"

value={formData.description}

onChange={handleChange}

/>


</div>


</div>



</div>









<div className="form-card">


<h2>
Finanzen
</h2>





<div className="input-group">


<label>
Betrag CHF
</label>


<div className="input-icon">


<FiDollarSign/>


<input

type="number"

name="amount"

placeholder="0.00"

value={formData.amount}

onChange={handleChange}

/>


</div>


</div>






<div className="input-group">


<label>
MwSt.
</label>


<select

name="vatRate"

value={formData.vatRate}

onChange={handleChange}

>


<option value="8.1">
8.1 %
</option>


<option value="2.6">
2.6 %
</option>


<option value="0">
0 %

</option>


</select>


</div>







<div className="input-group">


<label>
Zahlungsart
</label>


<div className="input-icon">


<FiCreditCard/>


<select

name="paymentMethod"

value={formData.paymentMethod}

onChange={handleChange}

>


<option>
Banküberweisung
</option>


<option>
Bar
</option>


<option>
Karte
</option>


<option>
TWINT
</option>


</select>


</div>


</div>







<div className="input-group">


<label>
Buchungskonto
</label>


<select

name="account"

value={formData.account}

onChange={handleChange}

>


<option>
Bank
</option>


<option>
Kasse
</option>


<option>
Kreditkarte
</option>


</select>


</div>



</div>








<div className="form-card">


<h2>
Beleg & Notizen
</h2>





<div className="upload">


<FiUpload/>


<input

type="file"

/>


</div>







<div className="input-group">


<label>
Notizen
</label>


<textarea

name="notes"

value={formData.notes}

onChange={handleChange}

placeholder="Interne Notizen..."

>


</textarea>


</div>



</div>






</div>








<button 
className="save-button"
type="submit"
>


<FiSave/>

Einnahme speichern


</button>






</form>






</div>


);


};


export default CreateIncome;
