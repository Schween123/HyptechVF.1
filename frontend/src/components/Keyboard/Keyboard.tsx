import React from 'react';
import './Keyboard.css'; // Import CSS for animation

type KeyboardProps = {
  onKeyPress: (key: string) => void;
  onClose: () => void;
};

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onClose }) => {
  const keys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace',
    '.', ',', 'Enter', 'Space',  // Added Enter key
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'Space') {
      onKeyPress(' '); // Add a space character
    } else if (key === 'Enter') {
      onKeyPress('Enter'); // Trigger Enter key action
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {keys.map((key) => (
          <button
            key={key}
            className={`key ${key === 'Space' ? 'space-key' : ''} ${key === 'Enter' ? 'enter-key' : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            {key === 'Space' ? ' ' : key}
          </button>
        ))}
      </div>
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default Keyboard;
