import React from "react";

import "./Home.css";

export const Home = () => {
    return (
        <div className="home-welcome">
            <div className="display">
                <h2>AutoCaption Pro</h2>
                <p>Automated captioning for Nepali, Hindi & English</p>
                <p className="status-ready">🎬 Ready to process timeline audio</p>
            </div>
        </div>
    );
};
