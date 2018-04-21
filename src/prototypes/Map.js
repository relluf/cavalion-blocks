"leaflet/Crs, leaflet/layers/28992 ,util/Browser, util/HtmlElement";
// "use strict";

var Layers = require("leaflet/layers/28992");
var Crs = require("leaflet/Crs");
var Method = require("js/Method");

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
function setView(me, map, view, persist) {
	beginUpdate(me);
	map.once("moveend", function() {
		endUpdate(me);
	});
	
	map.setView(view[0], view[1]);
	if(persist !== false) {
		me.qsa("#state-persist").execute();
	}
}

function beginUpdate(me) {
	me.vars("updating", me.vars("updating") + 1);
}
function endUpdate(me) {
	me.vars("updating", me.vars("updating") - 1);
}
function isUpdating(me) {
	return me.vars("updating") > 0;
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
		
		var center = map.getCenter();
		var zoom = map.getZoom();
		this.vars("state", { views: [[[center.lat, center.lng], zoom]], viewIndex: 0 });
		
		this.readStorage("state", function(state) {
			if(state && !((state = js.parse(state)) instanceof Error)) {
				me.vars("state", state);
				setView(me, map, state.views[state.viewIndex], false);
			} else {
				me.qsa("#state-persist").execute();
			}
		});
	},
	"map-moveend": function() {
		if(isUpdating(this)) return;
		
		var map = this.vars("map");
		var state = this.vars("state");
		var center = map.getCenter();
		var zoom = map.getZoom();
		var index = state.viewIndex;
		var view = state.views[index];
		if(index === -1 || view[0][0] !== center.lat || view[0][1] !== center.lng || view[1] !== zoom) {
			state.views.splice(state.viewIndex + 1);
			state.viewIndex = state.views.push([[center.lat, center.lng], zoom]) - 1;
			
			this.qsa("#state-persist").execute();
		}
	},
	"#map-container onNodeCreated": function() {
		var root = this._owner;
		var map = createMap(this._node.childNodes[0], {
	 		center: [52, 5.3],
			zoom: 2
		}, {});
		
		["zoomlevelschange", "resize", "unload", "viewreset", "load", "zoomstart", "movestart", "zoom", "move", "zoomend", "moveend"].forEach(function(name) {
					map.on(name, function() { 
						root.emit("map-" + name, arguments); 
					});
				});
		
		root.vars("map", map);
		root.emit("map-ready", []);
	},
	'#map-container onLoad': function() {
		var me = this._owner;
		this.override("visibleChanged", function() {
			beginUpdate(me);
			try {
	    		var map = this.getVar("map", true);
	    		map && map.invalidateSize();
				return this.inherited(arguments);
			} finally {
				endUpdate(me);
			}
		});
	},
	'#map-container onResize': function() {
		beginUpdate(this._owner);
		try {
			var map = this._owner.vars("map");
			map && map.invalidateSize();
		} finally {
			endUpdate(this._owner);
		}
	},
	"#map-container onKeyUp": function(evt) {
		var me = this._owner;
		var state = me.vars("state");
		var map = me.vars("map"), view;

		if(evt.altKey === true) {
			if(isUpdating(me)) {
				console.log("blocked");
				return;
			}
			if(evt.keyCode === KEY_LEFT && state.viewIndex > 0) {
				if(evt.ctrlKey === true) {
					state.viewIndex = 0;	
				} else {
					state.viewIndex--;
				}
				setView(me, map, state.views[state.viewIndex]);
			} else if(evt.keyCode === KEY_RIGHT && state.viewIndex < state.views.length - 1) {
				if(evt.ctrlKey === true) {
					state.viewIndex = state.views.length - 1;
				} else {
					state.viewIndex++;
				}
				setView(me, map, state.views[state.viewIndex]);
			}
		}
	}
};

["Container", { css: styles, handlers: handlers, vars: "updating: 0;" }, [

	["Executable", "state-persist", {
		onExecute: function() {
			var me = this._owner;
			me.setTimeout("execute", function() {
				var state = me.vars("state");
				me.writeStorage("state", JSON.stringify(state));
			}, 200);
		}
	}],
	
    // ["Bar", "menubar", {}],
    ["Container", "map-container", {
    	content: "<div class='map' style='position:absolute;'></div>"
    }]
]];