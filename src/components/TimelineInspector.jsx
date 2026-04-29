import React, { useState } from "react";

export const TimelineInspector = ({ captions }) => {
    const [timelineInfo, setTimelineInfo] = useState({
        sequence: "Untitled Sequence",
        duration: "00:02:30:00",
        fps: 24,
        videoTracks: 3,
        audioTracks: 4,
        captionTrack: "None"
    });

    const applyCaptionsToTimeline = async () => {
        try {
            // Simulate applying captions to Premiere timeline
            setTimelineInfo(prev => ({
                ...prev,
                captionTrack: `${captions.length} Captions`
            }));

            // In a real implementation, this would:
            // 1. Convert captions to Premiere XML format
            // 2. Use UXP DOM API to create caption track items
            // 3. Position each caption at correct timecode

            console.log(`Applying ${captions.length} captions to timeline...`);

        } catch (error) {
            console.error("Failed to apply captions:", error);
        }
    };

    const exportCaptionsSRT = () => {
        let srtContent = "";
        captions.forEach((cap, idx) => {
            srtContent += `${idx + 1}\n`;
            srtContent += `${cap.start.replace(/:/, ",", 2).replace(/:/, ",")} --> ${cap.end.replace(/:/, ",", 2).replace(/:/, ",")}\n`;
            srtContent += `${cap.text}\n\n`;
        });

        const blob = new Blob([srtContent], { type: "text/plain" });
        console.log("SRT Export Ready:", srtContent);
    };

    const exportCaptionsXML = () => {
        // Premiere Legacy Captions XML format
        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<PremiereData Version="1">\n`;
        xmlContent += `  <CaptionPlayerData>\n`;
        xmlContent += `    <Captions>\n`;

        captions.forEach((cap, idx) => {
            xmlContent += `      <Caption Id="${idx + 1}">\n`;
            xmlContent += `        <Attributes>\n`;
            xmlContent += `          <StartTime>${cap.start}</StartTime>\n`;
            xmlContent += `          <EndTime>${cap.end}</EndTime>\n`;
            xmlContent += `        </Attributes>\n`;
            xmlContent += `        <Text>${cap.text}</Text>\n`;
            xmlContent += `      </Caption>\n`;
        });

        xmlContent += `    </Captions>\n`;
        xmlContent += `  </CaptionPlayerData>\n`;
        xmlContent += `</PremiereData>`;

        console.log("XML Export Ready:", xmlContent);
    };

    return (
        <div className="timeline-inspector">
            <h3>📺 Timeline Inspector</h3>

            <div className="timeline-info">
                <div>
                    <span className="label">Sequence: </span>
                    <span className="value">{timelineInfo.sequence}</span>
                </div>
                <div style={{ marginTop: "8px" }}>
                    <span className="label">Duration: </span>
                    <span className="value">{timelineInfo.duration}</span>
                </div>
                <div style={{ marginTop: "8px" }}>
                    <span className="label">Frame Rate: </span>
                    <span className="value">{timelineInfo.fps} fps</span>
                </div>
                <div style={{ marginTop: "8px" }}>
                    <span className="label">Caption Track: </span>
                    <span className="value">{timelineInfo.captionTrack}</span>
                </div>
            </div>

            <div className="timeline-actions">
                <button
                    className="btn-success"
                    onClick={applyCaptionsToTimeline}
                    disabled={!captions || captions.length === 0}
                >
                    ⏩ Apply to Timeline
                </button>

                <button
                    className="btn-warning"
                    onClick={exportCaptionsSRT}
                    disabled={!captions || captions.length === 0}
                    style={{ marginTop: "8px" }}
                >
                    📄 Export SRT
                </button>

                <button
                    className="btn-warning"
                    onClick={exportCaptionsXML}
                    disabled={!captions || captions.length === 0}
                    style={{ marginTop: "8px" }}
                >
                    📄 Export XML
                </button>
            </div>

            {captions && captions.length > 0 && (
                <div style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "rgba(46, 204, 113, 0.1)",
                    borderRadius: "6px",
                    fontSize: "13px"
                }}>
                    <strong style={{ color: "#27ae60" }}>✓ Captions Ready</strong><br/>
                    <span style={{ fontSize: "11px", opacity: 0.8 }}>
                        {captions.length} caption items queued for timeline insertion
                    </span>
                </div>
            )}
        </div>
    );
};