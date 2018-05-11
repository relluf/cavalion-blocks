define(function(require) {
	
	require("stylesheet!./blocks.less");
	
	var PouchDB = require("pouchdb");

	/*- TODO
		- make less cavalion-vcl specific
		- implement another widget framework (pure HTML)
	*/

    function mapArrFn(arr, fn) {
        return arr.map(function(item) {
            if(item instanceof Array) {
                item = fn.apply(this, item);
            }
            return item;
        });
    }
    function parseBlock(inherits, name, properties, children) {
		var s = inherits;
    	if(typeof inherits === "string") {
    		if(inherits.charAt(0) !== "#") {
    			inherits = inherits.replace(/\s/g, "").replace(/,/g, " ").split(" ");
    			if(inherits.length === 1 && inherits[0].indexOf(":") !== -1 && inherits[0].indexOf("vcl-comps:") !== 0) {
    				inherits = inherits.pop(); // !! inherits pops into another dimension :-D
    			} else {
	    			// namespaced ctors (eg. vcl-ui:Tab) **MUST** be single?
	    			// console.log(s, inherits, name);
	    			// inherits.forEach(function(s, index) {
	    			// 	if(index > 0 && s.indexOf(":") !== -1) {
	    			// 		throw new Error("Multiple constructors, what happened?");
	    			// 	}
	    			// });
	    			// if(inherits[0].indexOf(":") !== -1) {
	    				// inherits = inherits[0];
	    			// } else {
	    				/*- Seems to me that this is not necessary... */
	    				// inherits = [inherits[0]];
	    			// }
    			}
    		} else {
    			// $i(...)
				if(name instanceof Array) {
					children = name;
					properties = {};
				} else {
					children = properties;
					properties = name;
				}
				return {
					name: inherits.substring(1),
					properties: properties || {},
					children: mapArrFn(children || [], arguments.callee)
				};
    		}
    	}
    	
    	var isarr = inherits instanceof Array;
		if(arguments.length === 1 && isarr && inherits.length > 0) {
			if(inherits[0] 
				&& inherits[0].hasOwnProperty("name") 
				&& inherits[0].hasOwnProperty("properties") 
				&& inherits[0].hasOwnProperty("children")
			) {
				children = inherits;
				properties = {};
				name = "";
				inherits = [];
			}
		} else if(typeof inherits === "object" && !isarr) {
			children = properties;
			properties = name;
			name = inherits;
			inherits = [""];
		}

		if(typeof inherits === "string" && inherits.charAt(0) === "@") {
			return new PropertyValue(inherits.substring(1));
		}
		
		if(typeof name !== "string") {
			children = properties;
			properties = name;
			name = "";
		}
		if(properties instanceof Array) {
			children = properties;
			properties = {};
		}
		if(typeof inherits === "string") {
			inherits = inherits.split("#");
			if(inherits.length === 2) {
				name = inherits[1];
			}
			inherits = inherits[0];
			
			if(inherits.endsWith("<>")) {
				inherits = [inherits.split("<").shift()];
			}
		}
		return {
			inherits: inherits instanceof Array ? inherits : undefined,
			className: typeof inherits === "string" ? inherits : undefined,
			name: name,
			properties: properties || {},
			children: mapArrFn(children || [], arguments.callee)
		};
	}

	var Blocks = {
		POSTFIX_SPECIALIZED: "<>/",
		PREFIX_PROTOTYPES: "blocks/prototypes/",
		PREFIX_APP: "cavalion-blocks/",
		DEFAULT_NAMESPACES: {
			"vcl": "vcl",
			"vcl-ui": "vcl/ui",
			"vcl-data": "vcl/data"
		},
		
		db: new PouchDB("cavalion-blocks"),
		
        parseUri: function (uri) {
            var r = {};

            uri = uri.split("<");
            if (uri.length === 2) {
                r.template = uri[0];
                r.namespace = uri[0].split(".")[0].split("/");
                r.name = r.namespace.pop();
                r.namespace = r.namespace.join("/");

                uri = uri[1].split(">");
                if ((r.specializer = uri.shift()) === "") {
                    r.template = "";
                }
                r.classes = uri.shift().split(".");
                if (r.classes[0] === "") {
                    r.classes.shift();
                }
            } else {
                // Only last part can have a dot (.) indicating classes
                r.classes = uri[0].split("/").pop().split(".");
                r.classes.shift();

                uri = uri[0].substring(0, uri[0].length - r.classes.join(".").length - 1);

                r.template = "";
                r.specializer = "";

                r.namespace = uri.split("/");
                r.name = r.namespace.pop();
                r.namespace = r.namespace.join("/");
            }

            if (r.specializer) {
                r.specializer = r.specializer.split(".");
                r.specializer_classes = r.specializer.splice(1);
                r.specializer = r.specializer.pop();
            } else {
                r.specializer_classes = [];
            }

            return r;
        },
        compileUri: function (keys) {

            var className = keys.className || (keys.classes ? keys.classes.join(" ") : "");
            var specializer = keys.specializer ? keys.specializer : keys.template ? keys.namespace || "" : "";
            var name = keys.name || "";
            var uri;
            if (className !== "") {
                className = String.format(".%s", className.split(" ").join("."));
            }

            if (name.indexOf(".") === -1) {
                name = "";
            } else {
                name = "." + name;
            }

            if (keys.specializer_classes instanceof Array && keys.specializer_classes.length) {
                specializer += String.format(".%s", keys.specializer_classes.join("."));
            }

            if (keys.template) {
                uri = String.format("%s<%s>%s%s", keys.template, specializer, name, className);
            } else {
                uri = String.format("%s%s%s%s", keys.namespace, keys.namespace ? "/" : "", keys.name, className);
            }

            return uri;
        },
        implicitBaseFor: function (uri, loop) {
            if (loop === true) {
                var arr = [];
                while (uri !== null) {
                    arr.push(uri);
                    uri = Blocks.implicitBaseFor(uri);
                }
                return arr;
            }
            
            var keys = Blocks.parseUri(uri);

            // ui/forms/persistence/View
            if (keys.specializer === "" && keys.classes.length === 0) {
                if (uri.indexOf("<>") !== -1) {
                    return uri.split("<")[0];
                }
                return null;
            }

            // ui/forms/persistence/View<X>.a
            if (keys.classes.length > 0) {
                delete keys.classes;
                return Blocks.compileUri(keys);
            }

            // ui/forms/persistence/View<X.b>.a
            if (keys.specializer_classes.length > 0) {
                delete keys.specializer_classes;
                return Blocks.compileUri(keys);
            }

            // ui/forms/persistence/View<X.a>
            if (keys.specializer !== "") {
                if (keys.specializer.indexOf("#") !== -1) {
                    if ((keys.specializer = keys.specializer.split("#")[0]) !== "") {
                        return Blocks.compileUri(keys);
                    }
                    // ui/forms/persistence/View<X/Y>
                } else if (keys.specializer.indexOf("/") !== -1 || keys.specializer.indexOf(":") !== -1) {
                    keys.specializer = keys.specializer.split("/");
                    if (keys.specializer.length === 1) {
                        keys.specializer = keys.specializer[0].split(":");
                    }
                    keys.specializer.pop();
                    if ((keys.specializer = keys.specializer.join("/")) !== "") {
                        return Blocks.compileUri(keys);
                    }
                }
            }

            // ui/forms/persistence/View<X>
            return keys.template;
        },
        implicitBasesFor: function (uri) {
            var base = Blocks.implicitBaseFor(uri);
            var r = [];

            if (base !== null) {
                var keys = Blocks.parseUri(uri);
                var classes = keys.classes;
                var spec_classes = keys.specializer_classes;
                if (classes.length > 1) {
                    // [A] Each class expands
                    classes.forEach(function (cls) {
                        keys.classes = [cls];
                        r.push(Blocks.compileUri(keys));
                    });
                } else if (classes.length === 1) {
                    if (spec_classes.length > 1) {
                        // [B] Each specializer_class expands
                        spec_classes.forEach(function (cls) {
                            keys.specializer_classes = [cls];
                            r.push(Blocks.compileUri(keys));
                        });
                    } else if (spec_classes.length === 1) {
                        // [C]
                        delete keys.specializer_classes;
                        r.push(Blocks.compileUri(keys));
                    } else if (keys.specializer) {
                        // [D] keys.classes.length === 1 && keys.specializer
                        delete keys.template;
                        delete keys.specializer;
                        r.push(Blocks.compileUri(keys));
                    } else if (uri.indexOf(Blocks.PREFIX_PROTOTYPES) !== 0) {
                        // [H] keys.classes.length === 1 && !keys.specializer && !prototypes/
                        r.push(String.format("%s%s", Blocks.PREFIX_PROTOTYPES, uri));
                    } else {
                        // [J] equals [G], continue on prototypes/ prefix
                    }
                } else if (spec_classes.length > 1) {
                    // [E] Each specializer_class expands
                    spec_classes.forEach(function (cls) {
                        keys.specializer_classes = [cls];
                        r.push(Blocks.compileUri(keys));
                    });
                } else if (spec_classes.length === 1) {
                    // [F]
                    delete keys.specializer_classes;
                    r.push(Blocks.compileUri(keys));
                } else if (keys.specializer) {
                    /*- [G] nothing todo here since there are no (spec_)classes
                     * and the implicit base is already pushed */
                } else {
                    /*- console.warn("Thought this was unreachable code"); */
                    // empty specifier due to: ComponentClass<>
                }

                // Always inherit the implicit base
                r.push(base);

            } else if (uri.indexOf(Blocks.PREFIX_PROTOTYPES) !== 0) {
                r.push(String.format("%s%s", Blocks.PREFIX_PROTOTYPES, uri));
            } else {
                // [I] it ends here, there is no implicit base for uri
            }
            return r;
        },
        implicitSourceFor: function (uri) {
            var uris = Blocks.implicitBasesFor(uri);
            if (uris.length === 0) {
                if (uri.indexOf(Blocks.PREFIX_PROTOTYPES) !== 0) {
                    uris.push(String.format("%s%s", Blocks.PREFIX_PROTOTYPES, uri));
                }
            }

            uris.sort(function (u1, u2) {
                // WRONG: 304 App.desktop --> $(["App", "vcl/prototypes/App.desktop"]);
                // RIGHT: 304 App.desktop --> $(["vcl/prototypes/App.desktop", "App"]);
                u1 = u1.indexOf(".scaffold");
                u2 = u2.indexOf(".scaffold");
                return u1 < u2 ? -1 : 1;
            });
            
            uris = uris.filter(function(uri, index) {
            	return uris.indexOf(uri) === index;
            });
            
            return String.format("[[\"" + uris.join("\", \"") + "\"]];");
        },
        
	    parse: parseBlock
	};
	
	return Blocks;
});