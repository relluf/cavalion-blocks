# [ B L O C K S ] 

`blocks-dot-js` `[].js`

*blocks/prototypes === default-constructor === implicit-base*

*user specific, scaffolding, templates, ...*

This project is born out of the need of:

* to persist the structure (routes, models, translations, ...) of the app as meta data for the app itself
* to reboot/refresh cavalion-vcl, remove dead wood (or at least hide it to evolve with a clean slate)
* focus soley on the native-JS like way of doing this
	* Object.create, real properties -and all-
	* await, promise, etc.
	
![](https://i.snag.gy/Bb0fhd.jpg)
	
* nicer/simpler/cleaner (Markdown-like?) syntax
* rewrite of Code
	* rename to ide?
	* better Navigator
	* better event handling
	* see what this blocks thing can do

---
# Syntax
	
*Block* := `["classes", "name", {config}, Block[]];`

* **classes** - (comma- and/or) whitespace-seperated list of class names
* **name** - the name for the block, optional

![](https://i.snag.gy/mdpjMv.jpg)

Where it is assumed that `inherits` (when it's a string value) is a reference to, either;

* line 3 & 5: another Block (no namespace, default namespace)
* line 9: a preconfigured constructor (specific namespace)


![](https://i.snag.gy/1Iec27.jpg)


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

	["bedrijf", "projectcode", "versie"].hash(instance, "md5");

## Remove Dead Wood

cavalion-vcl is too bloated. Too much stuff of Borland's VCL is in there that doesn't make any sense. But, it works now and I don't want to spend too much time on it to improve it (just yet). So expose a clean interface [BLOCKS], which basically hides all VCL, or at least:
* specific implementations
* property definitions
* 

## Addressing

	/ide/workspaces/code/sidebar:
	-> ide/Workspace<code> #sidebar
	-> ide/Workspace<> #sidebar
	
## Generating

Generation is constant. Every block is a PouchDB document. Every save is a revision.
	

# If one could define property like accessors in Blocks
	
	
	
## Analogies

* **Workspace** - **Project**s consist of **Folder**s, consisting **File**s, as such defining a set of **Path**s mapped to **Source**. **Type**s are assumed by code.

* **Application** - **Root**s consist of **Block**s, consisting of **Component**s, as such defining...

* **Bedrijf** (Workspace<Veldoffice>)

	- [**Onderzoek**, **Locatie**] -> [**Waarneming**]

	- [**Onderzoek**, **Code**] -> [**Document**]
	- 
	

Velapps, Veldoffice, Veldapp, Workspace<Veldoffice>

Velddata
* app: 
* local/field: latitude, longitude, altitude, photos, 
* user:


block := [inherits, name, properties, children]
inherits := inherits | [base, mixin, mixin]

- name
- properties
- children

- parent
- owner/tree
- 


BLOCKS loaded should pass-on inherited loaded
----

