"use veldapps-ol/proj/RD, veldapps-ol/Map-nederland, veldapps-ol/Map-klic, veldapps-ol/Map-bro";

const RD = require("veldapps-ol/proj/RD");
const Maps = {
	nederland: require("veldapps-ol/Map-nederland"), 
	klic: require("veldapps-ol/Map-klic"), 
	bro: require("veldapps-ol/Map-bro")
};

const layers = [].concat(Maps.nederland).concat(Maps.klic);

const getFeatureName = (feature) => {
	var props = feature.getProperties ? feature.getProperties() : feature;
	if(props.name) return props.name;
	return Object.keys(props)
		.filter(name => name.includes(":"))
		.map(name => js.nameOf(props[name]))
		.filter(name => name)[0] || js.nameOf(props);
};

[["veldapps/OpenLayers<PDOK-v3>"], {
	css: {
		"": "background-color: #f0f0f0;",
		
		".glassy": "background-color: rgba(155, 155, 155, 0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
		".loading": "background: rgba(155, 155, 155, 0.35) url(/shared/vcl/images/loading.gif) 50% 50% no-repeat;",
		".ol-scale-line": {
			"background": "rgba(155,155,155,0.45)", 
			"left": "32px", 
			"bottom": "32px", 
			"padding": "8px 8px 4px 8px"
		},
		".ol-scale-line-inner": {
			"color": "black", 
			"font-size": "9pt",
			"font-family": "Lucida Grande, Arial, sans-serif",
			// "border-color": "rgba(55,55,55,0.5)",
			"border-color": "black",
			"border-bottom-left-radius": "3px", 
			"border-bottom-right-radius": "3px"
		},
	
		// ".glassy-overlay": {
		// 	"": "pointer-events: none;",
		// 	">.{./Element}": "pointer-events: auto;",
		// 	">.glassy": {
		// 		"": "margin: 32px; pointer-events: auto; padding: 4px;",
		// 		// "&:hover": "backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);"
		// 	}
		// },
		// ".with-shadow": "box-shadow:rgba(0, 0, 0, 0.4) 0px 3px 14px 0px;",
		// ".rounded": "border-radius: 13px;",
		// ".animate-width": "transition: width 350ms ease-in;",
	},
	vars: {
	    layers: [
	    	[("ol:layer.Group"), {
	    		// opacity: 0.65
	    		treeLayers: layers
	    	}], 
			[("ol:layer.Vector"), { 
				source: ["ol:source.Vector", { 
					features: [ 
						// new ol.Feature({ geometry: new ol.geom.Point([150000, 450000]) }),
						// new ol.Feature({ geometry: new ol.geom.Point([208135.806774311, 462762.202334232]) })
					]
				}]
			}]
	    ],
	    view: [("ol:View"), {
	        minZoom: 0,
	        maxZoom: 20,
	        projection: RD.projection,
	        center: [150000, 450000],
	        zoom: 3
		}]
	},
	handlers: {
		mapready(map) {
			// TODO how to add this in static-code?
			this.setTimeout("update", () => this.getNode()
				.qsa(".ol-scale-line")
				.forEach(node => {
					console.log(node, node.className += " floating rounded glassy with-shadow animate-width");
				}), 250);
		}
	}
}, [
	
]];
