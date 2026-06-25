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

---

# B.i()

**Core**
`Blocks.instantiate` is a small Promise-based wrapper around `blocks/Factory`: it loads/parses a blocks source, creates the root component, and then does a couple of post-creation conveniences such as `update()`, optional `parent`, and optional `vars` merging. The whole flow is in [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:359) and the actual instance creation is in [Factory.js](/Workspaces/cavalion.org/cavalion-blocks/src/Factory.js:320).

The important thing to keep in mind is timing: `owner` is applied before the tree is built, but `options.parent` and `options.vars` are applied after `newInstance()` returns, so after the normal `loaded()/onLoad` path unless you intercept it with `options.loaded` [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:378) [Factory.js](/Workspaces/cavalion.org/cavalion-blocks/src/Factory.js:360).

**`source` and `options`**
`source` can be used in two main ways.

- A string is shorthand for “instantiate this block URI as the root”. Internally `"Foo<Bar>"` becomes `["Foo<Bar>"]`, `uri` defaults to the same string, `sourceUri` becomes `source://...`, and `setIsRoot` is forced on [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:367).
- An array is normal block DSL input: `["Container", children]`, `["Tab<X>", "name", {...}]`, `["A, B", {...}]`, and so on. The parser flexibility is in [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:16).

`options` is not a generic property bag. The keys that `Blocks.instantiate`/`Factory.newInstance` actually recognize are:

- `owner`: root owner, assigned before apply/build [Factory.js](/Workspaces/cavalion.org/cavalion-blocks/src/Factory.js:324)
- `uri`: override the root URI seen by the instantiated component [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:364)
- `sourceUri`: override the “where did this source come from?” base for relative loads; this is mainly for editor/live-preview scenarios
- `setIsRoot`: force root semantics [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:374)
- `loaded`: replace the automatic `component.loaded()` call [Factory.js](/Workspaces/cavalion.org/cavalion-blocks/src/Factory.js:360)
- `parent`: post-attach the returned root [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:381)
- `vars`: post-merge vars into the returned root [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:385)

Anything else in `options` is ignored unless you manually do `root.set(...)` yourself afterward. `Hover<>` does exactly that: it instantiates first, then calls `c.set(props)`, then `c.loaded()` manually [Hover.js](/Workspaces/cavalion.org/cavalion-blocks/src/prototypes/Hover.js:48).

**Ownership and Properties**
The clean mental model is:

- `owner` = lifecycle, scope, message bubbling, app lookup, destruction chain
- `parent` = visual/control containment

You can see the owner API in [Component.js](/Workspaces/cavalion.org/cavalion-vcl/src/Component.js:1063) and the control parent API in [Control.js](/Workspaces/cavalion.org/cavalion-vcl/src/Control.js:379).

A few practical rules follow from that:

- For the root created by `B.i`, prefer `options.owner`.
- For the visual placement of that root, use `options.parent` only if you do not care whether `onLoad` sees it yet.
- If `onLoad` must run with the final parent/vars already in place, use `options.loaded`, do your setup there, and call `component.loaded()` yourself afterward. `blocks/prototypes/Tab` does this to attach the loaded control to the tab host before `loaded()` runs [Tab.js](/Workspaces/cavalion.org/cavalion-blocks/src/prototypes/Tab.js:31). `Editor$/xml.js` does the same trick to delay ownership and loading of detail views [xml.js](/Workspaces/cavalion.org/cavalion-devtools/src/vcl-comps/Editor$/xml.js:332).
- Put ordinary component properties in the block source itself. The factory applies them through the normal property system and does fixups for references/events/index-like properties [Factory.js](/Workspaces/cavalion.org/cavalion-blocks/src/Factory.js:399).
- For ad hoc runtime tweaks after instantiation, call `root.set(...)` yourself. `Hover<>` is the clearest example [Hover.js](/Workspaces/cavalion.org/cavalion-blocks/src/prototypes/Hover.js:49).

Also, you can put `owner` and `parent` directly in the DSL for children. `pouchdb/AllDbs` does that inside the source it instantiates: the new `Tab` child gets `parent: tabs` and `owner: ws` directly in its block config [AllDbs.js](/Workspaces/cavalion.org/cavalion-devtools/src/cavalion-blocks/pouchdb/AllDbs.js:13).

**`vars`**
`vars` is just the component-local `_vars` bag, with optional fallback to owner on reads. The API is in [Component.js](/Workspaces/cavalion.org/cavalion-vcl/src/Component.js:592).

