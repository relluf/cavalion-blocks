"use locale, js";
"use strict";

var locale = window.locale;//require("locale");
var js = require("js");
var override = require("override");

var config = { text: locale("-text.default") }; //- defaults to name in "design mode"?

["vcl-ui:Tab", {//, Executable", { 
	onLoad: function() {
		this.setText(this._name);
		override(this, "select", function(select) {
			return function() {
				if(!this._control) {
					var me = this;
					require([String.format("blocks/Factory!ide/%s<%s>", this.getSpecializer(), this._name)], function(factory) {
						
						if(me._control) return;
						

						
					});
				}
				
				return select.apply(this, arguments);
			};
		});
	},
	
	execute: function() {
			
	},
	
	// loaded: function() {
	// 	var me = this;

	// 	// js.mixin(this, ((dblclick, select) => ({
	// 	// 		dblclick: function() {
	// 	// 			return dblclick.apply(this, arguments);
	// 	// 		},
	// 	// 		select: function() {
	// 	// 			return select.apply(this, arguments);
	// 	// 		}
	// 	// 	})
	// 	// )(["dblclick", "select"].map(k => me[k])));
		
	// },
	
	// dblclick: [].override(function(dblclick) {
	// 	return function() {
	// 		return dblclick.apply(this, arguments);	
	// 	};
	// }),
	// select: [].override(function(select) {
	// 	return select.apply(this, arguments);	
	// })

}];

