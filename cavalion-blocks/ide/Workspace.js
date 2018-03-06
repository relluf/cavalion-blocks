"use locale";
"use strict";

var locale = require("locale");

["Page", {}, [

	["Topbar", {}, [
		["Location"],
		["veldoffice/Session"]
	]],
	
	["Sidebar", {}, [
		["tabs", [
			["Tab", { controls: ["./Navigator", "navigator"] }],
			["Tab", { controls: ["./Recent", "recent"] }],
			["Tab", { controls: ["./Outline", "outline"] }]
		]]
	]]
]];

