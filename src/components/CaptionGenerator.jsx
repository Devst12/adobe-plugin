import React, { useState, useEffect } from "react";

export const CaptionGenerator = ({ captions, language }) => {
    const [generationStatus, setGenerationStatus] = useState("idle"); // idle, generating, complete
    const [currentCaption, setCurrentCaption] = useState("");

    useEffect(() => {
        if (captions && captions.length > 0) {
            setGenerationStatus("complete");
        } else {
            setGenerationStatus("idle");
        }
    }, [captions]);

    const simulateCaptionGeneration = async () => {
        setGenerationStatus("generating");
        
        const sampleCaptions = [
            { start: "00:00:01:00", end: "00:00:04:12", text: "नमस्ते दोस्तों, आज हम बात करेंगे" },
            { start: "00:00:04:12", end: "00:00:08:00", text: "about new features in Premiere Pro." },
            { start: "00:00:08:00", end: "00:00:12:00", text: "यह एक बहुत ही रोमांचक अपडेट है।" },
            { start: "00:00:12:00", end: "00:00:15:12", text: "Let's dive into the timeline." }
        ];

        for (let i = 0; i < sampleCaptions.length; i++) {
            setCurrentCaption(sampleCaptions[i].text);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        setGenerationStatus("complete");
    };

    const formatLanguageName = (lang) => {
        if (!lang) return "Unknown";
        return lang.name || lang;
    };

    return (
        <div className="caption-list">
            <h3>📝 Caption Generator</h3>
            
            {language && (
                <div style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(52, 152, 219, 0.1)",
                    marginBottom: "12px",
                    fontSize: "13px"
                }}>
                    Target Language: <strong>{formatLanguageName(language)}</strong>
                </div>
            )}

            <button
                className={`btn-primary${
                    generationStatus === "generating" ? " processing" : ""
                }`}
                onClick={simulateCaptionGeneration}
                disabled={generationStatus === "generating"}
                style={{ width: "100%", marginBottom: "12px" }}
            >
                {generationStatus === "generating" ? (
                    <>
                        <span className="spinner" style={{ marginRight: "8px" }}></span>
                        Generating Captions...
                        <br/>
                        <span style={{ fontSize: "11px", opacity: 0.8 }}>
                            {currentCaption}
                        </span>
                    </>
                ) : (
                    "✨ Generate Captions"
                )}
            </button>

            {generationStatus === "complete" && captions && captions.length > 0 && (
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px"
                    }}>
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>
                            Generated {captions.length} captions
                        </span>
                        <span style={{
                            fontSize: "11px",
                            padding: "4px 8px",
                            background: "#27ae60",
                            color: "white",
                            borderRadius: "12px"
                        }}>
                            ✓ Ready
                        </span>
                    </div>

                    <div className="caption-preview-list">
                        {captions.slice(0, 5).map((cap, idx) => (
                            <div key={idx} className="caption-item">
                                <span className="timecode">{cap.start}</span>
                                <span className="text">{cap.text}</span>
                                <span className="lang-badge lang-english">EN</span>
                            </div>
                        ))}
                        {captions.length > 5 && (
                            <p style={{ 
                                fontSize: "12px", 
                                textAlign: "center", 
                                opacity: 0.6,
                                marginTop: "8px"
                            }}>
                                ... and {captions.length - 5} more
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};