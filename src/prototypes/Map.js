"use v7/openlayers/proj/RD";

var RD = require("v7/openlayers/proj/RD");
var layers = [{
	name: "BGT - Achtergrondkaart",
	checked: false,
	technicalName: "bgtachtergrond",
	maxResolution: 0.84,
	minResolution: 0.0525,
	service: {
		url: "https://geodata.nationaalgeoregister.nl/tiles/service/wmts",
		type: "wmts"
	}
}, {
	// uri:V2 - https://geodata.nationaalgeoregister.nl/config/viewer/api/v1/themes/Overige kaarten/Basisregistratie Grootschalige Topografie (BGT)/Basisregistratie Grootschalige Topografie (BGT)/BGT Omtrekgericht		}, {
	name:"BGT - Omtrekgericht",
	checked: false,
	maxResolution: 0.84,
	minResolution: 0.0525,
	technicalName: "bgtomtrekgericht",
	service: {
		url: "https://geodata.nationaalgeoregister.nl/tiles/service/wmts",
		type: "wmts"
	}
}, {
	name: "OpenTopo - Achtergrondkaart",
	checked: false,
	technicalName: "opentopoachtergrondkaart",
	maxResolution: 3440.64,
	minResolution: 0.84,//0.21,
	service: {
		url: "https://geodata.nationaalgeoregister.nl/tiles/service/wmts",
		type: "wmts"
	}
}, {
	name: "Open Basis Kaart",
	checked: false,
	technicalName: "osm",
    format: "image/png",
    style: "default",
    projection: RD.projection,
	matrixSet: "rd",
    matrixIds: RD.matrixIds.map(_ => _.split(":").pop()),
    service: {
    	url: "http://www.openbasiskaart.nl/mapcache/wmts/",
    	type: "wmts"
    }
}, {
	name: "Luchtfoto",
	checked: true,
	technicalName: "Actueel_ortho25",
	service: { 
		url: "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0",
		type: "wmts"
	}
}, {
	name: "Kadastrale kaart",
	technicalName: "Kadastralekaart",
	maxResolution: 0.84,
	// minResolution: 0.21,
	service: {
		type: "wmts",
		url: "https://geodata.nationaalgeoregister.nl/kadastralekaart/wmts/v4_0"
	}
	// VO:   https://geodata.nationaalgeoregister.nl/kadastralekaart/wmts/v4_0?layer=Perceelvlak&tilematrixset=EPSG%3A28992&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A28992%3A14&TileCol=6718&TileRow=8417			
	// PDOK: https://geodata.nationaalgeoregister.nl/kadastralekaart/wmts/v4_0?layer=Kadastralekaart&style=default&tilematrixset=EPSG%3A28992&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A28992%3A14&TileCol=7587&TileRow=7798		
	// GW: http://gw18289.gwklic.nl/webify/do?c=jso.mapintel.wms.getMap&m=1x00060guR&u=https%3A//geodata.nationaalgeoregister.nl/kadastralekaart/wms/v4_0&b=79232.00%2C455808.00%2C79360.00%2C455936.00&l=Kadastralekaart&s=&w=256&h=256&r=EPSG%3A28992&null
// }, {
// 	name: "Kadastrale kaart",
// 	technicalName: "kadastralekaartv3",
// 	maxResolution: 0.84,
// 	// minResolution: 0.21,
// 	service: {
// 		type: "wmts",
// 		url: "https://geodata.nationaalgeoregister.nl/tiles/service/wmts"
// 	},
// 	seperator: true
}, {
	name: "Spoorwegen",
	checked: false,
	technicalName: "spooras,trace,kruising,overweg,wissel",
	service: {
		type: "wms",
		url: "https://geodata.nationaalgeoregister.nl/spoorwegen/wms"
	}
}, {
	name: "Labels",
	technicalName: "lufolabels",
	maxResolution: 26.88,
	minResolution: 0.21,
	service: { 
		url: "https://geodata.nationaalgeoregister.nl/tiles/service/wmts",
		type: "wmts"
	},
	seperator: true
}, {
    name: "KLIC - kabels en leidingen",
	// checked: false,
    version: "1.1.1",
    technicalName: "_2113929216_20702,_2113929216_20710,_2113929216_20711,_2113929216_20709,_2113929216_20705,_2113929216_20703,_2113929216_20707,_2113929216_20708,_2113929216_20706,_2113929216_20722,_2113929216_20723,_2113929216_20725,_2113929216_20727,_2097152006_103338",
    style: ",,,,,,,,,,,,,,",
    maxResolution: 6.88,
    service: {
		type: "wms",
		url: "http://app.vectorklic.nl/veldapps/wms"
    },
    seperator: true
}, {
	name: "KLIC - contouren (BETA)",
	// checked: false,
    version: "1.1.1",
    technicalName: "_2113929216_20728",
    style: "",
    // maxResolution: 6.88,
    service: {
		type: "wms",
		url: "http://app.vectorklic.nl/veldapps/wms"
    }
}, {
    name: "BRO - Grondwatermonitoringput (GMW)",
    technicalName: "gmw_kenset",
    // legendUrl: "https://geodata.nationaalgeoregister.nl/brogmw/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=gmw",
    maxResolution: 26.88,
    service: {
		type: "wms",
		url: "https://service.pdok.nl/bzk/brogmwkenset/wms/v2_1"
    },
    path: ["Overige kaarten", "Basisregistratie Ondergrond (BRO)", "BRO - Grondwatermonitoringput (GMW)"],
    seperator: true,
    'bro-query': "gmw"
}, {
    name: "BRO - Boormonsters (BHR-P)",
    checked: !false,
    technicalName: "bhr-p",//boringTool,featureBottom,layerComponent,soilLayer",
    // legendUrl: "https://geodata.nationaalgeoregister.nl/brogmw/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=gmw",
    // style: "brobhr:bro_bhr,brobhr:bro_bhr,brobhr:bro_bhr,brobhr:bro_bhr,brobhr:bro_bhr",
    maxResolution: 26.88,
    service: {
		type: "wms",
		url: "https://geodata.nationaalgeoregister.nl/brobhr/wms"
    },
    path: ["Overige kaarten", "Basisregistratie Ondergrond (BRO)", "BRO - Grondwatermonitoringput (GMW)"],
    'bro-query': "bhr"
}, {
    name: "BRO - Geotechnisch booronderzoek (BHR-GT)",
    checked: !false,
    technicalName: "geotechnisch_booronderzoek_kenset",
    // legendUrl: "https://geodata.nationaalgeoregister.nl/bzk/brobhrgt/wms/v1_0?language=dut&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=geotechnisch_booronderzoek_kenset&format=image/png&STYLE=brobhrgt:bro_bhrgt"
    // style: "brobhr:bro_bhr,brobhr:bro_bhr,brobhr:bro_bhr,brobhr:bro_bhr,brobhr:bro_bhr",
    maxResolution: 6.88,
    // maxResolution: 3440.64,
    // minResolution: 0.21,
    service: {
		type: "wms",
		url: "https://geodata.nationaalgeoregister.nl/bzk/brobhrgt/wms/v1_0"
    },
    path: ["Overige kaarten", "Basisregistratie Ondergrond (BRO)", "BRO - Grondwatermonitoringput (GMW)"],
    'bro-query': "bhr_gt"
}, {
	name: "BRO - Geotechnisch sondeeronderzoek (CPT)",
	checked: false,
    legendUrl: "https://geodata.nationaalgeoregister.nl/brocpt/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=cpt",
    technicalName: "cpt",
    maxResolution: 26.88,
    path: ["Overige kaarten", "Basisregistratie Ondergrond (BRO)", "BRO - Grondwatermonitoringput (GMW)"],
	service: {	
		type: "wms",
		url: "https://geodata.nationaalgeoregister.nl/brocpt/wms"
	},
    'bro-query': "cpt"
}, {
	name: "Plantekeningen",
	checked: false,
    version: "1.1.1",
    technicalName: "_2097152006_1634112,_2097152006_1757443",
    style: "",
    // maxResolution: 6.88,
    service: {
		type: "wms",
		url: "http://app.vectorklic.nl/veldapps/wms"
    },
    seperator: true
}];

var getFeatureName = (feature) => {
	var props = feature.getProperties ? feature.getProperties() : feature;
	if(props.name) return props.name;
	return Object.keys(props)
		.filter(name => name.includes(":"))
		.map(name => js.nameOf(props[name]))
		.filter(name => name)[0] || js.nameOf(props);
};

[["veldapps/OpenLayers<PDOK-v2>", "devtools/OpenLayers<Documents>"], {
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
	
/* the order is important */
	["veldapps/Features<imsikb0101>"],
	["veldapps/Features<imbro>"],
	// ["veldapps/Features<veldoffice>"],
	["veldapps/Features<itwbm>"],
	// ["veldapps/Features<geojson>"],
	// ["veldapps/Features<gml>"]
]];
