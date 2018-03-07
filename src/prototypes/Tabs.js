"use Data, vcl/ui/Tab";
"use strict";

var Data = require("Data");
var Tab = require("vcl/ui/Tab");

var handlers = {
	nLoad_: function() {
		var me = this;
		Storage.get([this.uri(), "workspaces"], function(workspaces) {
			workspaces.forEach(_ => Tab.create({
					parent: me, text: _.name
				}));
		});
	},
	onLoad: function() {
		// selector: ide/Workspace<code> #sidebar
		var parent = this;
		Data.bind([this, "tabs"], function(local, remote) {
			if(!local && remote) {
				local = new Tab();
				local.setParent(parent);
			} else if(local && !remote) {
				return local.destroy();
			}

			var properties = local.defineProperties();
			for(var k in remote) {
				properties[k].set(local, remote[k]);
			}
		});
	}
};
var bindings = {
	tabs: {
		get: function() {},
		set: function() {}
	}
};

["vcl-ui:Tabs", { handlers: handlers, bindings: bindings }];

/*- wat je dus doet is een storage/customize-point introduceren */