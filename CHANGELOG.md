### 2026/03/16 — Glassy container interaction and hover reload

Refines the glassy container UX and the hover-loaded component lifecycle. It improves inherits parsing for comma-separated values, adds centralized cursor and resize handling, makes drag/move keyboard behavior safer, introduces fallback window-based bounds when no stored geometry exists, and refactors hover loading so embedded components can be cleanly reloaded in place. It also moves glassy transition styling into the container prototype and refreshes the loading overlay with a blur and pulse animation.

* Improves `src/Blocks.js` parsing of string `inherits` by splitting on commas and trimming items instead of stripping all whitespace.
* Fixes `inherits` handling for values that contain internal spaces.
* Adds cursor utilities in `src/prototypes/Container.glassy.js` to centralize resize/move cursor detection and updates.
* Adds `.override-cursor` styling and resize-aware cursor override for glassy containers.
* Improves drag/resize behavior by treating `"move"` like the default move state during pointer and keyboard handling.
* Fixes a crash path in keyboard drag completion by bailing out when `style.transform` is empty.
* Adds default centered bounds initialization when stored `bounds` are missing, based on `#window` dimensions.
* Refactors `onMouseMove` / child event handling so modifier keys update cursor state and can trigger drag-start consistently.
* Improves `Container<>.glassy.closex` loading by extracting reusable `load()` and delayed `destroy()` helpers in `src/prototypes/Hover.js`.
* Adds Alt+Shift click reload flow that unloads the component URI, detaches ownership, destroys the current root, and reloads it.
* Preserves merged `vars` during hover-loaded component setup and propagates `no-shrinking` from component vars or URI classes.
* Moves glassy shrink-transition CSS from `src/prototypes/Hover.js` into `src/prototypes/Container.glassy.js`.
* Improves loading overlay visuals in `src/prototypes/Loading.js` with injected `pulse-opacity` animation, blur, and translucent background.
* Chore: removes trailing whitespace / newline noise in `src/prototypes/Console.js`.


### 2026/01/18 — Hover/container UX refinements + loader animation + inherits parsing

- Changes `Blocks` inheritance parsing to split on commas and trim (instead of whitespace normalization), affecting how `"A, B"` style specs resolve.
- Enhances glassy containers with cursor override + resize/move cursor logic and new “centered” default bounds when no stored bounds exist.
- Tweaks drag/resize behavior to treat `"move"` like default cursor and apply cursor updates during key events and mouse move.
- Refactors `Hover` loading/reload flow: centralizes load logic, propagates `vars` into loaded content, and auto-destroys the hover container when the loaded root is destroyed.
- Adds an Alt+Shift click reload path that fully unloads/recreates the embedded component and then brings the hover to front.
- Updates loading overlay visuals by injecting a one-time CSS keyframe animation and switching to a translucent blurred backdrop.
- Minor cleanup in `prototypes/Console.js` (whitespace / EOF only).


### 2024/04/03 - 0.9.42

* 20250403 allows B.i to receive string for vars updates Map prototype
* 20241119 first commit introduces prototypes/Loading
* 20241119 adds support for parent and vars (B.i without []) updates Hover-styling
* 20241111 does not allow to shrink while dragging

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
