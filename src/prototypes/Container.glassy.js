"use util/HtmlElement, vcl/ui/Input, vcl/ui/List";

var HE = require("util/HtmlElement");

function determinePosition(rectA, rectB) {
    // Calculate the center point of rectB
    const centerBX = rectB.x + rectB.width / 2;
    const centerBY = rectB.y + rectB.height / 2;

    // Divide rectA into thirds
    const thirdWidth = rectA.width / 3;
    const thirdHeight = rectA.height / 3;

    // Define the boundaries of the grid
    const leftBoundary = rectA.x + thirdWidth;
    const rightBoundary = rectA.x + 2 * thirdWidth;
    const topBoundary = rectA.y + thirdHeight;
    const bottomBoundary = rectA.y + 2 * thirdHeight;

    // Determine horizontal position
    let horizontalPos;
    if (centerBX < leftBoundary) {
        horizontalPos = 'right';
    } else if (centerBX < rightBoundary) {
        horizontalPos = 'center';
    } else {
        horizontalPos = 'left';
    }

    // Determine vertical position
    let verticalPos;
    if (centerBY < topBoundary) {
        verticalPos = 'bottom';
    } else if (centerBY < bottomBoundary) {
        verticalPos = 'middle';
    } else {
        verticalPos = 'top';
    }

    // Combine vertical and horizontal positions
    const position = verticalPos + horizontalPos;
    return position;
}
function setCursor(root, cursor) {
	const rule = ".override-cursor *";
	root._cssRules._rules[rule].style.cursor = cursor;
	root._node.style.cursor = root._cssRules._rules[rule].style.cursor;
}
function getCursor(root, evt) {
	var ar = root.getAbsoluteRect(), bw = 15, cursor = [];

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

	return cursor.length ? cursor.join("") + "-resize" : "";
}

[("Container"), {
	autoSize: "none", _XautoPosition: "all", align: "none",
	classes: "container-glassy with-shadow override-cursor",
	draggable: true,

	css: {
		'': "transition: transform 650ms;",
		'&:not(:hover):not(:active):not(.extend-hover):not(.no-shrinking):not(.dragging)': "transform: scale3d(0.667, 0.667, 0.667);",
		'&.override-cursor *': "cursor: default;",
		'&.centerly': "top: 7.5%; bottom: 7.5%; left: 10%; right: 10%;",
		
	    "#editors-tabs:focus": {
	    // ".{./Tabs}:focus": {
	    	"": "transition: background-color ease-in 0.2s; background-color: rgba(244, 253, 255, 0.94);",
	    	".selected": "border:1px solid rgb(57,121,204); background-color: rgb(57,121,204); color: white;",
	    	".menu": "color: white;"
	    }
		
	},
	
	height: 500, width: 375,
	top: 100, left: 200,
	
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

						if(evt.clientX === undefined) {
							evt.clientX = dragger.clientX;
							evt.clientY = dragger.clientY;
							if(evt.clientX === undefined) {
								this._control.print("ignoring drop without evt.clientX");
								return;
							}
						}

						dragger.clientX = evt.clientX; 
						dragger.clientY = evt.clientY;

	    				const style = this._control._node.style;
	    				let cursor = style.cursor;
	    				if(cursor === "" || cursor === "move") {
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
// this._control.print(js.sf("%s - _sx: %s, _sy: %s, evt: %s %s | dx: %s, dy: %s", cursor, this._sx, this._sy, dx, dy, ar.left, ar.top, undefined, undefined, ar.width, ar.height))
							
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
// this._control.print(js.sf("dx: %s, dy: %s - setBounds(%s, %s, %s, %s, %s, %s)", dx, dy, ar.left, ar.top, undefined, undefined, ar.width, ar.height))
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
							if(!["", "move"].includes(this._control._node.style.cursor)) {
								var sh = (key) => parseInt(this._sizehandle.style[key], 10);
								this._control.setBounds(sh("left"), sh("top"), 0, 0, sh("width"), sh("height"));
								this.drop(evt);
								this.end(evt);
								return r;
							}
		
							var tx = this._control._node.style.transform;
							if(tx === "") return; // have to bail out, smells like a bug
							
							tx = tx.split("(")[1].split(",").map(s => s.trim());

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
	    				var clientX = evt.hasOwnProperty("clientX") ? evt.clientX : dragger.clientX;
	    				var clientY = evt.hasOwnProperty("clientY") ? evt.clientY : dragger.clientY;
	    				if(cursor === "" || cursor === "move") {
							/** This will just move the control, override to change behaviour */
							this._control.setBounds(
								clientX - this._sx + this._control.getLeft(), 
								clientY - this._sy + this._control.getTop()
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
	
		// this.print("onLoad", this);	
		
		return this.inherited(arguments);
	},
	onNodeCreated() {
		
		this.readStorage("bounds", (bounds) => {
			if(typeof bounds === "string") {
				try { bounds = JSON.parse(bounds); } catch(e) { bounds = null; }
			}
			if(bounds) {
				this._width = bounds.width;
				this._height = bounds.height;
				this.setBounds(bounds.left, bounds.top, bounds.width, bounds.height);
			} else {
				const w = this.app().qs("#window");
				if(w) {
					const ar = w.getAbsoluteRect();
					this.setBounds(
						ar.width * 0.1, 
						ar.height * 0.07, 
						this._width = ar.width * 0.8, 
						this._height = ar.height * 0.86);
				}
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
		const BB = evt && (evt.altKey === true && evt.metaKey === true);
		
		if(name === "mousemove") {
			this.onmousemove(evt);
		} else if(name === "keydown" || name === "keyup") {
			if(["", "move"].includes(this._node.style.cursor)) {
				setCursor(this, BB ? getCursor(this, evt) || "move" : "");
			}
		}
		
		return this.inherited(arguments);
	},
	onMouseMove(evt) {
		var BB = evt.altKey === true && evt.metaKey === true;
		setCursor(this, BB ? getCursor(this, evt) || "move" : "");

		if(BB) {
			this.dispatch("dragstart", evt);
		}
	},
	onDragStart(evt) {
		this.addClass("dragging");
		// this.set({ autoSize: "none", autoPosition: "none" });
		// this.removeClass("centerly");
	},
	onDragEnd(evt) {
		this.removeClass("dragging");
		this.update(_=> this.writeStorage("bounds", js.sj(this.getAbsoluteRect())));
		
		const rectA = this.getAbsoluteRect();
		const rectB = this._parent.getAbsoluteRect();
		
		rectA.x = rectA.left; rectA.y = rectA.top;
		rectB.x = rectB.left; rectB.y = rectB.top;
		
		const prev = this.vars("parent-position");
		const curr = "parent-" + determinePosition(rectA, rectB);
		if(prev !== curr) {
			if(prev) {
				this.removeClass(prev);
			}
			this.addClass(curr);
		}
		this.vars("parent-position", curr);
	}

}, []];