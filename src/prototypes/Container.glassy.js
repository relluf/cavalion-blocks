"use util/HtmlElement";

var HE = require("util/HtmlElement");

var WIDTH = 985, HEIGHT = 600, ZOOM_C = 1;

[("Container"), {
	autoSize: "none", _autoPosition: "all", align: "none",
	classes: "with-shadow",
	draggable: true,
	
	height: 500, width: 375,
	top: 100, left: 200,
	
	css: { 
		/* TODO CSS definitions must (eventually) be moved to App.glassy */
		'': {
			// 'height': HEIGHT + "px",
			// 'width': WIDTH + "px",
			'top': "5%", 
			// 'height': "100%",
			
			'min-width': "54px",
			'min-height': "54px",

			'border-radius': "5px",
			'z-index': "1999",
			'backdrop-filter': "blur(10px)",
			'transition': "box-shadow 0.45s ease 0s, transform 0.45s ease 0s, left 0.45s ease 0s, right 0.45s ease 0s, top 0.45s ease 0s, bottom 0.45s ease 0s, width 0.45s ease 0s, height 0.45s ease 0s, border-width 0.45s ease 0s"
		},
		'&:hover': {
			'box-shadow': "0 0 10px 5px rgba(0,0,0,.2)",
			'cursor': "move",
			'.client': "border-color: rgba(56,127,217,0.025); background-color:rgba(155, 155, 155, 0.2);"
		},
		// '&.square': {
		// 	'min-width': 175 + "px",
		// 	'min-height': 175 + "px"
		// },
		'&.dragging': {
			'transition': "box-shadow 0.15s ease 0s" || "transform 75ms ease-out 0s, left 75ms ease-out 0s, right 75ms ease-out 0s, top 75ms ease-out 0s, bottom 75ms ease-out 0s, width 75ms ease-out 0s, height 75ms ease-out 0s, border-width 0.45s ease 0s",

			'box-shadow': "0 0 20px 10px rgba(0,0,0,.2)",
			'.client': {
				'border-color': "rgba(56,127,217,0.4)" || "rgba(255,215,0,0.75)"
			}
			
		},
		'&.glassy-overlay > .client.no-margin': "margin:0;",
		'&.right': "right: 40px; transform-origin: top right;",
		'&.left': "left: 40px; transform-origin: top left;",

		'&.shrink-to-corner:not(:hover)': {
			'width': 175 + "px",
			'height': 175 + "px"
		},
		'&:not(.no-transparent-effects)': {		
			'*': "text-shadow: none;",
			'.{List}': "border-radius:5px;",
			'.{ListHeader}': {
				"": "background-color:transparent;transition:background-color 1s ease 0s;", 
				"&.scrolled": "background-color:rgba(255,255,255,0.75);", 
				">div": "background-image:none;border:none;font-weight:bold;"
			},
			'.{Input}': {
				'input': 'background-color: rgba(255,255,255,0.2);',
				'input:focus': 'background-color: rgba(255,255,255,0.9);'
			}
		},
		
		'input': {
			// 'flex': "1 1 0%",
		    // 'transition': "width 0.5s ease 0s",
		    // 'width': "150px"
		    'padding': "5px",//"5px 24px",
		    'border-radius': "5px",
		    'border': "none",
		    'background': "rgba(255, 255, 255, 0.2)"
		},
		
		'.client': {
			'position': "relative",
			'border-radius': "5px",
			'border': "7px solid rgba(0,0,0,0)",
			// 'overflow': "hidden",
			'height': "100%",
			'transition': "border-color 0.45s ease 0s, background-color 0.45s ease 0s",
			'&:hover': {
			}
		},
		'.seperator.seperator.seperator': "border-top: 1px solid rgba(155, 155, 155, 0.55);"
	},
	
	onLoad() {
		// TODO CVLN-20230608-1 // var parent = this.up("devtools/Workspace<>:root");
		
		var parent = this.app().qs("#window");
		var ar = parent.getAbsoluteRect();

		this._left = ar.width / 2 - 5;
		this._top = ar.height / 2 - 5;
		this._height = this._width = 100;

		this.nextTick(() => this.set("parent", parent));

		this.addClasses("glassy glassy-overlay"); // so that classes-property can be used
		this.override({
	    	createDragger() {
	    		const dragger = this.inherited(arguments);
				const ar1 = this.getAbsoluteRect();
				let transform;
	    		dragger.override({
	    			createHandles(evt) {
						var ar = this._control.getAbsoluteRect();
						var sh = this._sizehandle = HE.fromSource("<div></div>");
    					sh.style.border = "2px solid black";
    					sh.style.position = "absolute";
    					sh.style.zIndex = "999999";
    					this._control.getParent().getClientNode().appendChild(sh);
    					this._control.bringToFront();
    					transform = this._control._node.style.transform;
	    			},
	    			updateHandles(evt) {
	    				const style = this._control._node.style;
	    				let cursor = style.cursor;
	    				if(cursor === "") {
							/** This will just move the control, override to change behaviour */
							var eX = parseInt(evt.clientX / 8, 10) * 8;
							var eY = parseInt(evt.clientY / 8, 10) * 8;
							
							style.transform = js.sf("%s translate3d(%dpx, %dpx, 0)", transform, eX - this._sx, eY - this._sy);
	    				} else {
	    					var dx = evt.clientX - this._sx, dy = evt.clientY - this._sy;
	    					var ar = js.mi(ar1);
	    					
	    					dx = parseInt(dx / 8, 10) * 8;
	    					dy = parseInt(dy / 8, 10) * 8;
	    					
							cursor = cursor.split("-")[0].split("");
							
							if(cursor.includes("w")) {
	    						ar.left += dx;
	    						ar.width -= dx;
							} else if(cursor.includes("e")) {
								ar.width += dx;
							}
							
							if(cursor.includes("n")) {
								ar.top += dy;
								ar.height -= dy;
							} else if(cursor.includes("s")) {
								ar.height += dy;
							}

    						this._control.setBounds(ar.left, ar.top, undefined, undefined, ar.width, ar.height);
	    				}
	    			},
	    			destroyHandles(evt) {
	    				this._control._node.style.transform = transform;
	    				this._sizehandle.parentNode.removeChild(this._sizehandle);
	    				delete this._sizehandle;
	    			},
	    			mousedown(evt) {
	    				this.updateHandles(evt);
	    			},
	    			// end(evt) { },
					keyup(evt) {
						var r = this.inherited(arguments);	
						if(this._cancelled !== true) {
							if(this._control._node.style.cursor !== "") {
								var sh = (key) => parseInt(this._sizehandle.style[key], 10);
								this._control.setBounds(sh("left"), sh("top"), 0, 0, sh("width"), sh("height"));
								this.drop(evt);
								this.end(evt);
								return r;
							}
		
							var tx = this._control._node.style.transform.split("(")[1].split(",").map(s => s.trim());

							var x = parseInt(tx[0], 10) + this._control.getLeft();
							var y = parseInt(tx[1], 10) + this._control.getTop();
							
							this.drop(evt);
							this.end(evt);
		
							this._control._node.style.transform = transform;
							this._control.setBounds(x, y);
						}
						return r;
					},
	    			drop(evt) {
	    				var cursor = this._control._node.style.cursor;
	    				if(cursor === "") {
							/** This will just move the control, override to change behaviour */
							this._control.setBounds(
								evt.clientX - this._sx + this._control.getLeft(), 
								evt.clientY - this._sy + this._control.getTop()
							);
	    				} else {
		    				this.updateHandles(evt);
	    				}
	    				this._control._node.style.transform = transform;
	    			}
	    		}, true);
	    		return dragger;
	    	},
			initializeNodes: function() {
				this.inherited(arguments);
				
				this._node.innerHTML = "<div class='glassy client no-margin'></div>";
				this._nodes.client = this._node.childNodes[0];
			},
			getClientNode: function(control) {
				this._node || this.nodeNeeded();
				return this._nodes.client;
			}
		});
	
		this.print("onLoad", this);	
		
		return this.inherited(arguments);
	},
	onNodeCreated() {
		this.readStorage("bounds", (bounds) => {
			if(bounds) {
				this._width = bounds.width;
				this._height = bounds.height;
				this.setBounds(bounds.left, bounds.top, bounds.width, bounds.height);
			}
		});
		
		// this.vars("navigator").setParent(this);

		return this.inherited(arguments);
	},
	onDestroy() {
		var nav = this.vars("navigator");
		if(nav) {
			delete nav.isVisible;
			nav.setParent(this.vars("parent"));
		}
	},
	
	onDispatchChildEvent(component, name, evt, f, args) {
		if(name === "mousemove" && evt.altKey === true && evt.metaKey === true) {
			this.onmousemove(evt);
		}
		return this.inherited(arguments);
	},
	onDragStart(evt) {
		this.addClass("dragging");
	},
	onDragEnd(evt) {
		this.removeClass("dragging");
		this.writeStorage("bounds", this.getAbsoluteRect());
	},
	onMouseMove(evt) {
		if(evt.altKey === true && evt.metaKey === true) {
			this.dispatch("dragstart", evt);
		}
		var ar = this.getAbsoluteRect(), bw = 7, cursor = [];
		if (evt.clientY < ar.top + bw) {
			cursor.push("n");
		} else if (evt.clientY > ar.top + ar.height - 2*bw) {
			cursor.push("s");
		}
		if (evt.clientX < ar.left + bw) {
			cursor.push("w");
		} else if (evt.clientX > ar.left + ar.width - 2*bw) {
			cursor.push("e");
		}
		this._node.style.cursor = cursor.length ? cursor.join("") + "-resize" : "";
	},
	
	
}, []];


	// onMouseEnter(evt) { this.print("mouseenter", evt); },
	// onMouseLeave(evt) { this.print("mouseleave", evt); },
	// onMouseDown(evt) {
	// 	// this.addClass("dragging");
	// },
	// onKeyUp(evt) {
	// 	// this.removeClass("dragging");
	// }
	// ["veldapps/Map", [
		
	// 	["#tree", { visible: false }]
		
	// ]],
	// ["Tree", { css: {
	// 	'': "pointer-events:none;padding:10px;",
	// 	'*': "pointer-events:all;"
	// } }, [
	
	// 	["Node", {
			
	// 		text: "Root", expandable: true,
	// 		onNodesNeeded(parent) {
	// 			if(parent === this) {
	// 				const Node = this.constructor; 
	// 				([1,2,3].map(t => new Node({
	// 					text: t, parent: parent
	// 				})));
	// 			}
	// 			return false;
	// 		}
			
	// 	}]	
		
	// ]],
	
	// ["Container", { css: "background-color: red;", align: "client" }]	
	

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
	    	// dispatch(name, evt) {
	    	// 	if(name.includes("drag")) {
	    	// 		this.print(name, evt);
	    	// 	}
	    	// 	return this.inherited(arguments);
	    	// },
