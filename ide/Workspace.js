"use locale";
"use strict";

var locale = require("locale");

["Page", {}, [

	// Actionables, Executables, Hotkeys, ...

/*- Notification, Status ... */
	
	/*- top-aligned, notification area */
	["Topbar", {}, [
		["Location"],
		["veldoffice/Session"]
	]],
	
/*- Navigation ... */

	/*- left-aligned, Shift+Cmd+0 */
	["Sidebar", {}, [
		/*- Shift+Cmd+1-9, Ctrl+F11 */
		["#tabs", [
			["Tab", { controls: ["./Navigator", "navigator"] }],
			["Tab", { controls: ["./Recent", "recent"] }],
			["Tab", { controls: ["./Outline", "outline"] }]
		]]
	]]
]];