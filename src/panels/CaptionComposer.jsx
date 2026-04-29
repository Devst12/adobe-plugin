import React, { useState, useEffect, useRef } from "react";
import { Home } from "../components/Home.jsx";
import { TimelineInspector } from "../components/TimelineInspector.jsx";
import { LanguageDetector } from "../components/LanguageDetector.jsx";
import { CaptionGenerator } from "../components/CaptionGenerator.jsx";
import { AudioProcessor } from "../components/AudioProcessor.jsx";

export const CaptionComposer = () => {
    const [activeTab, setActiveTab] = useState("analyze");
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioTrack, setAudioTrack] = useState(null);
    const [detectedLanguage, setDetectedLanguage] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [progress, setProgress] = useState(0);

    const processAudioForCaptions = async () => {
        setIsProcessing(true);
        setProgress(0);

        try {
            // Step 1: Extract audio from timeline selection
            setProgress(10);
            const audioData = await AudioProcessor.extractAudioFromTimeline();
            setAudioTrack(audioData);

            // Step 2: Detect language (Nepali/Hindi/English)
            setProgress(30);
            const language = await LanguageDetector.detect(audioData);
            setDetectedLanguage(language);

            // Step 3: Generate timestamps and transcriptions
            setProgress(60);
            const generatedCaptions = await CaptionGenerator.generate({
                audio: audioData,
                language: language,
                format: "premiere-legacy-xml"
            });
            setCaptions(generatedCaptions);

            // Step 4: Apply captions to Premiere timeline
            setProgress(90);
            await TimelineInspector.applyCaptionsToTimeline(generatedCaptions);

            setProgress(100);
        } catch (error) {
            console.error("Caption generation failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const clearCaptions = () => {
        setCaptions([]);
        setDetectedLanguage(null);
        setAudioTrack(null);
        setProgress(0);
    };

    return (
        <div className="caption-composer-container">
            <div className="composer-header">
                <h1>AutoCaption Pro</h1>
                <p className="subtitle">Composer-style automated captioning for Nepali, Hindi & English</p>
            </div>

            <div className="workflow-steps">
                <div className={`step ${progress >= 25 ? "active" : ""}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Audio Extract</span>
                </div>
                <div className={`step ${progress >= 50 ? "active" : ""}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Language Detect</span>
                </div>
                <div className={`step ${progress >= 75 ? "active" : ""}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Transcribe</span>
                </div>
                <div className={`step ${progress >= 95 ? "active" : ""}`}>
                    <span className="step-number">4</span>
                    <span className="step-label">Timeline Apply</span>
                </div>
            </div>

            {progress > 0 && (
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            <div className="tab-nav">
                <button 
                    className={activeTab === "analyze" ? "active" : ""}
                    onClick={() => setActiveTab("analyze")}
                >
                    Analyze Audio
                </button>
                <button 
                    className={activeTab === "preview" ? "active" : ""}
                    onClick={() => setActiveTab("preview")}
                >
                    Preview Captions
                </button>
                <button 
                    className={activeTab === "timeline" ? "active" : ""}
                    onClick={() => setActiveTab("timeline")}
                >
                    Timeline Sync
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "analyze" && (
                    <div className="analyze-panel">
                        <LanguageDetector 
                            detectedLanguage={detectedLanguage}
                            onDetect={setDetectedLanguage}
                        />
                        <AudioProcessor 
                            audioTrack={audioTrack}
                            isProcessing={isProcessing}
                            onProcess={processAudioForCaptions}
                            onClear={clearCaptions}
                        />
                        <CaptionGenerator 
                            captions={captions}
                            language={detectedLanguage}
                        />
                    </div>
                )}

                {activeTab === "preview" && (
                    <div className="preview-panel">
                        <Home />
                        {captions.length > 0 && (
                            <div className="caption-preview-list">
                                <h3>Generated Captions ({captions.length})</h3>
                                {captions.map((cap, idx) => (
                                    <div key={idx} className="caption-item">
                                        <span className="timecode">{cap.start} - {cap.end}</span>
                                        <span className="text">{cap.text}</span>
                                        <span className="lang-badge">{cap.language}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "timeline" && (
                    <div className="timeline-panel">
                        <TimelineInspector captions={captions} />
                    </div>
                )}
            </div>
        </div>
    );
};
