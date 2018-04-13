"jquery, proj4, leaflet/CoordinatesControl, js/Deferred, veldoffice/Meetpunt/leaflet/Marker, veldoffice/util/Date, veldoffice/EM, veldoffice/leaflet/Map";
"use strict";

/*- vars: map, markers, source, dest */
var API = "/office-rest/rest/v1/";
var Buttons = ["Contour", "Meetpunt", "Klicmelding"];

var Deferred = require("js/Deferred");
var Control = require("vcl/Control");
var ajax = require("jquery").ajax;
var CoordinatesControl = require("leaflet/CoordinatesControl");
var MeetpuntMarker = require("veldoffice/Meetpunt/leaflet/Marker");
var Proj4js = require("proj4");
var EM = require("veldoffice/EM");

// var LeafletUtil = require("veldoffice/util/Leaflet");
var Map = require("veldoffice/leaflet/Map");
var DateUtil = require("veldoffice/util/Date");
var Sort = { byCode: function(i1, i2) { return i1.code < i2.code ? -1 : 1; } };

var MeetpuntView = {
	refresh: function(root) {
        var key = root.getVar("veldoffice/Onderzoek.id", true);
		var vars = root.getVars();
		var markers = vars.markers;
		
		markers.clearLayers();
		// EM.query(String.format("onderzoek/%d/meetpunt", key),
		// 	"id,code,type,max:[outer]bodemlagen.onderkant einddiepte" + 
		// 	"boormeester,datum,xcoord x,ycoord y");
			
        ajax({
            url: String.format("%spersistence/onderzoek/%d/meetpunt/query", 
                API, key),
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                fields: {
                    id: "id", code: "code", type: "type", 
                    einddiepte: "max:[outer]bodemlagen.onderkant",
                    boormeester: "boormeester", datum: "datum",
                    xcoord: "xcoord", ycoord: "ycoord"
                },
                groupBy: ['id']
            })
        }).success(function(arr) {
            var tuples = arr.sort(Sort.byCode);
            tuples.forEach(function(tuple, index) {
                tuple.icon = MeetpuntMarker.icons.byType[(tuple.type && tuple.type.id) || 2377];
                tuple.title = String.format("%s, %s\nDatum: %s\nBoormeester: %s", 
                        tuple.code, (tuple.type && tuple.type.naam) || "meetpunt", 
                        DateUtil.strdate(DateUtil.makedate(tuple.datum)),
                        tuple.boormeester);
                tuple.onderzoek = {id: key};
                if(tuple.xcoord && tuple.ycoord) {
                    var pt = {x:tuple.xcoord, y:tuple.ycoord};
                    Proj4js.transform(vars.epsg28992, vars.wgs84, pt);
				    markers.addLayer(MeetpuntMarker.create(vars, tuple, [pt.y, pt.x]));
                }
            });
        });
	}
};

["leaflet:Markers", {}, [
	"vcl-data:Pouch"
]];

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
		MeetpuntView.refresh(this);
	},
	"#map-container nodecreated": function() {
		var root = this._owner;
		setTimeout(function() {
			var map = Map.initialize(this._node.childNodes[0], {
		 		center: [52, 5.3],
				zoom: 2,
			}, {});
			root.vars("map", map);
			root.emit("map-ready", []);

		}.bind(this), 200);
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
    ["Executable", "setView", {
        onExecute: function (evt, sender) {
            sender.setSelected(true);
        }
    }],
    ["Bar", "menubar", {}, Buttons.map(function(button, i) {
    	return ["vcl-ui:Button", {
    		action: "setView", groupIndex: 1, classes: "toggle",
    		selected: i === 0,
    		content: button
    	}];
    })],
    ["Container", "map-container", {
    	content: "<div class='map' style='position:absolute;'></div>",
    	// onLoad: handlers['#map-container onLoad'],
    	// onResize: handlers['#map-container onResize']
    }]
]];