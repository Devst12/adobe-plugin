import React, { useState } from "react";

export const AudioProcessor = ({ audioTrack, isProcessing, onProcess, onClear }) => {
    const [selectedRange, setSelectedRange] = useState({ start: "00:00:00:00", end: "00:00:10:00" });
    const [fps, setFps] = useState(24);

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
            <p style={{ fontSize: "13px", opacity: 0.8, margin: "8px 0" }}>
                Select timeline range for audio processing
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
                        Language: {audioTrack.language || "Auto-detect"}
                    </span>
                </div>
            )}

            <button
                className={`btn-primary${
                    isProcessing ? " processing" : ""
                }`}
                onClick={onProcess}
                disabled={isProcessing}
                style={{ marginBottom: "8px" }}
            >
                {isProcessing ? (
                    <>
                        <span className="spinner" style={{ marginRight: "8px" }}></span>
                        Processing Audio...
                    </>
                ) : (
                    "▶ Extract & Process Audio"
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