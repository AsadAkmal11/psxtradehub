import React from 'react';

function BackButton({ onBack }) {
  return (
    <button onClick={onBack} className="back-btn">
      &larr; Back
    </button>
  );
}

export default BackButton; 