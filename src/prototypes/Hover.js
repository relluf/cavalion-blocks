// getStorageKey might solve the problem/challenge with a not being able to specify (specializer) the (automagically created) Hover<>-instance (since it would lead to many implicit bases when dealing with long uri paths) embedding the actual blocks component of interest

[("Container<>.glassy.closex"), {
	onDispatchChildEvent(component, name, evt, f, arg) {
		if(name === "click") {
			this.nextTick(() => this.bringToFront());
		}
		return this.inherited(arguments);	
	},
	onLoad() {
		let spec = this.getSpecializer(), uri = this.vars("uri");
		let props = {
			parent: this,
			owner: this,
			zoom: this.vars("zoom") || 1
		};
		
		// if spec is number maybe not set uri?
		
		if(!uri) {
			uri = spec;
		}
		
		B.i([this.vars("storage-uri", uri || this.vars("storage-uri"))], { 
			loaded: (c) => { 
				// alert("loaded delayed"); 
				this.emit("container-ready", [c]);
			}
		})
		.then(c => c.set(props).loaded() );
		
		return this.inherited(arguments);
	},
	overrides:{
		renderZoom() {
			const embedded = this.getControl(1);
			if(embedded) {
				embedded.set("zoom", this._zoom || 1);
			}
		},
		getStorageKey(key) {
			const su = this.vars("storage-uri");
			if(su) {
				// this.print(js.sf("getStorageKey(%s): %s %s", key || "", su, key || ""));
				return key === undefined ? su : js.sf("%s %s", su, key);
			}
			
			return this.inherited(arguments);
		}
	}
}];