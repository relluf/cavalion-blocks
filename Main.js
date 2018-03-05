"use locale, util/net/Url, util/HotkeyManager";
"use strict";

var HotkeyManager = require("util/HotkeyManager");
var Url = require("util/net/Url");
var locale = require("locale");

[["Page"], {}, [
	
	// Actionables, Executables, Hotkeys, ...

/*- Notification, Status ... */
	
	/*- top-aligned, notification area */
	[["Topbar"], {}, [
		[["Location"], ""],
		[["veldoffice/Session"]]
	]],
	
/*- Navigation ... */

	/*- left-aligned, Shift+Cmd+0 */
	[["Sidebar"], {}, [
		/*- Shift+Cmd+1-9, Ctrl+F11 */
		[["#tabs"], { vars: { tabs: [] } }, [
			[["Tab"], { controls: "navigator", text: locale("Navigator") }],
			[["Tab"], { controls: "recent", text: locale("Recent") }],
			[["Tab"], { controls: "outline", text: locale("Outline") }]
		]],
		[["Navigator"], "navigator"],
		[["Recent"], "recent"],
		[["Outline"], "outline"]
	]],
	
/*- Detail ... */

	/*- client-aligned */
	[["ListOf<>"], { classes: "most-relevant" }, []],
	
/*- Nested detail ... */
	
	/*- right-aligned */
	[["SummaryOf<>"]]
	
/*- Advanced ... */
	
	/*- bottom-aligned */
	[["Workspaces"], {}, []],
	[["Console"], {}, []]
]];