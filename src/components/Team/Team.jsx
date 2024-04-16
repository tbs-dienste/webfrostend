import React from 'react';
import './Team.scss'; // Import des SCSS-Stylesheets
import timo from './timo.jpg';
import musterbild from './musterbild.jpg'; // Import des Musterfotos

function Team() {
    const teamMembers = [
        { id: 1, firstName: 'Klaus', lastName: 'Steiner', email: 'klaus.steiner@tbsolutions.com', role: 'Inhaber' },
        { id: 2, firstName: 'Laura', lastName: 'Binder', email: 'laura.binder@tbsolutions.com', role: 'Co-Inhaberin' },
        { id: 3, firstName: 'Michael', lastName: 'Schmidt', email: 'michael.schmidt@tbsolutions.com',  role: 'Projektmanager' },
        { id: 4, firstName: 'Timo', lastName: 'Buchmeier', email: 'timo.buchmeier@tbsolutions.com',  role: 'Entwickler' },
      ];

  return (
    <div className="team-container">
      <h1 className="team-title">Unser Team</h1>
      <ul className="team-list">
        {teamMembers.map(member => (
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
