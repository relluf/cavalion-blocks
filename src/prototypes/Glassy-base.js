"use js";

["Container", {
	
	autoSize: "both", autoPosition: "all", align: "none",
	classes: "right shrink-to-corner with-shadow",

	css: {
		'&:before': {
			content: "",
		    position: "absolute",
		    top: "0",
		    left: "0",
		    right: "0",
		    bottom: "0",
		    // 'box-shadow': "inset 0 0 2000px rgba(255, 255, 255, .5)",
		    'backdrop-filter': "blur(10px)",
		    'background': "inherit",
		    // 'background-color': "red"//rgba(255,255,255,0.5)",
			
		},
		'': {
			'transition': "transform 0.45s ease 0s, left 0.45s ease 0s, right 0.45s ease 0s, top 0.45s ease 0s, bottom 0.45s ease 0s, width 0.45s ease 0s, height 0.45s ease 0s, border-width 0.45s ease 0s",
			'border': "7px solid rgba(0,0,0,0)",
			'border-radius': "25px",

			height: "100%", width: "50%",

			'overflow': "hidden",
			'z-index': "1999",

			// 'flex-shrink': "0",
			// 'top': "5%", 
		    // 'backdrop-filter': "blur(10px)",
		    'background': "inherit",
			// 'background': "transparent",
			// 'align-self': "center",
		},

		'&.right': "right: 40px; transform-origin: top right;",
		'&.left': "left: 40px; transform-origin: top left;",
		'&.shrink-to-corner:not(:hover)': {
			// 'width': 175 + "px",
			'height': 175 + "px"
		},
		
	},
	onNodeCreated() {
		this.set("parent", this.up("devtools/Workspace<>:root") || this.app().qs("#window"));
		return this.inherited(arguments);
	}
	
}];