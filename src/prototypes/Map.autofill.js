"use veldoffice/Meetpunt/leaflet/Marker, leaflet/plugins/proj4, util/Browser";

function asArray(arr) {
	if(!arr) { arr = []; } else if(!(arr instanceof Array)) { arr = [arr]; }
	return arr;
}

var Proj4js = require("proj4");
var Browser = require("util/Browser");
var MeetpuntMarker = require("veldoffice/Meetpunt/leaflet/Marker");

function getLayer(namespace, entity, object) {
	var epsg28992 = new Proj4js.Proj("EPSG:28992");
	var wgs84 =  new Proj4js.Proj("WGS84");
	
			if(arguments.length === 2) {
				object = entity;
				namespace = namespace.split(":");
				entity = namespace[1];
				namespace = namespace[0];
			}
			
			if(namespace === "sikb-10" && entity === "meetpunt" && object.point) {
				if(object.point) {
					var pt = {x: object.point['@_xcoord'], y: object.point['@_ycoord']};
                    Proj4js.transform(epsg28992, wgs84, pt);
                    console.log(object);
                    var meetpunt = {
                    	code: "" + object.code
                    };
				    return MeetpuntMarker.create({}, meetpunt, [pt.y, pt.x]);
				}
			}
		}

var handlers = {
	"map-ready": function() { this.scope().refresh.execute(); }
};

["", { handlers: handlers }, [
	
	["Executable", "refresh", {
		// content: "Refresh",
		onExecute: function() {
			var map = this.vars(["map", true]);
			var layer;
			
			// this.up("devtools/Workspace<>")
			this.app()
				.qsa("devtools/Editor<xml>:root")
				.filter(function(editor) {
					return editor.vars("root.bodeminformatie.locatie.onderzoek");
				})
				.map(function(editor) {
					var o = editor.vars("root.bodeminformatie.locatie.onderzoek");
					asArray(o).forEach(function(onderzoek) {
						if((layer = getLayer("sikb-10:onderzoek", onderzoek))) {
							map.addLayer(layer);
						}
						asArray(onderzoek.meetpunt).forEach(function(meetpunt) {
							if((layer = getLayer("sikb-10:meetpunt", meetpunt))) {
								map.addLayer(layer);
							}
						});
					});
				});
				
		}	
	}]
	
]];