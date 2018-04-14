define(function(require) {

	var Deferred = require("js/Deferred");
	var Blocks = require("blocks/Blocks");
	
	function PropertyValue(uri) {
		this.uri = uri;
	}
	PropertyValue.prototype.resolve = function(factory, component, name) {
		var r = new Deferred();
		
		require([factory.resolveUri(this.uri)], 
			function(res) { r.callback(res); }, 
			function(err) { r.errback(err); }
		);
		
		return r;
	};

	function parse() {
	    function mapArrFn(arr, fn) {
	        return arr.map(function(item) {
	            if(item instanceof Array) {
	                item = fn.apply(this, item);
	            }
	            return item;
	        });
	    }
	    
		var r = eval(arguments[0]);
		if(r instanceof Array) {
		    r = Blocks.parse.apply(Blocks, r);
		}
		return r;
	}
	function impl(source, uri, normalize) {

		var Component = require("vcl/Component");
		var Factory = require("blocks/Factory");

		var tree = {
			root: [],
			classes: [],
			factories: [],
			uri: Blocks.parseUri(uri)
		};

		function walk(node) {
			/**
			 * Dependencies are two-fold:
			 * 	- factories
			 * 	- classes
			 *
			 * @param node
			 *            The scope being walked
			 */
			// Are we inheriting prototypes?
			if(node.inherits instanceof Array) {
				if((node.inherits.length === 1 && node.inherits[0] === "") || node.inherits.length === 0) {
					// [[], ... ] or [[""], ... ] or ["", ... ] because that'll be adjusted to the 2nd form
					node.inherits = Blocks.implicitBasesFor(uri);
				}

				node.inherits.forEach(function(item, i) {
					node.inherits[i] = item = normalize(uri, typeof item === "string" ? item : "");
					item = String.format("blocks/Factory!%s", item);
					if(tree.factories.indexOf(item) === -1) {
						tree.factories.push(item);
					}
				});
				
				/*- #777 */
				node.uri = node.inherits[0];
			}
			if(typeof node.className === "string") {
				/*- #1236 */
				var rootCN = (tree.root && tree.root.className) || "vcl/Component";
				node.className = normalize(rootCN, node.className);
				if(tree.classes.indexOf(node.className) === -1) {
					tree.classes.push(node.className);
				}
			}
			node.children.forEach(function(node) {
				walk(node);
			});
		}
		function adjust(root) {
			walk(root);
		}
		function devtoolsFriendly(uri) {
            if(uri.indexOf(Blocks.PREFIX_PROTOTYPES) === 0) {
                uri = uri.substring(Blocks.PREFIX_PROTOTYPES.length);
            }
            uri = uri.split("<");
			if(uri.length === 2) {
				uri[1] = uri[1].split("/").join(".");
				uri = uri.join("<");
			}
			return uri;
		}

		source = String.format("%s\n//# sourceURL=http://%s/%s.js", source,
		    uri.indexOf(Blocks.PREFIX_PROTOTYPES) === 0 ? "blocks-prototypes" : "cavalion-blocks",
		    devtoolsFriendly(uri));
		tree.root = parse(source);
		tree.root && adjust(tree.root);
		return tree;
	}
	
	impl.PropertyValue = PropertyValue;
	
	return impl;
});
