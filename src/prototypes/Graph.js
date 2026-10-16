"use amcharts, amcharts.serial";

// TODO: add source-property
// DOC: categoryField: "date"

[("Container"), {
	css: { // TOOD move to "amcharts-define"
			'a': "visibility:hidden;",
			'.amChartsLegend.amcharts-legend-div': { 
				'svg > g': "text-shadow: none;",
				// 'svg > g > g > g:first-child': "font-weight: bold;" 
			}
		},
	// onLoad() {
		
	// },
	// onRender() {
	// 	const source = this.ud("#series-data");
	// 	if(!source || !source.isActive()) {
	// 		return;
	// 	}
		
	// 	const data = source.getObjects();
	// 	const graphs = this.vars("series", false, []).map(o => js.mi(o, {
	// 		valueField: o.id,
	// 		colorField: o.id + "_color"
	// 	}));
	// 	const opts = js.mi(CHART_OPTS(), {
	// 	    type: "serial", // precision: 3,
	// 	    dataProvider: data, 
	// 	    categoryField: "time",

	//         balloonText: "A: <b>[[value]]</b>",
	//         balloonDateFormat: "JJ:NN",

	// 	    valueAxes: [{ title: "Y", position: "left" }],
	// 	    zoomOutText: " ",

	// 	    graphs
	// 	});
	// 	const guides = this.vars("guides"); 
	// 	if(guides) {		
	// 		js.set("categoryAxis.guides", guides, opts);
	// 	}

	// 	js.mi(opts, {
	// 		listeners: [{
	// 			event: "rendered",
	// 			method: evt => {
	// 				const start = new Date(2021, 0, 1);
	// 				const end = new Date(2024, 0, 1);
					
	// 				this.print("rendered-setRange", { evt, range: { start, end } });

	// 				evt.chart.zoomToDates(start, end);
	// 			}
	// 		}]			
	// 	});
		
	// 	const chart = AmCharts.makeChart(this.getNode(), opts);

	// 	this.vars("am", { data, opts, chart });
	// 	this.print("rendering", this.vars());
	// }
	
}];