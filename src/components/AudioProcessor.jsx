import React, { useState, useEffect } from "react";

export const AudioProcessor = ({ audioTrack, isProcessing, onProcess, onClear }) => {
    const [selectedRange, setSelectedRange] = useState({ start: "00:00:00:00", end: "00:00:10:00" });
    const [fps, setFps] = useState(24);
    const [serverStatus, setServerStatus] = useState("checking");

    useEffect(() => {
        // Check if local AI server is running
        checkServer();
    }, []);

    const checkServer = async () => {
        try {
            const response = await fetch("http://localhost:1234/v1/models", {
                method: "GET"
            });
            if (response.ok) {
                setServerStatus("online");
            } else {
                setServerStatus("offline");
            }
        } catch (e) {
            setServerStatus("offline");
        }
    };

    const extractAudioFromTimeline = async () => {
        // In real implementation, would use UXP to get selected audio
        // For demo: return mock audio file path
        return {
            path: "/tmp/timeline_audio.wav",
            duration: "00:00:15:00",
            format: "WAV 48kHz",
            language: null
        };
    };

    const formatTimecode = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const f = Math.floor((seconds % 1) * fps);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
    };

    return (
        <div className="audio-controls">
            <h3>🎵 Audio Extraction</h3>
            
            <div style={{
                padding: "8px 12px",
                borderRadius: "6px",
                marginBottom: "12px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }}
            className={serverStatus === "online" ? "online-badge" : "offline-badge"}>
                <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: serverStatus === "online" ? "#2ecc71" : "#e74c3c",
                    animation: serverStatus === "online" ? "pulse 2s infinite" : "none"
                }}></span>
                AI Server: <strong>{serverStatus === "online" ? "🟢 Online" : "🔴 Offline"}</strong>
                {serverStatus === "offline" && (
                    <span style={{ fontSize: "11px", opacity: 0.7 }}>
                        (run: python local_ai_server.py)
                    </span>
                )}
            </div>

            <p style={{ fontSize: "13px", opacity: 0.8, margin: "8px 0" }}>
                Select timeline range for AI processing
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                <div>
                    <label style={{ fontSize: "11px", opacity: 0.7, display: "block", marginBottom: "4px" }}>
                        Start Timecode
                    </label>
                    <input
                        type="text"
                        value={selectedRange.start}
                        onChange={(e) => setSelectedRange({ ...selectedRange, start: e.target.value })}
                        style={{
                            width: "100%",
                            padding: "6px 8px",
                            border: "1px solid rgba(128,128,128,0.3)",
                            borderRadius: "4px",
                            background: "rgba(0,0,0,0.2)",
                            color: "inherit",
                            fontSize: "12px"
                        }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: "11px", opacity: 0.7, display: "block", marginBottom: "4px" }}>
                        End Timecode
                    </label>
                    <input
                        type="text"
                        value={selectedRange.end}
                        onChange={(e) => setSelectedRange({ ...selectedRange, end: e.target.value })}
                        style={{
                            width: "100%",
                            padding: "6px 8px",
                            border: "1px solid rgba(128,128,128,0.3)",
                            borderRadius: "4px",
                            background: "rgba(0,0,0,0.2)",
                            color: "inherit",
                            fontSize: "12px"
                        }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", opacity: 0.7, display: "block", marginBottom: "4px" }}>
                    Frame Rate: {fps} fps
                </label>
                <input
                    type="range"
                    min="24"
                    max="60"
                    step="1"
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value))}
                    style={{ width: "100%" }}
                />
            </div>

            {audioTrack && (
                <div style={{
                    padding: "12px",
                    background: "rgba(46, 204, 113, 0.1)",
                    borderRadius: "6px",
                    marginBottom: "12px",
                    fontSize: "13px"
                }}>
                    <strong style={{ color: "#27ae60" }}>✓ Audio Track Ready</strong><br/>
                    <span style={{ fontSize: "11px", opacity: 0.8 }}>
                        Duration: {audioTrack.duration}<br/>
                        Format: {audioTrack.format}<br/>
                    </span>
                </div>
            )}

            <button
                className={`btn-primary${
                    isProcessing || serverStatus !== "online" ? " processing" : ""
                }`}
                onClick={onProcess}
                disabled={isProcessing || serverStatus !== "online"}
                style={{ marginBottom: "8px" }}
            >
                {isProcessing ? (
                    <>
                        <span className="spinner" style={{ marginRight: "8px" }}></span>
                        Processing Audio...
                    </>
                ) : serverStatus !== "online" ? (
                    "🔴 Start AI Server First"
                ) : (
                    "▶ Extract & Send to Local AI"
                )}
            </button>

            {audioTrack && (
                <button
                    className="btn-secondary"
                    onClick={onClear}
                    disabled={isProcessing}
                >
                    🗑 Clear Selection
                </button>
            )}
        </div>
    );
};