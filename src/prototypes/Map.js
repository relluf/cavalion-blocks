"leaflet/Crs, leaflet/layers/28992, util/Browser, util/HtmlElement";
// "use strict";

var Layers = require("leaflet/layers/28992");
var Crs = require("leaflet/Crs");

var Keyboard = require("util/Keyboard");
var Browser = require("util/Browser");
var HE = require("util/HtmlElement");

var js = window.js;
var L = window.L;

function createMap(mapDomNode, mapOptions, options) {
	var touch = "ontouchstart" in window;
	
	mapOptions = js.mixIn({ zoomControl: false, attributionControl: false,
		preferCanvas: !true }, mapOptions || {});
    
    if(mapOptions.crs === undefined) {
    	// Assume RD by default (for Veldoffice anyways)
    	mapOptions.crs = Crs.RD;
    }
	
    var map = L.map(mapDomNode, mapOptions);
    options = options || {};

    if(Browser.ios !== true && Browser.android !== true) {
		/*- TODO move to Map.page */
		HE.addClass(mapDomNode, "desktop");
    }

		L.control.layers(options.layers || {
			openbasiskaart: Layers.openbasiskaart().addTo(map),
			// luchtfoto2017: Layers.luchtfoto2017().addTo(map),
			// bgtlijngericht: Layers.bgtlijngericht().addTo(map),
			// bgtpastel: Layers.bgtpastel().addTo(map)
		});//.addTo(map);

	if(options.scale !== false) {
        L.control.scale({imperial: false}).addTo(map);
	}

	return map;
}

var KEY_LEFT = Keyboard.getKeyCode("KEY_LEFT");
var KEY_RIGHT = Keyboard.getKeyCode("KEY_RIGHT");

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
		var me = this;
		var map = this.vars("map");

		this.vars("state", {
			views: [],
			viewIndex: -1
		});
		
			function block() {			
				// me.qs("#state-write").execute();
				
				map.$blocked = true;
				map.once("moveend", function() {
					setTimeout(function() {
						delete map.$blocked;
					}, 100);
				});
			}
			
		this.readStorage("state", function(state) {
			if(state && !((state = js.parse(state)) instanceof Error)) {
				me.vars("state", state);

				var view = state.views[state.viewIndex];
				if(view) {
					block();
					map.setView(view[0], view[1]);
				}
			}
		});
		
	},
	"map-moveend": function() {
		var me = this;
		var map = me.vars("map");
		var state = me.vars("state");
		
		if(map.$blocked) {
			console.log("moveend blocked");
			return;
		}
		
		
		this.setTimeout("viewchanged", function() {
			
			var center = map.getCenter();
			var zoom = map.getZoom();
			var index = state.viewIndex;
			
			var view = index !== -1 ? state.views[index] : null;
			if(view === null || view[0][0] !== center.lat || view[0][1] !== center.lng || view[1] !== zoom) {
				state.views.splice(state.viewIndex + 1);
				state.viewIndex = state.views.push([[center.lat, center.lng], zoom]) - 1;
				me.qs("#state-write").execute();
			}
		}, 200);
	},
	"#map-container onNodeCreated": function() {
		var root = this._owner;
		var map = createMap(this._node.childNodes[0], {
	 		center: [52, 5.3],
			zoom: 2
		}, {});
		
		["zoomlevelschange", "resize", "unload", "viewreset", "load", "zoomstart", "movestart", "zoom", "move", "zoomend", "moveend"].forEach(function(name) {
					map.on(name, function() { root.emit("map-" + name, arguments); });
				});
		
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
	},
	"#map-container onKeyUp": function(evt) {
		var me = this._owner;
		if(evt.altKey === true) {
			var state = me.vars("state");
			var map = me.vars("map"), view;

			function block() {			
				me.qs("#state-write").execute();
				
				map.$blocked = true;
				map.once("moveend", function() {
					setTimeout(function() {
						delete map.$blocked;
					}, 0);
				});
			}
			
			if(map.$blocked) {
				console.log("blocked");
				return;
			}

			if(evt.keyCode === KEY_LEFT) {
				if(state.viewIndex > 0) {
					view = state.views[--state.viewIndex];
					block();
					map.setView(view[0], view[1]);
				}
			} else if(evt.keyCode === KEY_RIGHT) {
				if(state.viewIndex < state.views.length - 1) {
					view = state.views[++state.viewIndex];
					block();
					map.setView(view[0], view[1]);
				}
			}
		}
	}
};

["Container", { css: styles, handlers: handlers }, [

	["Executable", "state-write", {
		onExecute: function() {
			var me = this._owner;
			var state = me.vars("state");
			state.count = state.views.length;
			me.writeStorage("state", JSON.stringify(state));
		}
	}],
	
    // ["Bar", "menubar", {}],
    ["Container", "map-container", {
    	content: "<div class='map' style='position:absolute;'></div>"
    }]
]];