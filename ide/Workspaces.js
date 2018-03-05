"use strict";

["vcl-ui:Panel", { align: "client" }, [ /*- TODO this should lead to auto class align-client */

	/*- TODO some stuff that makes sure that these tabs are persisted,
	in the context of the 'current/local workspace' */

	["vcl-ui:Tabs", {
		align: "bottom", /*- TODO this should lead to auto class align-bottom */

	}, [].scaffold("vcl-ui:Tab", {
		source: [].qs("PouchDB<>"), //=== "PouchDB<ide/Workspaces>" right??!!! (source can be implicit even it seems :-o)
		map: function(tab, workspace) {
			/*- receives two arguments, which can be named whatever the user wants ;-) */
			tab.setText(workspace.name);
		}
	})],
	
	["vcl-ui:Tabs", "alternative", {
		align: "bottom", /*- TODO this should lead to auto class align-bottom */

	}, [].scaffold("vcl-ui:Tab", { //===> must be async to be powerful */
		source: [].qs("Pouch<>"), //=== "PouchDB<ide/Workspaces>" right??!!! (source can be implicit even it seems :-o)
		map: function(tab, workspace) {
			/*- receives two arguments, which can be named whatever the user wants ;-) */
			tab.setText(workspace.name);
		}
	})]
]];
