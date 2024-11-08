### 2024/11/08 - 0.9.41

* Service build in favor of cavalion-code

### 2024/11/07 - 0.9.40

* ??

### 2024/07/07 - 0.9.39

* **Factory**
	* Implements thisRequire.toUrl
	* Finetunes vcl/Factory.unreq


### 2024/05/20 - 0.9.38

* **Hover**:
	- Improves drag/drop- and persistent/size-behaviour
	- Instantiated block components are owned by the Hover-component
- Gets rid of dependency to blocks.less


### 2023/09/30 - 0.9.37

* Adds glassy classes for scrolled ListHeader
* Hover<> now delegates its zoom property to the embedded blocks components

### 2023/09/20 - 0.9.36

* Hover<> now uses embedded blocks components uri to store its (appearance) properties

### ???

### 2022/06/23 - 0.9.33

* Removes dead code

### 2022/04/17 - 0.9.32

* Fixes 404s for implicitly defined sources ([Factory](src/:.js))

### 2022/04/17 - 0.9.31

* Introducing [Container.glassy](/Library/cavalion-blocks/prototypes/:.js)

### 2022/04/15 - 0.9.30

- Updating styles

### 2022/03/28 - 0.9.29

- Refactoring [OpenLayers => [Map] => Map-leaflet]

### 2022/02/07 - 0.9.27
- **blocks/Blocks**: getImplicitSourceFor(): emitting terminating semi-colon
- **blocks/Factory**: Now keeping track of the `implicit_sources` in such a manner that they can be reproduced correctly (eg. by vcl-comps://make/Build)

>> ![image](https://user-images.githubusercontent.com/686773/152897778-394043f0-b0b8-4afa-aa4e-4ebfe60fe466.png?2x)


### 2022/01/23 - 0.9.26
- Fix for `@factory` not being set correctly

### 2021/11/17 - 0.9.25
- Adding support for `:root`

### 2021/03/07 - 0.9.22
- blocks/Factory: Temporary fix/hack for `vcl-comps:`-usage

### 2021/02/07 - 0.9.21
- Corrected base for `prototypes/Popup`

### 2021/01/23 - 0.9.20
* Working on Graph<FilterMeting.waterstand>

### 2021/01/09
- Working on [Container]([src/prototypes/:])
	- appears from left or right, top or bottom
	- appears on Cmd+<dot>

### 2020-09-20 - 0.9.19
- Bugfix for potential crash

### 2020-09-11 - 0.9.18
- Adding prototypes/Radiobutton

### 2020-08-15 - 0.9.17
- Introducing ! syntax (example?)

### 2020-07-30 - 0.9.16
- Updating prototypes
	- Ace
	- Checkbox
	- Entity
	- Map
	- Tab

### 2020-04-14 - 0.9.15
- Introducing B.i (aka blocks.i and/or Blocks.i) => short for instantiate
- prototypes/Tab: Introducing vars.parent
	- should the a (config)parameter?
	- properties, vars, (props), (params), parameters

### 2020-04-07 - 0.9.14
- Some cosmetic changes

### 2019-12-02 - 0.9.13
- Fixing some bugs related to requiring relatively addressed resources

### 2019-12-02 - 0.9.12
- (FINALLY) Implemented relative resources via require (so cool)

> ![image](https://user-images.githubusercontent.com/686773/70025078-95f39100-1561-11ea-9368-09daa0442916.png?2x)


### 2019-11-29 - 0.9.11
- Introducing new classes

### 2019-11-25 - 0.9.10
- Fixing auto-uri-ing blocks created via B.instantiate()
- Local overrides?

### 2019-08-21 - 0.9.9
- Enhancements in order to use require() with relative paths, kindof:

>> ![](https://i.snipboard.io/pCjgSD.jpg?2x)

### 2019-08-01 - 0.9.8
- Making adjustment for V7 (r.js -o build.json)

### 2019-07-03 - 0.9.7
- Adding loading class to Bar

### 2019-06-23 - 0.9.6
- Cleaning up

### 2019-06-11 - 0.9.5
- In Tree nodes now inherit parent onNodesNeeded (if not specified)

### 2019-04-12 - 0.9.4
- Advancing `Tab<>` - lazy loading upon select
- Blocks.fetch - abstraction towards first source file (before Blocks.getImplicitSourceByUri)

### 2019-03-31 - 0.9.3
- Advancing `Tab<>`

### 2019-03-07 - 0.9.2
- Fixed as bug in `Tab<>` (override require'd)

### 2019-02-18 - 0.9.1
- Made improvements in order to instantiate from console command line

### 2019-02-11
- Introducing Console
- The default namespace != root namespace (/List != List)

### 2019-01-25
- Applying properties to multiple components _(does this lead to 'programming scopes'?)_"

### 2019-01-21 - 0.8.9
- How about a Framework7 abstraction in Blocks?
- Introducing @namespaces support in source file

### 2019-01-07 - 0.8.8
- Pushing for server2

### 2019-01-06
- Developing Tree, Node

### 2018-12 - 0.8.5
- Fixing some issues for usage in JavaScript build of cavalion-code

### 2018-09-15 - 0.8.4
- Fixing some issues for usage in v7-maps

### 2018-08-28 - 0.8.3
- Fixing some issues for usage in v7-maps

### 2018-08-21 - 0.8.2
- Wow! It has been *three* months... But, we're back!
- Using cavalion-blocks in v7-maps

### 2018-05-21
- Developing the QSR pattern
- Introducing Blocks.instantiate(), vcl:Component-parentIsOwner

### 2018-05-10
- Fix for test/MultipleClasses
- Removed blocks.less

### 2018-05-05
- Introducing `tools/devtools/Editor<md>/ImageSnagger` and `tools/devtools/Editor<md>/PostParser`
- Developing devtools/Editor<html>
- Introducing `cavalion-blocks/Tree`

### 2018-04-25
- Bridging cavalion-blocks and vcl-comps:

	`cavalion-blocks/ide/Workspace<code> === vcl-comps:devtools/Workspace`

### 2018-04-22
- `Query, Store, Render` - something to consider
- Early days for Framework7 integration finally arrived, but it's about time

### 2018-04-21
- Adding/prototyping new prototypes (Framework7 and Map)
