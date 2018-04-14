"veldoffice/leaflet/Map";
"use strict";

var MapFactory = require("veldoffice/leaflet/Map");

var styles = {
	"#map-container": {
		"border-top": "1px solid silver",
		".map": "top:0;left:0;bottom:0;right:0;position:absolute;",
		overflow: "hidden",
		// ">div.map": "left:0;top:0;right:0;bottom:0;position:absolute;",
		// ".leaflet-marker-icon.leaflet-marker-draggable": {
		//     "transition": "margin-top 0.1s"
		// },
		// ".leaflet-popup-content": {
  //          "font-family": 
  //              "'Open Sans', 'Segoe UI', 'Droid Sans', Tahoma, Arial, sans-serif"
		// },
		// ".awesome-marker": {
	 //       ".marker-code": {
	 //           "background-color": "rgb(54,165,215)",
	 //           "margin-top": "2px",
	 //           "font-size": "7pt",
	 //           "font-family": "'Helvetica Neue', Arial, Helvetica, sans-serif"
	 //       }
		// },
		// "div.title": {
		//     "min-width": "200px",
		//     "border-bottom": "1px solid #ddd",
		//     "padding-bottom": "6px",
		//     "margin-bottom": "8px",
		//     ".fa": {
		//         "font-size": "larger"
		//     },
		//     "span": {
		//         "float": "right"
		//     }
		// },
		// "div.links": {
		//     "margin-top": "8px",
		//     "padding-top": "6px",
		//     "border-top": "1px solid #ddd",
	 //       "color": "#4697ce",
		//     "a": {
		//         "text-decoration": "underline",
		//         "cursor": "pointer",
		//         "margin-right": "6px",
		//         "&:active": {
		//             color: "red"
		//         }
		//     },
		//     ".coords": {
		//         "float": "right",
		//         "color": "silver"
		//     }
		// }
	}
};
var handlers = {
	"map-ready": function() {
		// MeetpuntView.refresh(this);
	},
	"#map-container nodecreated": function() {
		var root = this._owner;
		var map = MapFactory.initialize(this._node.childNodes[0], {
	 		center: [52, 5.3],
			zoom: 2,
		}, {});
		root.vars("map", map);
		root.emit("map-ready", []);
	},
	'#map-container onLoad': function() {
		this.override("visibleChanged", function() {
    		var map = this.getVar("map", true);
    		map && map.invalidateSize();
			// return this.inherited(arguments);
		});
	},
	'#map-container onResize': function() {
		var map = this._owner.vars("map");
		map && map.invalidateSize();
	}
};

["Container", { css: styles, handlers: handlers }, [
    ["Bar", "menubar", {}],
    ["Container", "map-container", {
    	content: "<div class='map' style='position:absolute;'></div>"
    }]
]];