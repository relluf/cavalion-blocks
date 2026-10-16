"use amcharts";

// TODO: add source-property
// DOC: categoryField: "date"

["Container", {
	onLoad() {
		
	},
	onRender() {
		const timeline = { };
		
		const byTimeline = (entry) => {
			const ms = entry.date.getTime();
			return ms >= timeline.min && ms < timeline.max;
		};
		
		const source = this.ud("#series-data"); //this.get("source");
		const data = source.getObjects().filter(byTimeline);
		
		// determine window and filter data accordingly
		
		const chart = AmCharts.makeChart(this.getNode(), {
		    type: "serial", categoryField: "date",
		    dataProvider: data,
		    graphs: [
		    	
		    	// ...
		    	
		    ]
		});
		
	}
	
}, [
	
]];