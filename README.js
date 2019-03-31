
	function override_stuff() {
		
		["A", "B"].valuesOf(this).applyTo(this, override);
		
		function override(A, B) {
	
		}
		
		["A", "B", "C"].map(key => this[key]).forEach((A, B, C) => {
			
			this.A = function() { };
			this.B = function() { };
			this.C = function() { };
			
		});
		
		["execute", "render"].mapAndApply(this, function(execute, render) {});
		
		var f = k => this[k];
		override.apply(this, mapKeysOf(this, ["A", "B"]));
		
		this.clicked = 0;
		for(var k in this) {
			var inherited = this[k];
			if(k === "click") {
				this[k] = function() {
					this.clicked++;
					return inherited.apply(this, arguments);
				};
			}
		}
	}

	function blocks1() {

	// without Blocks:
		 var panel = new (require("vcl/ui/Panel"))();
		 panel.setEnabled(false);
		 
	// with Blocks:
		 var panel = Blocks.create(["vcl-ui:Panel", { enabled: false }]);
		 
		 
	// with Blocks & messing with Array.prototype
		Array.prototype.create = function() { /* ... */ };
		var panel = ["vcl-ui:Panel", { enabled: false }].create();
	}

	/*- WOW! I just saw a way to get rid of/isolate the Vars-stuff (so obvious, but elegant; only use it TCN **there where needed**) */
	["Page, Vars", {}, []];
	
	["html:div Page List", {}, []];
	
		// local ------ I ---- global
		function blocks2() {
	
	// Blocks.override ( === [].override) - seems HUGE:
	
		["vcl-ui:Tab", { 
			select: [].override(function(select) {
				return function() {
					return select.apply(arguments);	
				};
			})
		}];
		
	// Some pages...
	
		["Page, code/Source", [
			["Executable", "refresh", { 
				execute: function() {} 
			}],
		]];
		
		define(["blocks!Page", "veldoffice!Meetpunt"], function(Page, models) {
			
			// var Source = models.Source;
			
			return new Page([]);
		});
		
		require(["blocks!Page, veldoffice:Meetpunt<veldoffice-1635252>", {}, function(Page, Meetpunt) {
			
		}]);
		
		["Page, veldoffice:Meetpunt", "", (Page, Meetpunt) => {
			
		}];

		
		
	/*- this/local  --- I ---  global/that 
		inner  -------- I ---------  outer
	
		So (local) versus (global), but wtf is "I" doing there in the middle?
		
		"I" is processing global to local and local to global
		
		
	*/

		}
		
		
		
		["Page", [
		
			["#workspaces", {}, [].override(function() {
				
			})]	
			
		]];
		
		
		
		
		
		