import React, { useState } from 'react';
import './Team.scss'; // Import des SCSS-Stylesheets
import musterbild from './musterbild.jpg'; // Import des Musterfotos
import timo from './timo.jpg';

function Team() {
    const [searchTerm, setSearchTerm] = useState('');
    const teamMembers = [
        { id: 1, firstName: 'Klaus', lastName: 'Steiner', email: 'klaus.steiner@tbsolutions.com', role: 'Inhaber' },
        { id: 2, firstName: 'Laura', lastName: 'Binder', email: 'laura.binder@tbsolutions.com', role: 'Co-Inhaberin' },
        { id: 3, firstName: 'Michael', lastName: 'Schmidt', email: 'michael.schmidt@tbsolutions.com', role: 'Projektmanager' },
        { id: 4, firstName: 'Timo', lastName: 'Buchmeier', email: 'timo.buchmeier@tbsolutions.com', image: timo, role: 'Entwickler' },
        { id: 5, firstName: 'Sarah', lastName: 'Müller', email: 'sarah.mueller@tbsolutions.com', role: 'Designer' },
        { id: 6, firstName: 'Max', lastName: 'Schulz', email: 'max.schulz@tbsolutions.com', role: 'Marketingexperte' },
        { id: 7, firstName: 'Julia', lastName: 'Wagner', email: 'julia.wagner@tbsolutions.com', role: 'Kundenbetreuerin' },
        { id: 8, firstName: 'Daniel', lastName: 'Hoffmann', email: 'daniel.hoffmann@tbsolutions.com', role: 'Finanzmanager' },
        { id: 9, firstName: 'Lisa', lastName: 'Kaiser', email: 'lisa.kaiser@tbsolutions.com', role: 'Entwickler' },
        { id: 10, firstName: 'Stefan', lastName: 'Wolf', email: 'stefan.wolf@tbsolutions.com', role: 'Projektmanager' },
        { id: 11, firstName: 'Anna', lastName: 'Fischer', email: 'anna.fischer@tbsolutions.com', role: 'Designer' },
        { id: 12, firstName: 'Markus', lastName: 'Herrmann', email: 'markus.herrmann@tbsolutions.com', role: 'Marketingexperte' },
        { id: 13, firstName: 'Carina', lastName: 'Schneider', email: 'carina.schneider@tbsolutions.com', role: 'Kundenbetreuerin' },
        { id: 14, firstName: 'Andreas', lastName: 'Krause', email: 'andreas.krause@tbsolutions.com', role: 'Finanzmanager' },
        { id: 15, firstName: 'Julian', lastName: 'Becker', email: 'julian.becker@tbsolutions.com', role: 'Entwickler' },
        { id: 16, firstName: 'Monika', lastName: 'Bauer', email: 'monika.bauer@tbsolutions.com', role: 'Projektmanager' },
        { id: 17, firstName: 'Martin', lastName: 'Hoffmann', email: 'martin.hoffmann@tbsolutions.com', role: 'Designer' },
        { id: 18, firstName: 'Sandra', lastName: 'Weber', email: 'sandra.weber@tbsolutions.com', role: 'Marketingexperte' },
        { id: 19, firstName: 'Sebastian', lastName: 'Klein', email: 'sebastian.klein@tbsolutions.com', role: 'Kundenbetreuer' },
        { id: 20, firstName: 'Nadine', lastName: 'Schwarz', email: 'nadine.schwarz@tbsolutions.com', role: 'Finanzmanager' },
    ];

    const filteredMembers = teamMembers.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="team-container">
            <h1 className="team-title">Unser Team</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Suche nach Namen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <ul className="team-list">
                {filteredMembers.map(member => (
                    <li key={member.email} className="team-member">
                        <img src={member.image || musterbild} alt={`${member.firstName} ${member.lastName}`} className="member-image" />
                        <div className="member-details">
                            <p className="member-name">{`${member.firstName} ${member.lastName}`}</p>
                            <p className="member-role">{member.role}</p>
                            <p className="member-email">{member.email ? <a href={`mailto:${member.email}`}>Mail</a> : null}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Team;
