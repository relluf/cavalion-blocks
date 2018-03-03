# B L O C K S

*user specific, scaffolding, templates, ...*

There's a new kid of the block! This project is born out of the need of:

* reboot cavalion-vcl, remove dead wood (or at least hide it to evolve with a clean slate)
* focus soley on the native-JS like way of doing this
	* Object.create -and all
	* Real properties
* apply nicer/simpler Markdown-like (but JS) syntax

---
# Syntax

![](https://i.snag.gy/NufTis.jpg)

# Array.prototype ( === Blocks?)

You can do all kinds of silly things through Array.prototype:

	[["Page"], ... ].instantiate();

	
	[["Base", "Mixins"], "name", {properties}, [children]]