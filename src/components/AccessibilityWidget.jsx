import React from 'react'
import '../styles/AccessibilityWidget.css'

function AccessibilityWidget() {
    const handleWidgetClick = () => {
        //Add functionality when the widget is clicked
        //maybe opening a modal to display a tooltip

        alert("Accessibility options coming soon!");
    };

    return (
        <div className="accessibility-widget" onClick={handleWidgetClick}>
            ?
        </div>
    );
}

export default AccessibilityWidget;