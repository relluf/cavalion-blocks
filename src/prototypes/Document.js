"use jspdf";

var jspdf = require("jspdf");

["Container", {
	
	onNodeCreated() {
		var viewer = this.ud("#viewer");
		
		var doc = new jspdf.jsPDF();
		doc.setCreationDate(new Date());
		
		this.vars("content").forEach(args => {
			var method = doc[args.shift()];
			method.apply(doc, args);
		});
		
		viewer.vars("frame-src", doc.output('bloburl'));
		viewer.render();
	}

}, [
	["devtools/Iframe", ("viewer"), { vars: {"frame-src": ''} }]	
]];