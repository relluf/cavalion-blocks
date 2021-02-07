"use js";

["Container", {
	
	align: "client",
	css: { iframe: "width:100%;height:100%;background-color:#fafafa;" },
	content: "<iframe src='/home/Dropbox/Apps/index.html?Veldapps'>",
	
	onLoad() {
		// this.setContent(js.sf("<iframe src='/home/Dropbox/Apps/index.html?%s'>", this.getSpecializer() || ""));
	}

}, []];