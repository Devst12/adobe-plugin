import React from "react";

import { PanelController } from "./controllers/PanelController.jsx";
import { CaptionComposer } from "./panels/CaptionComposer.jsx";

import { entrypoints } from "uxp";

const captionController = new PanelController(() => <CaptionComposer />, {
    id: "caption-automate"
});


entrypoints.setup({
    plugin: {
        create(plugin) {
            console.log("AutoCaption Pro plugin initialized");
        },
        destroy() {
            console.log("AutoCaption Pro plugin destroyed");
        }
    },
    panels: {
        "caption-automate": captionController
    }
});
