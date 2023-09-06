"";

["Container<>.glassy", {
	classes: "with-shadow",
	onLoad() {
		let spec = this.getSpecializer(), uri;
		if(!spec) {
			uri = this.vars("uri");
		} else {
			uri = spec;
		}
		
		B.i([uri]).then(c => {
			this.print("instantiated", c);
			c.setParent(this);
		});

		return this.inherited(arguments);
	}

}, [

	// ["Executable", ("toggle-visible"), {
	// 	hotkey: "F3",
	// 	onLoad() {
	// 		this.override("isHotkeyEnabled", () => this.isEnabled());
	// 	},
	// 	on() { this.up().toggle("visible") }
		
	// }]

]];