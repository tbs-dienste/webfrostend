import React, { useState } from 'react';
import './Keyboard.scss';

const Keyboard = ({ onKeyPress }) => {
  const [shift, setShift] = useState(false);

  const handleKeyPress = (key) => {
    if (key === 'SHIFT') return setShift(!shift);
    if (key === 'TAB') return onKeyPress('\t');
    if (key === 'DELETE') return onKeyPress('DELETE');
    if (key === 'ENTER') return onKeyPress('ENTER');
    if (key === 'SPACE') return onKeyPress(' ');

    const char = shift && key.length === 1 ? key.toUpperCase() : key;
    onKeyPress(char);
  };

  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '+'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', '#'],
    ['<', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'],
  ];

  return (
    <div className="keyboard-container">
      <div className="keyboard-rows">
        {keys.map((row, index) => (
          <div className="keyboard-row" key={index}>
            {row.map((key) => (
              <button key={key} className="keyboard-key" onClick={() => handleKeyPress(key)}>
                {shift && key.length === 1 ? key.toUpperCase() : key}
              </button>
            ))}
          </div>
        ))}
        <div className="keyboard-row">
          <button className="keyboard-key action" onClick={() => handleKeyPress('TAB')}>Tab</button>
          <button className="keyboard-key action" onClick={() => handleKeyPress('SPACE')}>Leerzeichen</button>
          <button
            className={`keyboard-key action ${shift ? 'active' : ''}`}
            onClick={() => handleKeyPress('SHIFT')}
          >
            Shift
          </button>
          <button className="keyboard-key action delete" onClick={() => handleKeyPress('DELETE')}>Löschen</button>
          <button className="keyboard-key action enter" onClick={() => handleKeyPress('ENTER')}>Enter</button>
        </div>
      </div>

    </div>
  );
};

export default Keyboard;
