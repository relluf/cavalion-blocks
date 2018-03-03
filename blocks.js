"use strict";
"use locale, util/net/Url, util/HotkeyManager";

var HotkeyManager = require("util/HotkeyManager");
var Url = require("util/net/Url");
var locale = require("locale");

[["Page"], {}, [
	
	// [["Implements<Playable>"], { // or implements<Playable> ?
	// 	play: function() { },
	// 	pause: function() { },
	// 	stop: function() { }
	// }],
	
	/*- top-aligned */
	[["Topbar"], "sessions", {}, [
		
		[["Location"], ""],
		
		[["veldoffice/Session"], "veldoffice", {}]

	]],
	
	/*- left-aligned, Shift+Cmd+0 */
	[["Sidebar", "Toggleable"], {
		toggleOn: "show", // function() { this.show(); }
		toggleOff: "hide"
	}, [
		
		[["#tabs"], { vars: { tabs: [] } }, [
			[["Tab"], { controls: "navigator", text: locale("Navigator") }],
			[["Tab"], { controls: "recent", text: locale("Recent") }],
			[["Tab"], { controls: "outline", text: locale("Outline") }]
		]],

		[["Navigator"], "navigator"],
		[["Recent"], "recent"],
		[["Outline"], "outline"]

	]],

	/*- client-aligned */
	[["ListOf<Document>"], "documents", {
		classes: "most-relevant",
		collection: "Collection<Document>.most-relevant"
	}, []],
	
	/*- bottom-aligned */
	[["Console"], {}, []]
	
]];

/*- Navigator */
[["Page"], {}, [

	[["Tabs"], "tabs"]
	
]];

/*- Tabs */
["vcl-ui/Tabs", { handlers: {
	
	onLoad: function() {
		
	},
	
	onInsertTab: function() {
		
		
	},
	
	onRemoveTab: function() {
		
	}
	
	
}}, [

	
]];

/*- Tab */
["vcl-ui/Tab", {
	text: "xs: set-get; stored;"
}];