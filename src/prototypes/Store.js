"use strict";

var handlers = {
	loaded: function() {
		// alert("Yeah baby!");
	}
};

["vcl:Component-parentIsOwner", { handlers: handlers }, [
	
	["Executable", "put", { 
		onExecute: function(evt) {
			var db = this.vars(["db"]);
			// get, merge, put
		}
	}]


]/*usually the block ends here, but let's...*/, {

	// TODO define [extra/new] interface to this block
	
	put: function(namespace, key, values) {
		return this.qsa("put").execute({ 
			namespace: namespace, key: key, 
			values: values
		});
	},
	
	// ...
	
}];