A few details matter here:

- `this.vars("x")` reads local vars only.
- `this.vars(["x"])` defaults to owner fallback, because the one-element array form adds `fallback_to_owner=true` [Component.js](/Workspaces/cavalion.org/cavalion-vcl/src/Component.js:602).
- `setVars(...)` merges recursively while loading, otherwise it replaces unless you pre-merge yourself [Component.js](/Workspaces/cavalion.org/cavalion-vcl/src/Component.js:622).

For `Blocks.instantiate`, `options.vars` is parsed by `parseVars(...)` in [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:103):

- Object input works as-is.
- `"a: 1; b: 2;"` goes through `js.str2obj(...)` and becomes a flat object of strings/booleans [js/_js.js](/Workspaces/cavalion.org/cavalion-js/src/js/_js.js:254).
- `"{deep.path=value; other=x}"` is a special format handled with `js.set(...)`, so it can create nested paths [Blocks.js](/Workspaces/cavalion.org/cavalion-blocks/src/Blocks.js:105).

The biggest gotcha is again timing: `options.vars` is merged after normal `loaded()/onLoad`. So if the instantiated block needs vars during `onLoad`, put `vars` in the source itself, or intercept with `options.loaded`.

That distinction shows up in the codebase:

- The VCL console helper builds `Hover<>` by putting `vars` in the source root itself: `B.i(["Hover<>", { vars: ... }], opts)` [Console.js](/Workspaces/cavalion.org/cavalion-vcl/src/prototypes/ui/forms/util/Console.js:45).
- `Hover<>` then reads its own vars first, and later manually propagates them into the embedded block [Hover.js](/Workspaces/cavalion.org/cavalion-blocks/src/prototypes/Hover.js:6).
- The Markdown editor accepts inline vars strings and converts them before passing them into that helper [md.js](/Workspaces/cavalion.org/cavalion-devtools/src/vcl-comps/Editor$/md.js:1358).

**What the repo usage shows**
After scanning the projects you listed, the usage patterns are pretty consistent.

- `cavalion-js`: no direct `B.i` / `Blocks.instantiate` usage found.
- `cavalion-vcl`: mostly a wrapper/helper role. `ui/forms/util/Console` exposes `H(...)` as a convenient `Hover<>` constructor [Console.js](/Workspaces/cavalion.org/cavalion-vcl/src/prototypes/ui/forms/util/Console.js:45). `prototypes/cavalion-blocks.js` instantiates a block URI with `owner: this`, then manually parents the result [cavalion-blocks.js](/Workspaces/cavalion.org/cavalion-vcl/src/prototypes/cavalion-blocks.js:25).
- `cavalion-blocks`: the two canonical examples are `Tab` and `Hover`. `Tab` uses `uri`, `owner`, `setIsRoot`, and a custom `loaded` hook to place the created control before it finishes loading [Tab.js](/Workspaces/cavalion.org/cavalion-blocks/src/prototypes/Tab.js:31). `Hover` uses `loaded` plus a manual `set(props)` pass afterward because it wants tighter control over owner/parent/vars/zoom timing [Hover.js](/Workspaces/cavalion.org/cavalion-blocks/src/prototypes/Hover.js:24).
- `cavalion-devtools`: `B.i(["Container", tabs])` is often used as a temporary builder for a batch of controls, whose children are then adopted into an existing UI [Alphaview.js](/Workspaces/cavalion.org/cavalion-devtools/src/cavalion-blocks/Alphaview.js:470) [sikb12.js](/Workspaces/cavalion.org/cavalion-devtools/src/cavalion-blocks/Editor<xml>/sikb12.js:55). `AllDbs` shows the “put `parent` and `owner` in the DSL” style for dynamic child tabs [AllDbs.js](/Workspaces/cavalion.org/cavalion-devtools/src/cavalion-blocks/pouchdb/AllDbs.js:13). `Editor$/xml` shows the lifecycle-intercept pattern with `loaded` [xml.js](/Workspaces/cavalion.org/cavalion-devtools/src/vcl-comps/Editor$/xml.js:332).
- `cavalion-code`: mostly mirrors/bundles the same patterns from `-vcl`, `-blocks`, and `-devtools`, rather than introducing a different usage model.

If you want, I can turn this into a short “when to use `source vars` vs `options.vars` vs `root.set(...)`” cheat sheet next.