["Container<>.glassy", {
	classes: "with-shadow",

	onLoad() {
		let spec = this.getSpecializer(), uri;
		
		// if spec is number maybe not set uri?
		
		if(!spec) {
			uri = this.vars("uri");
		} else {
			uri = spec;
		}
		
		B.i([uri]).then(c => c.setParent && c.setParent(this));
		
		return this.inherited(arguments);
	}
}, [
	["Executable", ("close"), { 
		content: "×",
		on() { this._owner.destroy(); }// queryClose?}
	}],

	["Element", ("close-x"), { action: "close" }]

]];