import React, { useState } from 'react';
import './Keyboard.scss'; // Vergiss das nicht!

const Keyboard = ({ onKeyPress }) => {
  const [shift, setShift] = useState(false);

  const handleKeyPress = (key) => {
    if (key === 'SHIFT') return setShift(!shift);
    if (key === 'TAB') return onKeyPress('\t');
    if (key === 'DELETE') return onKeyPress('DELETE');
    if (key === 'ENTER') return onKeyPress('ENTER');
    if (key === 'SPACE') return onKeyPress('SPACE');

    const char = shift && key.length === 1 ? key.toUpperCase() : key;
    onKeyPress(char);
  };

  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '@'],
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '€'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', '$'],
    ['<', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', '#'],
  ];

  return (
    <div className="keyboard-container">
      <div className="keyboard-row top">
        <button onClick={() => handleKeyPress('DELETE')} className="key delete">DEL</button>
      </div>

      <div className="keyboard-keys">
        {keys.map((row, index) => (
          <div className="keyboard-row" key={index}>
            {row.map((key) => (
              <button key={key} onClick={() => handleKeyPress(key)} className="key">
                {shift && key.length === 1 ? key.toUpperCase() : key}
              </button>
            ))}
          </div>
        ))}

        <div className="keyboard-row bottom">
          <button onClick={() => handleKeyPress('TAB')} className="key tab">Tab</button>
          <button onClick={() => handleKeyPress('SPACE')} className="key space">Space</button>
          <button
            onClick={() => handleKeyPress('SHIFT')}
            className={`key shift ${shift ? 'active' : ''}`}
          >
            Shift
          </button>
          <button onClick={() => handleKeyPress('ENTER')} className="key enter">Enter</button>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
