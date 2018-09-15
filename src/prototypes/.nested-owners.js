/*- .nested-owners ensures that nested components are owned by their parent, where normally they would be owned by the root component.

	["", {}, [
	
		["Executable", "submit", {}, [
		
			["Query<Customer>", "query", {}],
			
			["Store<Customer>", "store", {}],
			
			["Node<Customer>", {
				onNodesNeeded: function() {
					var instance = this.scope("store").get();
					
				}
			}]
		
		]]
	
	]]

*/

["", {
	onLoad: function() {
		if(this.hasOwnProperty("_components")) {
			[].concat(this._components).forEach((comp) => {
				if(comp._parentComponent && (comp._parentComponent !== comp._owner)) {
					comp.setOwner(comp._parentComponent);
				}	
			});
		}
		return this.inherited(arguments);
	}
}];