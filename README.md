# [ B L O C K S ] 

`blocks-dot-js` `[].js`

*blocks/prototypes === default-constructor === implicit-base*

>> ![](https://i.snag.gy/Bb0fhd.jpg?2x)
	
---

# Syntax
	
*Block* := `["classes", "name", {config}, Block[]];`

* **classes** - (comma- and/or) whitespace-seperated list of class names
* **name** - the name for the block, optional

>> ![](https://i.snag.gy/mdpjMv.jpg)

Where it is assumed that `inherits` (when it's a string value) is a reference to, either;

* line 3 & 5: another Block (no namespace, default namespace)
* line 9: a preconfigured constructor (specific namespace)

>> ![](https://i.snag.gy/1Iec27.jpg)