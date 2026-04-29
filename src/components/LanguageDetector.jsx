import React, { useState, useEffect } from "react";

export const LanguageDetector = ({ detectedLanguage, onDetect }) => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [confidence, setConfidence] = useState(0);

    const detectLanguage = async () => {
        setIsDetecting(true);
        setConfidence(0);

        // Simulate language detection processing
        for (let i = 0; i <= 100; i += 10) {
            setConfidence(i);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Simulated detection result
        const languages = [
            { code: "nepali", name: "नेपाली Nepali", emoji: "🇳🇵" },
            { code: "hindi", name: "हिन्दी Hindi", emoji: "🇮🇳" },
            { code: "english", name: "English", emoji: "🇺🇸" }
        ];
        const randomLang = languages[Math.floor(Math.random() * languages.length)];

        onDetect(randomLang);
        setIsDetecting(false);
    };

    return (
        <div className="detection-card">
            <h3>🔍 Language Detection</h3>
            <p style={{ fontSize: "13px", opacity: 0.8, marginTop: "8px" }}>
                Analyze audio to identify Nepali, Hindi, or English content
            </p>

            {detectedLanguage ? (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <div className="language-badge lang-english">
                        {detectedLanguage.emoji} {detectedLanguage.name}
                    </div>
                    <p style={{ fontSize: "12px", marginTop: "8px", opacity: 0.7 }}>
                        Confidence: {confidence}%
                    </p>
                    <button 
                        className="btn-secondary"
                        style={{ marginTop: "12px", fontSize: "12px", padding: "8px 16px" }}
                        onClick={() => onDetect(null)}
                    >
                        Re-detect
                    </button>
                </div>
            ) : (
                <button
                    className={`btn-primary${
                        isDetecting ? " processing" : ""
                    }`}
                    onClick={detectLanguage}
                    disabled={isDetecting}
                    style={{ marginTop: "12px" }}
                >
                    {isDetecting ? (
                        <>
                            <span className="spinner" style={{ marginRight: "8px" }}></span>
                            Detecting... {confidence}%
                        </>
                    ) : (
                        "🔍 Detect Language"
                    )}
                </button>
            )}
        </div>
    );
};