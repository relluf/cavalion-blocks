"use Framework7, text!blocks/prototypes/Framework7-root.html, refreshDom, pages/Controller";
"use strict";

	function ms(name) { 
		return "pages/Modem-settings/" + name + ".html"; 
	}
	function rest_uri() {
		var serial = (window.location.search.split('s=')[1]||'').split('&')[0];
		var l = window.location.toString().replace(/;/g, "?").split("?")[0].split("/");
		if(l[l.length - 1] === "") {
			l.pop();
		}
		var i = l.length - 1;
		while(["src", "gdtis", "gdtis2", "main", "login", "build", ""].indexOf(l[i--]) !== -1) {
			l.push("..");
		}
		l.push("");
		l = l.join("/");
	
		return l + "rest/unsecure/modems/" + serial + "/";
	}

	(function() {
		
		var js = window.js;
		
		var settings = [
			"serial", 
			"location", 
			"hardwareversion",
			"softwareversion", 
			"emailaddress1", 
			"emailaddress2",
			"emailaddress3", 
			"emailaddress4",
			"topportparameters",
			["type", "ModemType"], 
			["battery", "Battery"],
			// "newbattery",
			["currentbattery", "Battery"],
			["sendinterval", "Interval"],
			["wakeupinterval", "Interval"],
			["barologinterval", "Interval"],
			["sampleinterval", "Interval"],
			["allportsic", "IC"],
			["requestconfirmconfiguration", "TCN"],
			["ext_eswsensor", "ESWSensor"],
			["ext_powersupply", "Voltage"],
			["ext_interfacetype", "InterfaceType"]
		];
	
		var eswsensors = {
			"instances":[{"description":"Custom Sensor","id":1},{"template":{"channels":{"0":{"parameters":{"a1":{"description":"Slope (a1);Calibration parameter a1;","value":8.4},"a0":{"description":"Offset (a0);Calibration parameter a0;","value":1.6}}}},"shortserialnumber":"KB_2_ESW     SM150T1.0"},"description":"SM150T Soil Moisture Sensor","id":2},{"template":{"channels":{"0":{"parameters":{"bucket_size":{"description":"Bucket size;Tipping bucket size gives the amount of rain fallen for every tip;mm","value":0.2}}},"1":{"parameters":{"a":{"description":"appels","value":1.0},"diameter":{"description":"","value":20.432},"treshold_1":{"description":"","value":100.0},"G":{"description":"","value":9.8},"Y":{"description":"","value":7.0}}},"2":{"parameters":{"threshold_2":{"description":"","value":739.12},"diameter":{"description":"Diameter;The diameter of the tube which is connected to this device at the top port of course.;cm","value":32.0},"G":{"description":"Gravity;The force that attracts a body toward the center of the earth, or toward any other physical body having mass;m/sec2","value":9.8}}}},"shortserialnumber":"KB_1_ESW     Rain  1.0"},"description":"Rainmeter","id":3},{"description":"Aquaread APxxxx","id":4},{"description":"SDI-12","id":5},{"description":"Diver or E-plus","id":6},{"template":{"channels":{"0":{"parameters":{"description":"","value":0.0}}},"shortserialnumber":"KB_1_ESW     Sad   1.0"},"description":"Sad","id":10},{"template":{"channels":{"0":{"parameters":{"description":"","value":0.0}},"1":{"parameters":{"x":{"description":"x","value":0.0}}}},"shortserialnumber":"KB_1_ESW     Happy 1.0"},"description":"Happy","id":11}],"count":8};
		var values = {
			"ext_eswsensor":"0","hardwareversion":4,"topportparameters":{},"softwareversion":"R4.2L","emailaddress4":"","type":4,"emailaddress2":"","modemlocation":"37957906","emailaddress3":"","barologinterval":"86400","emailaddress1":"none","connected":true,"currentbattery":"10","serial":"37957906        ","newbattery":"0","allportsic":"false","ext_interfacetype":"Aquaread","sampleinterval":"86400","sendinterval":"86400","wakeupinterval":"86400","tcn":true,"ext_powersupply":"12"};
		var current = js.mixIn(values);
		var requested = Object.create(current);
	
		window.app_data = { 
			settings: settings,
			eswsensors: eswsensors,
			locale: window.locale,
			rest_uri: rest_uri,
			Modem: {
				_values: { // -> _settings
					original: values,
					current: current,
					requested: requested
				},
				
				template_topportparameters: function(paramsOnly) {
					var sensor = eswsensors[requested.ext_eswsensor], r = {};
					var parameters = window.app_data.Modem._values.original.topportparameters;
					if(sensor && sensor.template) {
						try {
							for(var ch in sensor.template.channels) {
							var rch = (r[ch] = {});
							for(var p in sensor.template.channels[ch].parameters) {
								var param = sensor.template.channels[ch].parameters[p];
								var desc = param.description.split(";");
								var value = parameters.hasOwnProperty(p) ? 
									parameters[p] : param.value;
								rch[p] = getParam(p, {
									identifier: p, label: desc[0] || p, 
									description: desc[1] || (ch + ";" + p),
									value: value, unit: desc[2] || "", channels: []
								});
								if(rch[p].channels.indexOf(ch) === -1) {
									rch[p].channels.push(ch);
								}
							}
						}
						} catch(e) {
							return r;
						}
					}
					if(paramsOnly === true) {
						var params = {};
						for(var ch in r) {
							for(var p in r[ch]) {
								params[p] = r[ch][p];
							}
						}
						r = params;
					}
					return r;
				},
		
				/*- Extra statefull stuff */
				ext_eswsensor_enabled: true,//ext_eswsensor_enabled,
				newbattery: function() {
					if(this._values.requested.hasOwnProperty("battery")) {
						return app_data.Modem.battery();
					}
					return window.locale("Setting/newbattery.false");
				},
				
				hasValue: function(name) {
					return this._values.requested.hasOwnProperty(name) || 
						this._values.current.hasOwnProperty(name);
				},
				originalValueOf: function(name, raw) {
					var values = this._values.original;
					var obj = {_values: {requested: values, current: {}, original: {}}};
					return raw ? values[name] : this[name].apply(obj, []);
				},
				requestOriginal: function(name) {
					this._values.requested[name] = this.originalValueOf(name, true);
				}
			}
		};
	
		if(values.sendinterval === -1) {
			requested.sendinterval = 86400;
		}
		if(values.wakeupinterval === -1) {
			requested.wakeupinterval = 86400;
		}
		if(values.barologinterval === -1) {
			requested.barologinterval = 3600;
		}
		
		settings.forEach(function(def) {
			var name, f;
			if(def instanceof Array) {
				name = def[0];
				f = function() { return Date.now(); }; //Factories.lookup(name, def[1]);
			} else {
				name = def;
				f = function() { return Date.now(); }; //Factories.value(name);
			}
			if(window.app_data.Modem[name] !== undefined) {
				// TODO js.inherited
			} else {
				window.app_data.Modem[name] = f;
			}
		});
	}());

