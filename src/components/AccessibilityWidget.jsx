import React, { useState, useEffect } from 'react';
import '../styles/AccessibilityWidget.css'
import Weather from '../components/weather';

function AccessibilityWidget({ isDarkMode, setIsDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);

    <p> opened </p>

    const handleWidgetClick = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <div className>
            <div className="accessibility-widget" onClick={handleWidgetClick}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ fill: 'white' }} viewBox="0 0 24 24" width="30px" height="30px">
                    <path d="M0 0h24v24H0V0z" fill="none"></path>
                    <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                </svg>
            </div>

            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>
                            &times;
                        </span>

                        <h2> Weather </h2>
                        <Weather/>

                        <h2>Accessibility Options</h2>
                        <button onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                        {/* Add more buttons or switches as needed */}
                    </div>
                </div>
            )}
        </div>
    );
}


export default AccessibilityWidget;
