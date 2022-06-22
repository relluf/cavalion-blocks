var WIDTH = 985, HEIGHT = 600, ZOOM_C = 1;

[(""), {
	autoSize: "both", autoPosition: "all", align: "none",
	classes: "right shrink-to-corner with-shadow",
	css: {
		'': {
			'flex-shrink': "0",
			// 'box-shadow': "0 0 20px 10px rgba(0,0,0,.2)",
			'height': HEIGHT + "px",
			'width': WIDTH + "px",
			// 'margin-left': "auto",
			// 'margin-right': "auto",
			'top': "5%", 
			'border-radius': "25px",
			'background': "transparent",
			'align-self': "center",
			'box-sizing': "border-box",
			'z-index': "1999",
			// "border': "3px solid rgba(0,0,0,0.05)",
			'transition': "transform 0.45s ease 0s, left 0.45s ease 0s, right 0.45s ease 0s, top 0.45s ease 0s, bottom 0.45s ease 0s, width 0.45s ease 0s, height 0.45s ease 0s, border-width 0.45s ease 0s"
		},
		'.wrapper': {
			'position': "relative",
			'border-radius': "20px",
			'border': "7px solid rgba(0,0,0,0)",
			'overflow': "hidden",
			'height': "100%",
			'transition': "border-color 0.45s ease 0s",
			// '&:hover': {
			// 	'border-color': "gold"
			// }
		},
		"&.glassy-overlay > .wrapper.no-margin": "margin:0;",
		"&.right": "right: 40px; transform-origin: top right;",
		"&.left": "left: 40px; transform-origin: top left;",
		
		'&.shrink-to-corner:not(:hover)': {
			'width': 175 + "px",
			'height': 175 + "px"
		},

		'&:not(.no-transparent-effects)': {		
			'.{List}': "border-radius:5px;",
			'.{ListHeader}': {
				"": "background-color:transparent;transition:background-color 1s ease 0s;", 
				"&.scrolled": "background-color:rgba(255,255,255,0.75);", 
				">div": "background-image:none;border:none;font-weight:bold;"
			},
			'*': "text-shadow: none;",
			'.{Input}': {
				'input': 'background-color: rgba(255,255,255,0.2);',
				'input:focus': 'background-color: rgba(255,255,255,0.9);'
			}
		}
	},
	
	onLoad() {
		this.addClasses("glassy glassy-overlay"); // so that classes-property be used
		this.override({
	       // renderZoom: function() {
	       // 	/** @overriding vcl/ui/Panel - transform-origin will be set by css */
	       // 	var zoomed = this.hasOwnProperty("_zoom");
	       // 	var style = this._node.style;
	       // 	if(zoomed) {
	    			// style.transform = String.format("scale3d(%s, %s, 1)", this._zoom, this._zoom);
	       // 	} else {
	       // 		style.transform = "";
	       // 	}
	       // },
			initializeNodes: function() {
				this.inherited(arguments);
				
				this._node.innerHTML = "<div class='glassy wrapper no-margin'></div>";
				this._nodes.client = this._node.childNodes[0];
			},
			getClientNode: function(control) {
				this._node || this.nodeNeeded();
				
				return this._nodes.client;
			}
		});
		return this.inherited(arguments);
	},
	onNodeCreated() {
		this.set("parent", this.up("devtools/Workspace<>:root") || this.app().qs("#window"));
		return this.inherited(arguments);
	}
	
}];