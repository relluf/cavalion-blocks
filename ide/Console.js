"use strict";

["vcl-ui:Console", "console", {
	onEvaluate: function(expr) {
		var scope = this.scope();
		var vars = this.vars.bind(this);

		return eval(expr);
	}
}, []];