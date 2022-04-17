var WIDTH = 985, HEIGHT = 600, ZOOM_C = 2;

function e(e, o, t, i) {
    for (; o >= t && !e("(min-resolution: " + o / i + "dppx)").matches;) o--;
    return o;
}
function o(o) {
    if (void 0 === o && (o = window), !o) return 1;
    if (void 0 !== o.devicePixelRatio) return o.devicePixelRatio;
    var t = o.document.frames;
    return void 0 !== t ? void 0 !== t.devicePixelRatio ? t.devicePixelRatio : t.screen.deviceXDPI / t.screen.systemXDPI : void 0 !== o.matchMedia ?
    function (o) {
        for (var t = o.matchMedia, i = 10, r = .1, n = 1, c = i, d = 0; d < 4; d++) i = (c = 10 * e(t, i, r, n)) + 9,
        r = c,
        n *= 10;
        return c / n
    } (o) : 1
}
function zoomLevel() {
	return o.apply(this, arguments);
}

// Maybe introduce a .zoomy class?
// function elementZoomLevel(e, t) {
//     var i = (e instanceof Element ? getComputedStyle(e).zoom : e.zoom) || ZOOM_C;
//     return o(t) * ("string" == typeof i ? parseFloat(i) : i);
// }

[(""), {
	autoSize: "both", autoPosition: "all", align: "none",
	classes: "right -shrink-to-corner",
	css: {
		'': {
			'flex-shrink': "0",
			'box-shadow': "0 0 20px 10px rgba(0,0,0,.2)",
			'height': HEIGHT + "px",
			'width': WIDTH + "px",
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
	        renderZoom: function() {
	        	/** @overriding vcl/ui/Panel - transform-origin will be set by css */
	        	var zoomed = this.hasOwnProperty("_zoom");
	        	var style = this._node.style;
	        	if(zoomed) {
	    			style.transform = String.format("scale3d(%s, %s, 1)", this._zoom, this._zoom);
	        	} else {
	        		style.transform = "";
	        	}
	        },
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
	onDestroy() { 
		this.app().qs("#window").un(this.vars("listener")); 
	},
	onNodeCreated() {
		var zoomC = this.vars("zoomC") || ZOOM_C; // TODO find better name
		var moveLater = () => this.setTimeout("move", () => {
			// # CVLN-20220401-1-Panel-zoom-property	
			this._node.style.bottom = "";
			this._node.style.right = "";
		}, 1000);
		var win = this.app().qs("#window");
		var zoom0 = zoomLevel() / zoomC, width0 = win._node.clientWidth;

		this.set("parent", win);

this.print(js.sf("zoom0: %s, width0: %s", zoom0, width0));

		this.set("zoom", 1 / zoom0);
		this.vars("listener", win.on("resize", () => {
			var zoom = zoomLevel() / zoomC, width = win._node.clientWidth;

this.print(js.sf("width0: %s, width: %s %s", width0, width, zoom0 === zoom ? "!!!" : ""));

			if(width0 !== width) {
				this.set("zoom", (1 / zoom));
			} else {
				this.set("zoom", 1 / zoom0);
			}
			
			moveLater();

		}));

		moveLater();
		
		return this.inherited(arguments);
	},
	
	handlers: {
		'vcl/ui/List#list onScroll'(e) {
			var hasClass = this._header.hasClass("scrolled");
			var scrollTop = this._nodes.body.scrollTop;
			if(scrollTop > 40) {
				!hasClass && this._header.addClass("scrolled");
			} else {
				hasClass && this._header.removeClass("scrolled");
			}
			
			var list = this.ud("#labels");
			var scrollLeft = this._nodes.body.scrollLeft;
			hasClass = list.hasClass("scrolled");
			if(scrollLeft > 75) {
				!hasClass && list.addClass("scrolled");
			} else {
				hasClass && list.removeClass("scrolled");
			}
			
			// this.ud("#labels")._nodes.body.scrollTop = scrollTop;
		}
	},
	
	this_onDispatchChildEvent() {
		
	},
	list_onScroll() {
		var hasClass = this._header.hasClass("scrolled");
		var scrollTop = this._nodes.body.scrollTop;
		if(scrollTop > 40) {
			!hasClass && this._header.addClass("scrolled");
		} else {
			hasClass && this._header.removeClass("scrolled");
		}
		
		var list = this.ud("#labels");
		var scrollLeft = this._nodes.body.scrollLeft;
		hasClass = list.hasClass("scrolled");
		if(scrollLeft > 75) {
			!hasClass && list.addClass("scrolled");
		} else {
			hasClass && list.removeClass("scrolled");
		}
		
		this.ud("#labels")._nodes.body.scrollTop = scrollTop;
	}

}];