"use override, vcl/Action";

var Action = require("vcl/Action");
var override = require("override");

override(Action.prototype, "getContent", function(inherited) {
	return function() {
		return inherited.apply(this, arguments) || String.format("<i>%s</i>", this._name);
	};
});

["vcl:Action", {}, []];