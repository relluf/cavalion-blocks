// "use strict";

var css = {
	"": "padding:32px; background-color:#f0f0f0;",
	".{Input}": {
		"": "border-radius:13px;border:1px so_lid #999; background-color:white;display:flex; padding:4px;",
		// ">div:active": "box-shadow: 0px 0px 0px 1px yellow inset;background-color:red;",
		// ">div>div": "display: inline-block;padding:4px;",
		"&.large": "font-size: 32px;"
	},
	
	"&.fix-outline": { 
		"input": "border:none;padding:2px 24px;flex:1;border-radius:5px;",
		"input:focus": "outline:none;box-shadow: 0 0 2pt 2pt rgba(51,121,217,0.77);"
	}
	
};

var overrides_Input = {
	
	getElement() {
		return "div";	
	},
	getInnerHtml() {
		return "<div></div><input>";
	},
	initializeNodes() {
		this._nodes.input = this._node.childNodes[1];
		this.inherited(arguments);	
	}

};

["Container", { classes: "fix-outline", css: css, zoom: 1 }, [
	["Input", "input", {
		// value: ""<
		classes: "fix-outline",
		overrides: overrides_Input,
		placeholder: "Search...",
		onChange: function() {
			
		}	
	}],
	
	["Input", {
		css: "margin-top: 30px;",
		classes: "fix-outline large",
		value: "text"
	}]
]];