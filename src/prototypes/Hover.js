// getStorageKey might solve the problem/challenge with a not being able to specify (specializer) the (automagically created) Hover<>-instance (since it would lead to many implicit bases when dealing with long uri paths) embedding the actual blocks component of interest
const classesByUri = (uri) => require("vcl/Component").getKeysByUri(uri).classes;

const destroy = (h) => setTimeout(() => h.destroy(), 0);
const load = (h) => {
	let spec = h.getSpecializer(), uri = h.vars("uri");
	let props = {
		parent: h.vars("parent") || h,
		owner: h.vars("owner") || h,
		zoom: h.vars("zoom") || 1,
		vars: h.vars("vars")
	};
	
	if(!props.vars) delete props.vars;
	
	// if spec is number maybe not set uri?
	
	if(!uri) {
		uri = spec;
	}
	
	h.getVar("storage-uri", false, uri);
	
	B.i([uri], { 
		loaded: (c) => { 

			c.override("destroy", function() {
				if(this._owner) {
					destroy(this._owner);
				}
				return this.inherited(arguments);
			});
			
			if(c._vars) {
				js.mi(c._vars, props.vars);
				delete props.vars;

				const ns = "no-shrinking";
				if(c.vars(ns) === true || classesByUri(uri).includes(ns)) {
					h.addClass(ns);
				}
			}

			h.vars("root", c);
			h.emit("container-ready", [c]);
		}
	})
	.then(c => {
		c.beginLoading();
		
		c.set(props); // TODO mixin vars, but how?
		c.endLoading();
		c.loaded();
	}); 
};

const mouseout = (h, evt) => {
	const ar = h.vars("ar", false, () => h.getAbsoluteRect());
	const cxy = h.documentToClient(evt.clientX, evt.clientY);

	const px = (cxy.x / ar.width) * 100;
	const py = (cxy.y / ar.height) * 100;

	h.setTimeout("out", () => {
		const node = h.vars("mousemove-overflow-node");
		if(node) {
			node.parentNode.removeChild(node);
			h.removeVar("mousemove-overflow-node");
			h.app().print(h, "(-) mousemove-overflow-node removed");
		}

		if(!h.hasClass("extend-hover")) {
			h.addClass("extend-hover");
			h.setTimeout("extend-hover", () => h.removeClass("extend-hover"), 650);
		}
		
		const style = h.getNode().style;
		if(!h.hasVar("transform-origin")) {
			h.vars("transform-origin", style.transformOrigin);
			h.setTimeout("restore-transform-origin", () => {
				// style.transition = "transform-origin 750ms";
				style.transformOrigin = h.removeVar("transform-origin");
				// h.setTimeout(() => style.transition = "", 750);
				// h.once("transitionend", () => h.app().toast({ content: "750ms ended", style: "fade glassy" }));
			}, 1000);
		}
		// style.transformOrigin = js.sf("%.3f%% %.3f%%", px, py);

		// h.app().toast({ content: "out", classes: "glassy big fade" });
	});
};
const mouseover = (h, evt) => {
	h.clearTimeout("out");
	
	if(evt.shiftKey) { // showCoords
		const toast = h.vars("toast", false, () => 
			h.app().toast({ 
				content: "!", classes: "fade glassy", 
				timeout: false }));
				
		const ar = h.vars("ar", false, () => h.getAbsoluteRect());
		const cxy = h.documentToClient(evt.clientX, evt.clientY);
				
		toast.show();
		toast.element.set("content", js.sf("%d, %d == %.3f%%, %.3f%%",
			evt.clientX, evt.clientY, 
			(cxy.x / ar.width) * 100, 
			(cxy.y / ar.height) * 100)
		);
		toast.hide(2000);
	}
};
const click = (h, evt) => {
	if(evt.altKey && evt.shiftKey) {
		const uri = h.vars("root").getUri();
		evt.preventDefault();
		if(confirm(js.sf("Reload %s?", uri))) {
        	req("blocks/Factory").unreq(uri);
        	
        	const root = h.vars("root");

			root.setOwner(null); 
			delete root._owner; // weird bug
			root.destroy();
			
			load(h);
		}
	}
	h.nextTick(() => h.bringToFront());
};

const garantee_overflow = (h, evt) => {
	const ar = h.vars("mousemove-absolute-rect", false, () => h.getAbsoluteRect());
	
	if(!h.vars("mousemove-overflow-node")) {
		const node = document.createElement("div"), m = 50;
		node.className = "glassy-overflow";
		node.style.left = (ar.left - m) + "px";
		node.style.top = (ar.top - m) + "px";
		node.style.width = (ar.width + 2*m) + "px";
		node.style.height = (ar.height + 2*m) + "px";
		
		h.getNode().parentNode.appendChild(node);
		h.vars("mousemove-overflow-node", node);
		
		h.app().print(h, "(+) mousemove-overflow-node created");
	}
};

[("Container<>.glassy.closex"), {
	onLoad() {
		this.vars("load", () => load(this));

		load(this);
		
		return this.inherited(arguments);
	},
	onDispatchChildEvent(component, name, evt, f, args) {
		if(name === "mousemove") {
			mouseover(this, evt);
		} else if(name === "mouseout") {
			mouseout(this, evt);
		} else if(name === "click") {
			click(this, evt);
		}
		return this.inherited(arguments);	
	},
	onMouseMove(evt) {
		// garantee_overflow(this, evt);
		mouseover(this, evt);
		return this.inherited(arguments);
	},
	onMouseOut(evt) {
		mouseout(this, evt);
		return this.inherited(arguments);
	},
	isRoot: true,
	overrides: {
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