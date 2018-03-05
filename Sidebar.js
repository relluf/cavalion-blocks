"use strict";

["vcl-ui/Panel", {}, [
	[["Tabs", "Toggleable"], "tabs", {
		toggleOn: function() { this.hide(); },
		toggleOff: function() { this.show(); }
	}]
	
	/*- resize handle? */
]];


/*- Toggleable */
[[], {
	loaded: function(config) {
		this.setVar("toggle", config.value);
	}
}];