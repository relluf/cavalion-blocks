
require(["vcl/Application"], (Application) => Application.get().set("css", {
	'.prototypes-loading:not(:last-child)': "display: none;"
}));


if (!document.getElementById("pulse-keyframes")) {
	const style = document.createElement("style");
	style.id = "pulse-keyframes";
	style.innerHTML = `
		@keyframes pulse-opacity {
			0% { opacity: 0.75; backdrop-filter: blur(0px); }
			50% { opacity: 0.95; backdrop-filter: blur(5px); }
			100% { opacity: 0.75; backdrop-filter: blur(0px); }
		}
		.prototypes-loading {
			animation: pulse-opacity 1.5s ease-in-out infinite;
		}
	`;
	document.head.appendChild(style);
}


["vcl-ui:Panel", {
    align: "none",
    autoSize: "both",
    classes: "prototypes-loading",
    css: {
        'backdrop-filter': "blur(5px)", 'z-index': "10000",
        left: 0, top: 0, bottom: 0, right: 0, //opacity: "0.75", 
        background: "rgba(255,255,255,0.75) url(/shared/vcl/images/loading.gif) no-repeat center center",
    },

    vars: {
    	// destroyOnHide: true,
    	// visibleOnLoad: true
    	// 
    },
    
    /* TODO fade out */
    onLoad() {
        var canHide = Date.now();
        
        if(this.vars("visibleOnLoad") === false) {
        	this.hide();
        }
        
        if(!this['@properties'].hasOwnProperty("parent")) {
        	this.set("parent", this.app().qs("#window"));
        }
        
        this.override({
            showNode: function() {
                this.clearTimeout("hideNode");
                canHide = Date.now() + 250;
                return this.inherited(arguments);
            },
            hideNode: function() {
                const args = js.copy_args(arguments);

                this.setTimeout(() => {
                    this.inherited(args);
                    
                    if(this.vars("destroyOnHide") !== false) {
                    	this.nextTick(() => this.destroy());
                    }
                    
                }, Math.max(canHide - Date.now(), 0));
            }
        });
        
        return this.inherited(arguments);
    }
}];