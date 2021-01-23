"use locale, js, blocks/Blocks";

/*- 
	
	vars("uri") - specifies specific uri, if not present:
		this.getSpecializer(); + this._name

*/

var locale = window.locale;
var js = require("js");
var B = require("blocks/Blocks");

var config = { text: locale("-text.default") }; //- defaults to name in "design mode"?

["vcl-ui:Tab", {
	handlers: {
		"selected": function() {
			var me = this, cls = this.getSpecializer();
			var uri = this.vars("uri"), specializer;
			
			if(this._control === null && (cls || uri)) {
				cls = cls ? cls.split("!") : [""];
				if(cls.length > 1) {
					specializer = cls.pop();
					cls = cls.join("!");
				} else {
					specializer = this._name;
					cls = cls.pop();
				}
				this._control = B.instantiate([uri || String.format("%s<%s>", cls, specializer)], {
					uri: uri || String.format("%s<%s>", cls.split(":").pop(), specializer),
					owner: this, setIsRoot: true,
					loaded: function(control) {
						var parent = me._parent.vars("parent") || me._parent._parent;
						
						me.setControl(control);
						control.setVisible(me.isSelected());
						control.setParent(parent);
						control.loaded();
					}
				});
			}
		},
		"unselected": function() {
			// this.app().print("unselected", this);
		}
		
	},
	vars: { 
		"Alt+Cmd": function(console, evt) {
			var control = this._control;
			this.app().confirm("Reload " + control._uri + "?", function(res) {
				
			});
		} 
	}
}];



//, Executable", { 
	// onLoad: function() {
	// 	this.setText(this._name);
	// 	override(this, "select", function(select) {
	// 		return function() {
	// 			if(!this._control) {
	// 				var me = this;
	// 				require([String.format("blocks/Factory!ide/%s<%s>", this.getSpecializer(), this._name)], function(factory) {
						
	// 					if(me._control) return;
						

						
	// 				});
	// 			}
				
	// 			return select.apply(this, arguments);
	// 		};
	// 	});
	// },
	
	// execute: function() {
			
	// },
	
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
