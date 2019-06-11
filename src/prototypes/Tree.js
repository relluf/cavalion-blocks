"use strict";

["vcl-ui:Tree", {

	onNodesNeeded: function(parent) { 
		var node = parent, pname = "_onChildNodesNeeded";
		while(node && !node.hasOwnProperty(pname)) {
			node = node._parent;
		}
		
		if(node === parent) return;
		
		if(node && node.hasOwnProperty(pname)) {
			return node.fire(pname.substring(1), [parent]);
		}
	}
 
}, [

	
]];