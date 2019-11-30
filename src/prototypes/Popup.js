"use js";

["Container", { 
	css: {
		// "display": "none",
		// "&.state-open": {
		// 	"display": "block"	
		// },
        "&.animate": {
            "-webkit-transition-property": "-webkit-transform, opacity, all",
            "-webkit-transition-duration": "0.2s, 0.3s, 0.3s",
            "&.fadein-scale": {
                "-webkit-transform": "scale(1)",
                "opacity": "1",
                "&.initial": {
                    "-webkit-transform": "scale(0.9)",
                    "opacity": "0"
                }
            }
        }
	},
	visible: false 

}, []];