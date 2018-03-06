"use Data, locale";
"use strict";

var Data = require("Data");
var locale = require("locale");

var handlers = {
	onLoad: function() {
		var me = this, workspaces = this.scope().workspaces;
		Data.bind([workspaces, "tabs"], {
			to: function() {
				
			},
			from: function() {
				
			}
		});
	}
};


["vcl-ui:Form", { handlers: handlers }, [
	
	["vcl-ui:Tabs", "workspaces", { align: "bottom" }]

]];