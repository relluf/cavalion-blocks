"use js, util/HtmlElement";

const HE = require("util/HtmlElement");

const icon = (uri) => "/home/Library/assets/icons/" + uri;
const ppr = (uri) => "https://veldoffice.nl/publiek/putten/resources/" + uri;

const css = {
	// display: "flex",
	'backdrop-filter': "blur(25px)",
	
	/* Container for the cards */
	'#cards': "display: flex; align-items: center; gap: 20px; padding: 10px 20px; padding-left: 10%;",
	
	'#q': "margin-left: 25%; width: 50%; margin-top: 5%; padding: 8px 16px; border: none; border-radius: 11px; position: absolute; font-size: 16px; outline: 4px solid rgba(56, 107, 217, 0.5); background-color: rgba(255, 255, 255, 0.7); outline: none; transition: opacity 1s;",
	
	'#q:not(:hover):not(:focus)': "opacity: 0.5;",//filter: blur(1px);",

	/* Single icon container */
	'.card': {
		'': "text-align: center; border-radius: 30px; border: 0px dashed rgba(33,33,33,0.2); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s; cursor: pointer; padding: 20px; background-color: rgba(255,255,255,0.875); backdrop-filter: blur(10px); padding-bottom: 60px;",
		
	    '&:not(:hover):not(.extend-hover)': "transform: scale3d(0.75, 0.75, 1);",
	    '&:active': "transform: scale3d(0.8, 0.8, 1); filter: saturate(0.7) brightness(0.9) ;"
	},
	
	/* Icon image */
	'.card img': "width: 222px; height 222px; object-fit: contain;",
	
	/* Icon label */
	'.card .label': {
	    'font-size': "20px",// 'line-height': "0",
	    'font-weight': "600",
	    'color': "#333",
	    'transform': "translate(0, 40px)",
	    'dt': "font-size: 10px; color: gray;"
	},
};

const CARD_NEW = { label: "Nieuw...", icon: icon("uicons-bold-rounded/svg/fi-br-plus-small.svg") };
const cards_ = [ CARD_NEW,
	{ label: "Avallo", icon: ppr("avallo/logo.png") },
	{ label: "Koops", icon: ("/home/Workspaces/veldapps.com/Veldoffice/veldoffice-publiek-putten/resources/koops/KoopsGrondmechanica_telefoon.svg") },
	{ label: "GT", icon: ("/home/Dropbox/Library/Application Icons/VeldwerkGT.png") },
	{ label: "M", icon: ("/home/Dropbox/Library/Application Icons/VeldwerkM.png") },
	{ label: "5942", icon: icon("2384952-geography/svg/001-america.svg") },
	{ label: "PP", icon: icon("119570-landscapes-collection/svg/river.svg") },
	{ label: "rapportage", icon: icon("2384952-geography/svg/046-Terrain.svg") },
	{ label: "Enviso", icon: icon("3709573-marketing-and-growth/svg/010-target.svg") },
	{ label: "VA-20240929-1", icon: icon("2738946-geodetic-survey-and-measuring/svg/018-protractor.svg") },
	
];

["Container", { css: css }, [
	["Container", ("cards"), {
		classes: "cards",
		onMouseMove(evt) {
			const card = evt.target.soup(".card");
			
			if(card) {
				const ar = HE.getAbsoluteRect(card);
				const cxy = {x: evt.clientX - ar.left, y: evt.clientY - ar.top};
				// this.print(js.sf("%s %s", (cxy.x / ar.width) * 100, (cxy.y / ar.height) * 100));
				card.transformOrigin = js.sf("%s%% %s%%", (cxy.x / ar.width) * 100, (cxy.y / ar.height) * 100);
				
				if(!card.classList.contains("extend-hover")) {
					card.classList.add("extend-hover");
				}
				if(card.timeout) clearTimeout(card.timeout);
				card.timeout = setTimeout(() => {
					card.classList.remove("extend-hover");
					delete card.timeout;
				}, 250);
			}
		},
		onMouseDown(evt) {
			const card = evt.target.soup(".card");
			
			if(card) {
				card.style.transformOrigin = card.transformOrigin;
				
				this.vars("card-mousedown", card);
			}			
		},
		onMouseUp(evt) {
			const card = this.removeVar("card-mousedown");
			
			if(card) {
				setTimeout(() => card.style.transformOrigin = "", 400);
			}
		},
		onRender() {
			const cards = this.vars(["cards"]) || cards_;
			const pinned = this.vars(["pinned"]) || [];
			this._node.innerHTML = pinned.concat(cards)
				.map(card => js.sf(
					"<div class='card'><img src='%s'><div class='label'>%s</div></div>", 
					card.icon, card.label))
				.join("");
		}
	}],
	["Input", ("q"), { 
		placeholder: "Zoeken (⌘/)",
		onChange() {
			this.setTimeout("update-filter", () => {
				const value = this.getValue().toLowerCase();
				const parent = this.ud("#cards").getNode();
				
				Array.from(parent.childNodes).slice(1).forEach(node => {
					if(value === "") return (node.style.display = "");

					if(node.qs(".label").textContent.toLowerCase().includes(value)) {
						node.style.display = "";
					} else {
						node.style.display = "none";
					}
				});
			}, 100);
		}
		
	}],
]];