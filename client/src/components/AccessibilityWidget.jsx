import React, { useState } from 'react';
import '../styles/AccessibilityWidget.css';
import '../styles/AccessibilityWidget_HC.css';
import TranslateWidget from '../components/TranslateWidget';

/**
 * AccessibilityWidget Component - Provides accessibility options for Mo's Irish Pub website.
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isHighContrast - Indicates whether high contrast mode is enabled.
 * @param {function} props.setHighContrast - Function to toggle high contrast mode.
 * @returns {JSX.Element} - Rendered component.
 */
function AccessibilityWidget({ isHighContrast, setHighContrast }) {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Handles the click event on the accessibility widget.
     */
    const handleWidgetClick = () => {
        setIsOpen(true);
    };

    /**
     * Closes the accessibility options modal.
     */
    const handleCloseModal = () => {
        setIsOpen(false);
    };

    /**
     * Render function for the AccessibilityWidget component.
     * @returns {JSX.Element} - Rendered component.
     */
    return (
        <div>
            <div className={"accessibility-widget" + (isHighContrast ? "-HC" : "")} onClick={handleWidgetClick}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ fill: 'white' }} viewBox="0 0 24 24" width="30px" height="30px">
                    <path d="M0 0h24v24H0V0z" fill="none"></path>
                    <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                </svg>
            </div>

            {isOpen && (
                <div className={"modal" + (isHighContrast ? "-HC" : "")}>
                    <div className={"modal-content" + (isHighContrast ? "-HC" : "")}>
                        <span className={"close-button" + (isHighContrast ? "-HC" : "")} onClick={handleCloseModal}>
                            &times;
                        </span>
                        <h2>Accessibility Options</h2>
                        <p className={"hoverTextNotice" + (isHighContrast ? "-HC" : "")}><i>Having trouble reading text?</i></p>
                        <p className={"hoverTextNotice" + (isHighContrast ? "-HC" : "")}><i>Mouse over it to expand it!</i></p>
                        <button onClick={() => setHighContrast(!isHighContrast)}>
                            {isHighContrast ? "Normal Mode" : "High Contrast Mode"}
                        </button>
                        <TranslateWidget />
                    </div>
                </div>
            )}

        </div>
    );
}

export default AccessibilityWidget;
