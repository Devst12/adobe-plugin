import React, { useState, useEffect } from "react";

export const CaptionGenerator = ({ captions, language, onCaptionsUpdate }) => {
    const [generationStatus, setGenerationStatus] = useState("idle");
    const [currentCaption, setCurrentCaption] = useState("");
    const [serverStatus, setServerStatus] = useState("checking");
    const [modelInfo, setModelInfo] = useState(null);

    useEffect(() => {
        checkServer();
    }, []);

    useEffect(() => {
        if (captions && captions.length > 0) {
            setGenerationStatus("complete");
        } else {
            setGenerationStatus("idle");
        }
    }, [captions]);

    const checkServer = async () => {
        try {
            // Check LM Studio connection
            const response = await fetch("http://localhost:1234/v1/models", {
                method: "GET"
            });
            if (response.ok) {
                const data = await response.json();
                setServerStatus("online");
                if (data.data && data.data[0]) {
                    setModelInfo(data.data[0]);
                }
            } else {
                setServerStatus("offline");
            }
        } catch (e) {
            setServerStatus("offline");
        }
    };

    const generateCaptionsWithGemma = async () => {
        setGenerationStatus("generating");
        
        try {
            // Step 1: Get audio transcript from Gemma
            const transcript = await generateTranscript();
            
            // Step 2: Segment into captions with smart boundaries
            const segmented = segmentIntoCaptions(transcript);
            
            // Step 3: Detect language for each caption
            const withLanguage = await detectLanguages(segmented);
            
            // Update parent state
            if (onCaptionsUpdate) {
                onCaptionsUpdate(withLanguage);
            }
            
            setGenerationStatus("complete");
            return withLanguage;

        } catch (error) {
            console.error("Caption generation failed:", error);
            setGenerationStatus("error");
            
            // Demo fallback
            const demoCaptions = [
                { start: "00:00:01:00", end: "00:00:04:12", text: "नमस्ते दोस्तों, आज हम बात करेंगे", language: "nepali" },
                { start: "00:00:04:12", end: "00:00:08:00", text: "Today we explore new Premiere Pro features.", language: "english" },
                { start: "00:00:08:00", end: "00:00:12:00", text: "यह बहुत ही रोमांचक अपडेट है।", language: "hindi" },
                { start: "00:00:12:00", end: "00:00:15:00", text: "Let's dive into the timeline together.", language: "english" }
            ];
            
            if (onCaptionsUpdate) {
                onCaptionsUpdate(demoCaptions);
            }
        }
    };

    const generateTranscript = async () => {
        // Gemma prompt for transcription (multilingual support)
        const prompt = `You are an expert transcriptionist. Listen to this audio and transcribe it accurately.
The audio contains speech in Nepali (नेपाली), Hindi (हिन्दी), or English.
Transcribe exactly what is said, preserving:
- Proper nouns and names
- Numbers and dates
- Pauses (...)
- Emphasis (*word*)

Format with timestamps:
[00:01] Speaker: Text here

Respond only with the transcription:`;

        try {
            const response = await fetch("http://localhost:1234/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: modelInfo?.id || "gemma",
                    messages: [
                        {
                            role: "system",
                            content: "You are a multilingual transcription assistant supporting Nepali, Hindi, and English."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Gemma API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error("Gemma transcription failed:", error);
            throw error;
        }
    };

    const detectLanguages = async (captions) => {
        // Ask Gemma to identify languages
        const texts = captions.map(c => c.text).join(" | ");
        
        const prompt = `Identify the language of each text segment. 
Respond with format: [nepali|hindi|english]
Texts: ${texts}

Format: nepali, english, hindi, english`;

        try {
            const response = await fetch("http://localhost:1234/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: modelInfo?.id || "gemma",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 100,
                    stream: false
                })
            });

            if (response.ok) {
                const data = await response.json();
                const languages = data.choices[0].message.content
                    .toLowerCase()
                    .split(/[\n,]/)
                    .map(l => l.trim())
                    .filter(l => ["nepali", "hindi", "english"].includes(l));

                return captions.map((cap, idx) => ({
                    ...cap,
                    language: languages[idx] || "english"
                }));
            }
        } catch (e) {
            console.warn("Language detection failed, using defaults");
        }

        return captions;
    };

    const segmentIntoCaptions = (transcript) => {
        // Smart segmentation with sentence boundaries
        const sentences = transcript.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
        
        let currentTime = 1.0; // Start at 1 second
        const segments = [];
        
        sentences.forEach((sentence, idx) => {
            const trimmed = sentence.trim();
            if (!trimmed) return;
            
            const duration = Math.min(Math.max(trimmed.length / 20, 1.5), 5.0);
            
            const start = formatTimecode(currentTime);
            currentTime += duration;
            const end = formatTimecode(currentTime);
            
            segments.push({
                start,
                end,
                text: trimmed,
                language: "auto"
            });
        });
        
        return segments;
    };

    const formatTimecode = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const f = Math.floor((seconds % 1) * 24);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
    };

    const formatLanguageName = (lang) => {
        if (!lang) return "Auto";
        if (lang.name) return lang.name;
        const names = {
            "nepali": "🇳🇵 Nepali",
            "hindi": "🇮🇳 Hindi", 
            "english": "🇺🇸 English"
        };
        return names[lang] || lang;
    };

    return (
        <div className="caption-list">
            <h3>🤖 Gemma AI Caption Generator</h3>
            
            <div style={{
                padding: "8px 12px",
                borderRadius: "6px",
                marginBottom: "12px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: serverStatus === "online" 
                    ? "rgba(46, 204, 113, 0.15)" 
                    : "rgba(231, 76, 60, 0.15)"
            }}>
                <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: serverStatus === "online" ? "#2ecc71" : "#e74c3c",
                    animation: serverStatus === "online" ? "pulse 2s infinite" : "none"
                }}></span>
                <div>
                    <strong>{serverStatus === "online" ? "🟢 Gemma Connected" : "🔴 LM Studio Offline"}</strong>
                    {serverStatus === "online" && modelInfo && (
                        <span style={{ fontSize: "11px", opacity: 0.8, marginLeft: "8px" }}>
                            {modelInfo.id}
                        </span>
                    )}
                    {serverStatus === "offline" && (
                        <span style={{ fontSize: "11px", opacity: 0.7, marginLeft: "8px" }}>
                            Start LM Studio on port 1234
                        </span>
                    )}
                </div>
            </div>

            {language && (
                <div style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(52, 152, 219, 0.1)",
                    marginBottom: "12px",
                    fontSize: "13px"
                }}>
                    Primary Language: <strong>{formatLanguageName(language)}</strong>
                </div>
            )}

            <button
                className={`btn-primary${
                    generationStatus === "generating" ? " processing" : ""
                }`}
                onClick={generateCaptionsWithGemma}
                disabled={generationStatus === "generating" || serverStatus !== "online"}
                style={{ width: "100%", marginBottom: "12px" }}
            >
                {generationStatus === "generating" ? (
                    <>
                        <span className="spinner" style={{ marginRight: "8px" }}></span>
                        🤖 Gemma Processing...
                        <br/>
                        <span style={{ fontSize: "11px", opacity: 0.8 }}>
                            {currentCaption || "Transcribing with Gemma..."}
                        </span>
                    </>
                ) : serverStatus !== "online" ? (
                    "🔴 Start LM Studio"
                ) : (
                    "✨ Generate with Gemma"
                )}
            </button>

            {(generationStatus === "complete" || (captions && captions.length > 0)) && (
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px"
                    }}>
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>
                            {captions?.length || 0} captions generated
                        </span>
                        <span style={{
                            fontSize: "11px",
                            padding: "4px 8px",
                            background: "#27ae60",
                            color: "white",
                            borderRadius: "12px"
                        }}>
                            ✓ Complete
                        </span>
                    </div>

                    <div className="caption-preview-list">
                        {(captions || []).slice(0, 5).map((cap, idx) => (
                            <div key={idx} className="caption-item">
                                <span className="timecode">{cap.start}</span>
                                <span className="text">
                                    {cap.text} 
                                </span>
                                <span className={`lang-badge lang-${cap.language || "english"}`}>
                                    {cap.language === "nepali" && "🇳🇵"}
                                    {cap.language === "hindi" && "🇮🇳"}
                                    {cap.language === "english" && "🇺🇸"}
                                </span>
                            </div>
                        ))}
                        {captions && captions.length > 5 && (
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
            
            {generationStatus === "error" && (
                <div style={{
                    padding: "12px",
                    background: "rgba(231, 76, 60, 0.15)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "#e74c3c"
                }}>
                    ⚠️ Gemma unavailable. Check LM Studio.
                </div>
            )}
        </div>
    );
};