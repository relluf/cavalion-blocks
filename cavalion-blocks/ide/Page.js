"use locale";
"use strict";

var locale = window.locale;//require("locale").locale;

["vcl-ui:Form", { css: "background-color: #f7f;" }, [

	["./Topbar", [
	
		["vcl-ui:Button", { content: locale("New") } ]
		
	]]	
	
]];