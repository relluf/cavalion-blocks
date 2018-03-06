define(function(require) { "use strict";

	var Url = require("util/net/Url");
	var locale = require("locale");
	var Blocks;
	
	var Examples = [
		[["Page"], {}, [
			
			// [["Implements<Playable>"], { // or implements<Playable> ?
			// 	play: function() { },
			// 	pause: function() { },
			// 	stop: function() { }
			// }],
			
			/*- top-aligned */
			[["Topbar"], {}, [
				[["Location"], ""],
				[["veldoffice/Session"]]
			]],
			
			/*- left-aligned, Shift+Cmd+0 */
			[["Sidebar", "Toggleable"], {
				toggleOn: "show", // function() { this.show(); }
				toggleOff: "hide"
			}, [
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
		
			/*- client-aligned */
			[["ListOf<Document>"], "documents", {
				classes: "most-relevant",
				collection: "Collection<Document>.most-relevant"
			}, []],
			
			/*- bottom-aligned */
			[["Console"], {}, []]
			
		]],
		/*- Navigator */
		[["Page"], {}, [
		
			[["Tabs"], "tabs"]
			
		]],
		/*- Tabs */
		["vcl-ui/Tabs", { handlers: {
			
			onLoad: function() {
				
			},
			
			onInsertTab: function() {
				
				
			},
			
			onRemoveTab: function() {
				
			}
			
			
		}}, [
		
			
		]],
		/*- Tab */
		["vcl-ui/Tab", {
			text: "xs: set-get; stored;"
		}]
	];

	var factories = {};
	
	return (Blocks = { 
		use: function(use) {
			
		},
		require: function(path, callback, errback) {
			var uri = "text!cavalion-blocks/" + path + ".js";
			require([uri], function(source) {
				
				
				
			}, errback);
		},
		parse: function(url, source) {
			
		},
		load: function(url) {
			url = new Url(url);
			
			var path = url.getPath();
			var factory = factories[path];
			if(factories.hasOwnProperty(path)) {
				return factories[path]
			}
			Blocks.require(path, function(block) {
				factories[path] = new Factory({
					url: url,
					source: source
				});
				
				Blocks.parse(url, source);
			});
		
		} 
	});
	
});