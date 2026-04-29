import ReactDOM from "react-dom";

// Inject minimal theme styles once for class-based theming
const THEME_STYLE_ID = "udt-theme-styles";
function injectThemeStyles() {
    if (document.getElementById(THEME_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = THEME_STYLE_ID;
    style.textContent = `
        .theme-dark { color: #fff; }
        .theme-light { color: #000; }
        
        .caption-composer-container {
            width: 100%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 16px;
            overflow-y: auto;
        }
        
        .composer-header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .composer-header .subtitle {
            margin: 0;
            font-size: 14px;
            opacity: 0.8;
        }
        
        .workflow-steps {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-top: 1px solid rgba(128, 128, 128, 0.2);
            border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        }
        
        .step {
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0.5;
        }
        
        .step.active { opacity: 1; }
        
        .step-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #4a90e2;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .step.active .step-number { background: #2ecc71; }
        
        .step-label { font-size: 12px; white-space: nowrap; }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(128, 128, 128, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90e2, #2ecc71);
            transition: width 0.3s ease;
        }
        
        .tab-nav {
            display: flex;
            gap: 8px;
            border-bottom: 1px solid rgba(128, 128, 128, 0.2);
            padding-bottom: 8px;
        }
        
        .tab-nav button {
            padding: 8px 16px;
            border: 1px solid rgba(128, 128, 128, 0.3);
            background: transparent;
            color: inherit;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .tab-nav button.active {
            background: #4a90e2;
            color: white;
            border-color: #4a90e2;
        }
        
        .tab-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px 0;
        }
        
        .detection-card, .audio-controls, .caption-list {
            padding: 16px;
            border: 1px solid rgba(128, 128, 128, 0.2);
            border-radius: 8px;
            background: rgba(128, 128, 128, 0.05);
        }
        
        .language-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
        }
        
        .lang-nepali { background: #e74c3c; color: white; }
        .lang-hindi { background: #f39c12; color: white; }
        .lang-english { background: #3498db; color: white; }
        
        .audio-controls button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        
        .audio-controls .btn-primary { background: #2ecc71; color: white; }
        .audio-controls .btn-secondary { background: #e74c3c; color: white; }
        
        .audio-controls button:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .caption-preview-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .caption-item {
            display: flex;
            gap: 12px;
            padding: 12px;
            border: 1px solid rgba(128, 128, 128, 0.2);
            border-radius: 6px;
            font-size: 13px;
        }
        
        .caption-item .timecode {
            font-family: monospace;
            color: #4a90e2;
            white-space: nowrap;
        }
        
        .caption-item .text { flex: 1; }
        
        .caption-item .lang-badge {
            margin: 0;
            font-size: 10px;
            padding: 2px 8px;
        }
        
        .timeline-inspector {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .timeline-info {
            padding: 12px;
            border: 1px solid rgba(128, 128, 128, 0.2);
            border-radius: 6px;
            font-size: 13px;
        }
        
        .timeline-info .label { font-weight: 600; opacity: 0.8; }
        .timeline-info .value { color: #4a90e2; }
        
        .timeline-actions button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        
        .timeline-actions .btn-success { background: #2ecc71; color: white; }
        .timeline-actions .btn-warning { background: #f39c12; color: white; }
        
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .processing {
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .home-welcome {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .status-ready {
            margin-top: 12px;
            font-size: 14px;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

const _id = Symbol("_id");
const _root = Symbol("_root");
const _attachment = Symbol("_attachment");
const _Component = Symbol("_Component");
const _menuItems = Symbol("_menuItems");

export class PanelController {
    
    constructor(Component, { id, menuItems } = {}) {
        this[_id] = null;
        this[_root] = null;
        this[_attachment] = null;
        this[_Component] = null;
        this[_menuItems] = [];

        this[_Component] = Component;
        this[_id] = id;
        this[_menuItems] = menuItems || [];
        this.menuItems = this[_menuItems].map(menuItem => ({
            id: menuItem.id,
            label: menuItem.label,
            enabled: menuItem.enabled || true,
            checked: menuItem.checked || false
        }));

        [ "create", "show", "hide", "destroy", "invokeMenu" ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    create() {
        this[_root] = document.createElement("div");
        this[_root].style.height = "100vh";
        this[_root].style.overflow = "auto";
        this[_root].style.padding = "8px";

        // Ensure theme styles are available
        injectThemeStyles();

        // Apply current theme and subscribe to updates if available.
        const applyTheme = (theme) => {
            if (!this[_root]) return;
            const isDark = typeof theme === "string" && theme.toLowerCase().includes("dark");
            this[_root].classList.toggle("theme-dark", !!isDark);
            this[_root].classList.toggle("theme-light", !isDark);
        };

        const themeApi = (document && document.theme) ? document.theme : null;
        if (themeApi) {
            try {
                const currentTheme = themeApi.getCurrent && themeApi.getCurrent();
                if (currentTheme) applyTheme(currentTheme);
                if (themeApi.onUpdated && themeApi.onUpdated.addListener) {
                    themeApi.onUpdated.addListener(applyTheme);
                }
            } catch (_) {
                // If theme API is unavailable at runtime, safely ignore.
            }
        }

        ReactDOM.render(this[_Component]({panel: this}), this[_root]);

        return this[_root];
    }

    show(event)  {
        if (!this[_root]) this.create();
        this[_attachment] = event;
        this[_attachment].appendChild(this[_root]);
    }

    hide() {
        if (this[_attachment] && this[_root]) {
            this[_attachment].removeChild(this[_root]);
            this[_attachment] = null;
        }
    }

    destroy() {
        try {
            if (this[_root]) {
                ReactDOM.unmountComponentAtNode(this[_root]);
                this[_root] = null;
            }
        } catch (e) {
            console.warn("Error during panel destroy:", e);
        }
    }

    invokeMenu(id) {
        const menuItem = this[_menuItems].find(c => c.id === id);
        if (menuItem) {
            const handler = menuItem.oninvoke;
            if (handler) {
                handler();
            }
        }
    }
}
