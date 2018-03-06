"use locale";
"use strict";

var locale = require("locale");

var config = { text: locale("-text.default") }; //- defaults to name in "design mode"?

[["vcl-ui:Tab", config], {
	controls: {
		get: function() { return this.getControl(); },
		set: function(value) { 
			return this.setControl(value); 
		}
	},
	text: {
		get: function() { return this.getText(); },
		set: function(value) { return this.setText(value); }
	}
}];