"leaflet/Crs, leaflet/layers/28992, leaflet/plugins/markercluster, util/Browser, util/HtmlElement, veldoffice/util/Leaflet";
// "use strict";

var Layers = require("leaflet/layers/28992");
var Crs = require("leaflet/Crs");
var Method = require("js/Method");

var Keyboard = require("util/Keyboard");
var Browser = require("util/Browser");
var HE = require("util/HtmlElement");

var LeafletUtil = require("veldoffice/util/Leaflet");

var js = window.js;
var L = window.L;

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
	// "border-top": "1px solid silver",
	".map": "top:0;left:0;bottom:0;right:0;position:absolute;",
	overflow: "hidden"
};
var handlers = {
	"loaded": function() {
		this.vars("updating", 0);
		// should move this to Blocks/.js
		this.qsa("Executable<>#loaded").execute();
	},
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
			me.qsa("Executable<>#map-ready").execute({map: map, state: state});
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
	}
};

function setView(me, map, view, persist) {
	beginUpdate(me);
	map.once("moveend", function() {
		endUpdate(me);
	});
	
	map.setView(view[0], view[1], { /* animate */ });
	if(persist !== false) {
		me.qsa("#state-persist").execute();
	}
}

["Container, Store", { 
	css: styles, 
	handlers: handlers,
    content: "<div class='map' style='position:absolute;'></div>",
    
   	onNodeCreated: function() {
		var me = this;
		var map = LeafletUtil.createMap(this, this._node.childNodes[0], {
			crs: 28992,
	 		center: [52, 5.3],
			zoom: 2
		}, { emit: false });
		
		// TODO layeradd, layerremove?
		["zoomlevelschange", "resize", "unload", "viewreset", "load", "zoomstart", "movestart", "zoom", "move", "zoomend", "moveend"].forEach(function(name) {
					map.on(name, function() { 
						me.emit("map-" + name, arguments); 
					});
				});
				
		var cluster = L.markerClusterGroup({
			disableClusteringAtZoom: 13
        });
        cluster.addTo(map);

		var addLayer = map.addLayer;
		map.addLayer = function(layer) {
			return addLayer.apply(this, arguments);
		};
		
		me.vars("map", map);
		me.vars("cluster", cluster);
		me.emit("map-ready", []);
	},
	onLoad: function() {
		var me = this;
		this.override("visibleChanged", function() {
			beginUpdate(me);
			try {
	    		var map = me.getVar("map", true);
	    		map && map.invalidateSize();
				return this.inherited(arguments);
			} finally {
				endUpdate(me);
			}
		});
	},
	onResize: function() {
		beginUpdate(this);
		try {
			var map = this.vars("map");
			map && map.invalidateSize();
		} finally {
			endUpdate(this);
		}
	},
	onKeyUp: function(evt) {
		var me = this;
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
 
}, [
	["Executable", "state-persist", {
		onExecute: function() {
			var me = this._owner;
			me.setTimeout("execute", function() {
				var state = me.vars("state");
				me.writeStorage("state", JSON.stringify(state));
			}, 200);
		}
	}]
]];