# [ B L O C K S ]

*blocks/prototypes === default-constructor === implicit-base*

*user specific, scaffolding, templates, ...*

There's a new kid of the block! This project is born out of the need of:

* to reboot/refresh cavalion-vcl, remove dead wood (or at least hide it to evolve with a clean slate)
* focus soley on the native-JS like way of doing this
	* Object.create, real properties -and all-
	* await, promise, etc.
* use nicer/simpler Markdown-like (but JS) syntax
* rewrite of Code
	* rename to ide?
	* better Navigator
	* better event handling
	* see what this blocks thing can do

---
# Syntax
	
	Block = [["Base", "Mixins"], "name", {properties}, [children]]

![](https://i.snag.gy/NufTis.jpg)

# Array.prototype ( === Blocks?)


You can do all kinds of (silly?) things through Array.prototype:

	[["Page"], ... ].instantiate();
	[].require()
	[].define({})
	["1", "2", window].hash(type)

	
	
Owner is the root of a scope.

### Scope

- app/super-root 
- root/owner
- ...others owned by root
- 

## PouchDB

**Thinker**: Wat gebeurt er als de md5-hash van het JSON van het object de key van het object wat ge-put wordt is?

Dan kan je in principe 1 store hebben voor al je objecten. 

	["bedrijf", "projectcode", "versie"].hash("md5");