var Framework7 = require("Framework7");
var html = require("text!blocks/prototypes/Framework7-root.html");

var styles = {
	"#root": {
		"background-color": "#f0f0f0",
		".view": "top:0;bottom:0;right:0;left:0;position:absolute;"
	}
};
var vars = {
	routes: [
		{path: "/", componentUrl: "pages/Main.html"},
		{path: "/settings/location/", componentUrl: ms("location")},
		{path: "/settings/allportsic/", componentUrl: ms("allportsic")},
		{path: "/settings/topport/", componentUrl: ms("topport")},
		{path: "/settings/topportparameter/:id", componentUrl: ms("topportparameter")},
		{path: "/settings/ext_eswsensor/", componentUrl: ms("ext_eswsensor")},
		{path: "/settings/ext_powersupply/", componentUrl: ms("ext_powersupply")},
		{path: "/settings/ext_interfacetype/", componentUrl: ms("ext_interfacetype")},
		{path: "/settings/requestconfirmconfiguration/", componentUrl: ms("requestconfirmconfiguration")},
		{path: "/settings/newbattery/", componentUrl: ms("newbattery")},
		{path: "/settings/battery/", componentUrl: ms("battery")},
		{path: "/settings/emailaddress/:index/", componentUrl: ms("emailaddress")},
		{path: "/settings/interval/:name/", componentUrl: ms("interval")}
	]
};
var handlers = {
	
	"#root show": function() {
		var vars = this._owner.vars();
		if(vars.fw7) return;
		
		vars.fw7 = new Framework7({
			root: vars.node || this._node,
			theme: vars.theme || "ios" || "auto",
			routes: vars.routes || []
		});
		
		// TODO where does this come from?
		document.documentElement.classList.remove("ios");
	}
};

["Container", { handlers: handlers, vars: vars, css: styles }, [

	["Container", "root", { classes: "ios", content: html }]		
	
]];