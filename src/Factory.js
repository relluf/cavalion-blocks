define(function(require) {

	/*-	The letters refer to specific cases in Blocks.implicitBasesFor

		[A] ui/entities/Query<Channel.by:a.by:b>.A.B
		[E]		ui/entities/Query<Channel.by:a.by:b>
		[G]			ui/entities/Query<Channel>
		[F]			ui/entities/Query<Channel.by:a>
		[G]				ui/entities/Query<Channel>
		[I]					ui/entities/Query
		[J]						prototypes/entities/Query
									!!!
		[F]			ui/entities/Query<Channel.by:b> --> ...
		[B]		ui/entities/Query<Channel.by:a.by:b>.A
		[E]			ui/entities/Query<Channel.by:a.by:b> --> ...
		[C]			ui/entities/Query<Channel.by:a>.A
		[F]				ui/entities/Query<Channel.by:a> --> ...
		[D]				ui/entities/Query<Channel>.A
		[G]					ui/entities/Query<Channel> --> ...
		[H]					ui/entities/Query.A
		[I]						ui/entities/Query --> ...
		[K]						prototypes/entities/Query.A
		[J]							prototypes/entities/Query --> ...
		[C]			ui/entities/Query<Channel.by:a>.A --> ...
		[B]		ui/entities/Query<Channel.by:a.by:b>.B
		[E]			ui/entities/Query<Channel.by:a.by:b> --> ...
		[C]			ui/entities/Query<Channel.by:a>.B --> ...
	
		[I]		ui/entities/Query
		[H]		ui/entities/Query.A
		[A]*	ui/entities/Query.A.B
		[G]		ui/entities/Query<Channel>
		[D]		ui/entities/Query<Channel>.A
		[A]*	ui/entities/Query<Channel>.A.B
		[F]		ui/entities/Query<Channel.by:a>
		[C]		ui/entities/Query<Channel.by:a>.A
		[A]*	ui/entities/Query<Channel.by:a>.A.B
		[E]		ui/entities/Query<Channel.by:a.by:b>
		[B]		ui/entities/Query<Channel.by:a.by:b>.A
		[A]		ui/entities/Query<Channel.by:a.by:b>.A.B

		[A]	ui/entities/Query.custom.lang:du --> ...
			ui/entities/Query<Channel.new>
	*/
	var Blocks = require("./Blocks");
	var parse = require("./Factory.parse");
	
	var Factory = require("js/defineClass");
	var Class = require("js/Class");
	var Type = require("js/Type");
	var Method = require("js/Method");
	var Deferred = require("js/Deferred");
	var Component = require("vcl/Component");
	var VclFactory = require("vcl/Factory"); 
	var js = require("js");
	var PropertyValue = parse.PropertyValue;
	
	// var namespaces = js.mixIn(Blocks.DEFAULT_NAMESPACES);
	var namespaces = Blocks.DEFAULT_NAMESPACES;

	function walk(node, f) {
		f(node);
		node.children && node.children.forEach(function(node) {
			walk(node, f);
		});
	}
	function getClassName(className, namespaces) {
		var root_ns = namespaces.def || "";
		if(className.indexOf(":") !== -1) {
			className = className.split(":");
			if(className[0].indexOf("<") !== -1) {
				return className.join(":");
			}
			if(namespaces[className[0]] === undefined) {
				throw new Error(String.format("Unknown namespace %s (%s)",
						className[0], js.keys(namespaces)));
			}
			return String.format("%s/%s", namespaces[className[0]], className[1]);
		} else if(className.charAt(0) === '/' || root_ns === "") {
			return className;
		}
		return root_ns + "/" + className;
	}
	function getFactoryUri(name) {
		return String.format("blocks/Factory!%s", name);
	}
	function normalize(uri, module) {
		if(module.includes("!")) {
			module = module.split("!");
			module[1] = js.normalize(uri, module[1]);
			module = module.join("!");
		} else {
			module = js.normalize(uri, module);
		}
		return module;
	}

	return (Factory = Factory(require, {
		prototype: {
			_parentRequire: null,
			_uri: "",
			_root: null,
			_sourceUri: null,
			_setIsRoot: true,

			constructor: function(parentRequire, uri, sourceUri, setIsRoot) {
				if(uri.endsWith(":root")) {
					uri = uri.substring(0, uri.length - ":root".length);
					setIsRoot = true;
				}

				var args = js.copy_args(arguments), baseUri;
				sourceUri = sourceUri || uri;
				baseUri = sourceUri.split("!").pop();
				
/*- TODO clean up */				
				function thisRequire(modules, success, error) {
					if(modules instanceof Array) {
						modules = modules.map(module => normalize(baseUri, module));
					} else {
						modules = normalize(baseUri, modules);
					}
// console.log(">>>", modules);
					return parentRequire(modules, success, error);
				}
				
				for(var k in parentRequire) {
					thisRequire[k] = parentRequire[k];
				}
				
				thisRequire.toUrl = (url) => normalize(baseUri, url);

				this._parentRequire = thisRequire;
				this._uri = uri;

				sourceUri && (this._sourceUri = sourceUri);

				arguments.length === 4 && (this._setIsRoot = setIsRoot);
			},
			toString: function() {
                return String.format("%n#%s#%d", this.constructor, this._uri, 
                	this.hashCode());
			},
			getCtor: function() {
				return this._root.ctor;
			},
			resolveUri: function(uri) {
				if(uri.startsWith(".")) {
					uri = String.format("%s$/%s", Factory.resolveUri(this._uri), 
						uri);
				}
				return "text!" + uri;
			},
			load: function(source, success, failure) {
                var me = this, uri = (this._sourceUri||this._uri).split("!").pop();
                if(source && source.charAt && source.charAt(0) === "\"" && 
                	source.indexOf("\"use strict\";") !== 0) {
this._source = source;
                	if(source.indexOf("\"use ") === 0) {
                		// TODO this should be the default
                		source = "\"" + source.substring(5);
                	}
    				/*- Parse require section */
                    var i = source.indexOf("\";");
                    if(i !== -1) {
                        var deps = source.substring(1, i).replace(/\s/g, "");
                        deps = deps.split(",").filter(function(dep) {
                        	return dep !== "strict" && dep !== "nostrict";
                        }).map(function(dep) {
                        	return normalize(uri, dep);
                        });

                        /*- require all dependecies */
                        return this._parentRequire(deps, function() {
                            me.doLoad(source, success, failure);
                        }, failure);
                    }
                }
                return this.doLoad(source, success, failure);
			},
			doLoad: function(source, success, failure) {
				if(typeof failure === "function") {
					try {
						return this.doLoad_(source, success, failure);
					} catch(e) {
						/*- devtools/Editor<vcl> wants the actual Error */
						failure(e);
					}
				}
				return this.doLoad_(source, success, failure);
			},
			doLoad_: function(source, success, failure) {

				var me = this;
				var require = me._parentRequire;
				// var namespaces = js.mixIn(Blocks.DEFAULT_NAMESPACES);

				/*- Parse the source into a JS structure */
				var tree = parse(source, me._uri, js.normalize, require);

				/*- Make sure there is always something to require */
				tree.factories.push("module");
				tree.classes.push("module");
				
				/*- TODO deprecated temporary hack in order to require classes */
				if(tree.root.properties['@require'] !== undefined) {
					tree.classes.push.apply(tree.classes, 
						tree.root.properties['@require']);
					delete tree.root.properties['@require'];
					console.warn("@require will be deprecated - " + me._uri);
				}

				/*- namespace support */
				var ns = tree.root.properties['@namespaces'] || (function() {
					var r = tree.root.properties._ns; 
					delete tree.root.properties._ns; 
					return r;
				}());
				if(typeof ns === "string") {
					ns = js.str2obj(ns);
				}
				tree.classes.forEach(function(className, index) {
					tree.classes[index] = getClassName(className, namespaces);
				});

				me._root = tree.root;
				/*- Load all the factories that are need to constructor the 
					component associated with the Factory */
				Factory.require(tree.factories, function() {
					/*- Make sure all the needed classes are loaded */
					require(tree.classes, function() {
						var propVals = [];
						/*- Walk every node set it's constructor and gather PropertyValue instances */
						
						// TODO Quick and dirty, needs refactoring, accessing privates
						var classes = Blocks.parseUri(me._uri).classes;
						if(classes.indexOf("scaffold") !== -1) {
							var props = tree.root.properties, f;
							if(props.onLoad && !props['@scaffold']) {
								console.log(me._uri, "DEPRECATED onLoad in .scaffold resource");
								props['@scaffold'] = props.onLoad;
								delete props.onLoad;
							}
						}
						
						walk(tree.root, function(node) {
							if(typeof node.className === "string") {
								node.ctor = require(getClassName(node.className, namespaces));
							} else if(node.inherits instanceof Array) {
								node.factories = [];
								for(var i = 0; i < node.inherits.length; ++i) {
									var factory = require(getFactoryUri(node.inherits[i]));
									node.factories.push(factory);
									if(node.ctor === undefined) {
										node.ctor = factory.getCtor();
									}
								}
							}
							for(var k in node.properties) {
								if(node.properties[k] instanceof PropertyValue) {
									propVals.push([node, k, node.properties[k]]);
								}
							}
						});
						
						if(propVals.length > 0) {
							me.handlePropertyValues(propVals)
								.addCallback(success);
						} else {
							success();
						}
					}, failure);
				}, failure);
			},
			newInstance: function(owner, uri, options) {
// console.log(String.format("Factory.newInstance(%n, %s, %s)", owner, uri, options), arguments);
			/*- Instantiates the component based upon the structure parsed */
                var component;
                
				if(this._root.ctor === undefined) {
					/* Bad news */
					// throw new Error(String.format("This component class does " + "not know its constructor (%s)", this._uri));
					this._root.ctor = Component;
					// TODO make ["", ... ] work without this code
				}

				if(uri !== undefined) {
                    if(uri.charAt(0) === "#") {
                    	console.warn("DEPRECATED # should no longer be used");
                        uri = this._uri + uri;
                    }
				} else {
                    uri = this._uri;
				}
				
				// FIXME find a more elegant manner
				var this_uri = this._uri;
				this._uri = uri;

				try {
					var fixUps = [];
					var applied = [];

                    component = new this._root.ctor();//(owner, this._uri, true);

					/*- TODO/FEATURE Do this in the end and support nested 
						components, so that only 1 @override key/value-pair
						is needed per source file */
    				if(this._root.properties.hasOwnProperty("@override")) {
    					console.warn("refactor @override to -> override");
    					component.override(this._root.properties['@override']);
    					delete this._root.properties['@override'];
    				}

					if(this._uri.startsWith("vcl-comps:")) {
						this._uri = this._uri.substring("vcl-comps:".length);
					}


                    component.beginLoading();
                    component.setUri(this._uri);
                    component.setName(this._root.name);
                    component.setIsRoot(this._setIsRoot);
                    component.setOwner(owner || null);

					this.apply(component, component, this._root, applied, fixUps);

					fixUps.forEach(function(ref, i) {
						var v;
						if(ref.property.isReference()) {
							if(ref.value instanceof Component) {
								v = ref.value;
							} else if(ref.value && (ref.value.charAt(0) === "#")) {
								v = component.qs(ref.value);
							} else {
								v = (ref.value && ref.component.scope()[ref.value]);
							}
							if(v !== null) {
								if(!(v instanceof Component)) {
									console.warn(String.format("Component %s referenced by %n.%s does not exist",
									 		ref.value, ref.component, ref.property.getName()));
									 return;
								}
								if(!(v instanceof ref.property._type)) {
									throw new Error(String.format("Property %n.%s should reference a %s (not %n)",
											ref.component, ref.property.getName(), ref.property._type, v));
								}
							}
						} else {
							v = ref.value;
						}
						ref.property.set(ref.component, v);
					});

				} finally {
					component.endLoading();
					this._uri = this_uri;
				}

                // FIXME #173 Ugly construction
                if(options && typeof options.loaded === "function") {
                    options.loaded(component);
                } else {
				    component.loaded();
                }
				return component;
			},
			apply: function(root, component, node, applied, fixUps) {
				/**
				 * Applies a node definition on an (readily) constructed component.
				 * This method is to be called automatically via newInstance and
				 * apply itself.
				 *
				 * @param root The root component being constructed/factoried
				 * @param component The component to apply the node on
				 * @param node Optional, defaults to _root. Identifies the name,
				 *            properties and children of the component
				 * @param applied Array, keeps track of which factories have already
				 *            been applied on the component (any factory can and
				 *            should only be applied once).
				 * @param fixUps
				 */
				var me = this;
				node = node || this._root;
				applied.push(this);
				
				if(node.factories instanceof Array) {
					// This node inherits other component(s)
					node.factories.forEach(function(factory) {
						// A component can be inherited only once...
						if(applied.indexOf(factory) === -1) {
							factory.apply(component, component, null, applied, fixUps);
							me.factoryApplied(factory, root, component, node, applied, fixUps);
						}
					});
				}
				
				
				this.setProperties(component, node, fixUps);

				var parent = component;
				node.children.forEach(function(node) {
					var component;
					if(node.ctor !== undefined) {
						component = new (node.ctor)();
						
						// // var uri = node.uri || me._uri;
						// if(node.uri.endsWith(":root")) {
						node.setIsRoot && component.setIsRoot(node.setIsRoot);
						// 	node.uri = node.uri.substring(0, node.uri.length - ":root".length);
						// }
						
						component.setOwner(root);
						component.setParentComponent(parent);
						component.setName(node.name);
						component.setUri(node.uri || me._uri);

						me.apply(root, component, node, [], fixUps);

					} else {
						root.qsa("#" + node.name).map(function(component) {
							me.apply(root, component, node, [], fixUps);
						});
						// First check the current scope (parent)
						// if((component = parent.getScope()[node.name]) === undefined) {
						// 	component = root.findComponent(node.name);
						// }
						// if(component === null) {
						// 	console.warn(String.format("Inherited component %s not found (%s)", node.name, me._uri));
						// 	return;
						// }
						// console.log(node.name);
					}

				});
			},
			factoryApplied: function(factory, root, component, node, applied, fixUps) {
				/* Callback for when a factory is applied */
				
				// TODO Hook scaffold. Quick and dirty, needs refactoring, accessing privates
				var classes = Blocks.parseUri(factory._uri).classes;
				if(classes.indexOf("scaffold") !== -1) {
	
					var props = factory._root.properties, f;
					if(typeof (f = props['@scaffold']) === "function") {
						console.log("factoryApplied", "@", js.nameOf(component), component._uri, ">>>", js.nameOf(factory));
						// console.debug("scaffolding #" + component.hashCode(), [component._uri, factory._uri]);
						try {
							f.apply(component, []);
						} catch(e) {
							console.error("Error while scaffolding "+ js.nameOf(component), e);
						}
					}
				}
				
			},
			handlePropertyValues: function(propVals) {
				var r = new Deferred(), me = this, count = propVals.length;
				
				function done() {
					if(--count === 0) {
						r.callback();
					}
				}
				
				var modules = propVals.map(function(propValue) {
					var node = propValue[0], name = propValue[1];
					propValue = propValue.pop();
					
					propValue.resolve(me, node, name)
						.addCallback(function(value) {
							node.properties[name] = value;
							done();
						});
				});
				
				return r;
			},
			setProperties: function(component, node, fixUps) {
				component['@properties'] = js.extend(component['@properties'] || {}, node.properties);
				//component['@properties']['@uri'] = this._uri;
				// if(!component['@factory']) {
					component['@factory'] = this;
				// 581
				

				var properties = component.defineProperties(), property;
				for( var k in node.properties) {
					if(k === "@scaffold") continue;
					
					if(node.properties[k] instanceof parse.PropertyValue) {
						console.log(">>>", node.properties[k]);
						continue;
					}
					
					if((property = properties[k]) === undefined) {
						console.warn(String.format("Property %n.%s does not exist - %n\nuri: %s",
								component.constructor, k, component, component._uri));
					} else {
						var value = node.properties[k];
						this.setPropertyValue(property, component, value, fixUps);
					}
				}
			},
			setPropertyValue: function(property, component, value, fixUps) {
				/**
				 * @param property
				 * @param component
				 * @param value
				 * @param fixUps
				 */
				if(property.isReference()) {
					fixUps.push({
						property: property,
						component: component,
						value: value
					});
				} else if(property.needsFixUp()) {
					// if(property._name !== "override") {
					// 	console.warn(property._name, "fixUp");
					// }
					fixUps.push({
						property: property,
						component: component,
						value: value
					});
				} else {
					if(property._type === Type.EVENT) {
						if(typeof value === "string") {
							value = eval(String.format("({f:%s})", value)).f
						}
						if(typeof value === "function") {
							Method.setName(value, String.format("%n.%s", 
								component, property._name));
							Method.setInherited(value, property.get(component, 
								value));
							// value = Method.trace(value);
						} else {
							value = undefined;
						}
					}
					if(value !== undefined) {
						try {
							property.set(component, value);
						} catch(e) {
							throw new Error(String.format("Setting property %s of %s caused %s", 
								property, component, e.message), value);
						}
					} else {
						console.warn(String.format("Property %s of %s not set to undefined", 
							property, component), component);
					}
				}
			}
		},
		statics: {

			implicit_sources: {},
			load: function(name, parentRequire, load, config) {
				if(typeof window === "undefined") {
					console.log("blocks/Factory!! " + name);
					return load(name);
				}

				if(name.indexOf("vcl-comps:") === 0) {
					// #1453 (duck-typing VclFactory vs BlocksFactory)
					return VclFactory.load(name.substring(10), parentRequire, function() {
						return load.apply(this, arguments);
					}, config);
				}
				
				/** @overrides http://requirejs.org/docs/plugins.html#apiload */
				var sourceUri = Factory.makeTextUri(name);

				function instantiate(source) {
					var factory = new Factory(parentRequire, name, sourceUri);
					factory.load(source, function() {
						load(factory);
					});
				}

				function fallback() {				
					parentRequire([sourceUri], instantiate, function () {
						// Source not found, assume it...
						var source = Blocks.implicitSourceFor(name);
						var arr = Factory.implicit_sources[sourceUri];

						Factory.implicit_sources[name] = {
							source: source, 
							sourceUri: sourceUri
						};
// console.log(name, "assuming", source)
						instantiate(source);
					});
				}

				if(Factory.implicit_sources[name]) { 
					return instantiate(Factory.implicit_sources[name].source);
				}
				
				// TODO maybe reject() should not be the fallback but rather resolve(null) 
				//	+ also: ".fallback" could be added (nice!y) to the uri
// console.log(name, "fetch");
				this.fetch(name).then(instantiate).catch(fallback);
			},

			fetch: function(name) {
				// returns Promise; overrides which resource should be considered first
				return new Promise(function(resolve, reject) {
					reject();	
				});
			},
			
			resolveUri: function(uri) {
				if(uri.substring(uri.length - 2, uri.length) === "<>") {
/**/				console.warn(uri);
					uri = uri.split("!");
					if(uri.length === 1) {
						uri = String.format("%s%s", Blocks.PREFIX_PROTOTYPES, 
							uri[0].substring(0, uri[0].length - 2));
					} else {
						uri = String.format("%s!%s%s", uri[0], 
							Blocks.PREFIX_PROTOTYPES, uri[1].split("<")[0]);
					}
				} else {
					var keys = Blocks.parseUri(uri);
					if(keys.template && keys.specializer) {
						uri = String.format("%s%s%s", keys.template, 
							Blocks.POSTFIX_SPECIALIZED, keys.specializer);
						if(keys.specializer_classes.length) {
							uri += ("." + keys.specializer_classes.join("."));
						}
					} else if(keys.classes.length) {
						uri = String.format("%s%s%s.%s", keys.namespace, 
							keys.namespace ? "/" : "", keys.name, 
							keys.classes.join("."));
					} else {
						//throw new Error("Did not expect this " + uri);
					}
				}
			    if(uri.indexOf(Blocks.PREFIX_PROTOTYPES) !== 0) {
		        	uri = Blocks.PREFIX_APP + uri;
			    }
	        	uri.replace(/\/\//g, "/");
				return uri;
			},
			makeTextUri: function(uri, suffix) {
				uri = "text!" + this.resolveUri(uri);
				if(!uri.endsWith(".blocks")) {
					suffix = arguments.length === 2 ? suffix : ".js";
					return !uri.endsWith(suffix) ? uri + suffix : uri;
				}
				return uri;
			},
			unreq: function(name) {
			    var factory;
			    
			    if(name instanceof Factory) {
			    	factory = name;
			    } else {
			    	name = String.format("blocks/Factory!%s", name);
			    	if(window.require.s.contexts._.defined[name]) {
		        		factory = require(name);
			    	} else {
			    		console.warn("(can) the puck stop(s) here?", name)
			    		return;
			    	}
			    }

				window.require.undef(js.sf("blocks/Factory!%s", factory._uri));
				window.require.undef(Factory.makeTextUri(factory._uri));

		    	console.info("blocks/Factory.unreq: " + name)

			    var factories = factory._root.inherits;
			    factories && factories.forEach(function(name) {
			        Factory.unreq(name);
			    });
			},
			require: function(name, callback, failback) {
				var ocallback = callback;
				if(callback && typeof name === "string") {
					callback = function() {
						//console.log("200 " + name);
						return ocallback.apply(this, arguments);
					};
				}

				if(typeof name === "string") {
					return require([String.format("blocks/Factory!%s", name)], 
						callback, failback);
				}

				var count = name.length;
				var thisObj = this;

				for(var i = 0; i < name.length; ++i) {
					(function(i){
						require([name[i]], function(module) {
							name[i] = module;
							if(--count === 0) {
								callback.apply(thisObj, name);
							}
						}, function(err) {
							name[i] = err;
							if(--count === 0) {
								callback.apply(thisObj, name);
							}
						});
					}(i));
				}
			},
			getFactoryUri: getFactoryUri
		}
	}));
});