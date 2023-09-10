[("Container<>.glassy.closex"), {
	onLoad() {
		let spec = this.getSpecializer(), uri;
		
		// if spec is number maybe not set uri?
		
		if(!spec) {
			uri = this.vars("uri");
		} else {
			uri = spec;
		}
		
		B.i([uri]).then(c => c.set({
			parent: this,
			zoom: this.vars("zoom") || 1
		}));
		
		return this.inherited(arguments);
	}
}];