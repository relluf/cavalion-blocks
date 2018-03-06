"use strict";

["Page", {}, [
	
	["Executable", "close", { execute: () => [].router(this).back() }],
	
	/*- referencing inherited component topbar */
	["#topbar", [
		
		/*- introducing extra UI for close Executable */
		["vcl-ui:Button", { executable: "close" }],
		
		/* Use dedicated blocks For better abstraction */
		["BarItem", { executable: "close" }]
		
	]],
	
	/*- relative to here */
	["./Sidebar"],
	
	/*- relative to app root */
	["Tabs", "workspaces"]
	
]];
















//["Page", "name", { property: "value"}, [ ["A"], ["B"] ]]