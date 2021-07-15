import "./styles.scss";
import axios from "axios";
import "./styles.scss";
import Map from "./Map.js";

(function () {
	new Vue({
		el: "#app",
		data: {
			quartiers_folder: "quartiers/",
			quartiers: [
				"anderlecht",
				"auderghem",
				"berchem-sainte-agathe",
				"brussells",
				"evere",
				"forest",
				"ganshoren",
				"ixelles",
				"jette",
				"koekelberg",
				"molenbeek-saint-jean",
				"saint-gilles",
				"saint-josse-ten-noode",
				"schaerbeek",
				"uccle",
				"watermael-boitsfort",
				"woluwe-saint-lambert",
				"woluwe-saint-pierre",
			],
			quartiers_data: [],
			map: null,
			loaded: 0,
			current_polygon: null,
			search: "",
			suggestion: [],
			suggestion_class: "suggestion",
		},
		mounted: function () {
			for (let i = 0; i < this.quartiers.length; i++) this.quartiers_data[i] = [];
			this.get_quartiers();
		},
		methods: {
			get_quartier(id) {
				return new Promise((resolve, reject) => {
					axios
						.get(this.quartiers_folder + this.quartiers[id] + ".json")
						.then(({ data }) => {
							this.quartiers_data[id] = data.geometries[0].coordinates[0][0].map((c) =>
								c.reverse()
							);
							this.loaded++;
							resolve();
						})
						.catch((e) => reject(e));
				});
			},
			get_quartiers() {
				if (Array.isArray(this.quartiers) && this.quartiers.length > 0) {
					this.quartiers.forEach((quartier, k) => this.get_quartier(k));
				}
				return null;
			},
			display() {
				if (this.loaded === this.quartiers.length) {
					this.map = new Map();
					this.map.create(
						"https://gis.urban.brussels/geoserver/ows?",
						{
							layers: "urbisFRGray",
							transparent: true,
							format: "image/png",
						},
						true,
						[50.854954, 4.3751791],
						12
					);
					this.show_quartier("ixelles");
				}
			},
			show_quartier(name) {
				let i = -1;
				for (i = 0; i < this.quartiers.length; i++)
					if (this.quartiers[i] === name.toLowerCase()) break;
				if (i >= 0 && i < this.quartiers.length) {
					if (this.current_polygon) this.map.map.removeLayer(this.current_polygon);
					this.current_polygon = this.map.polygon(this.quartiers_data[i], {
						weight: 3,
						color: "blue",
						fillOpacity: 0.03,
					});
				}
			},
			suggest(str) {
				this.suggestion = [];
				if (str.length > 2) {
					this.quartiers.forEach((q) => {
						if (str.toLowerCase() === q.slice(0, str.length).toLowerCase())
							this.suggestion.push(q.slice(0, 1).toUpperCase() + q.slice(1, q.length));
					});
					console.log(this.suggestion);
				}
				if (this.suggestion.length > 0)
					this.suggestion_class = "suggestion suggestion--active";
				else this.suggestion_class = "suggestion";
			},
			suggestion_switch(s) {
				s = s.toLowerCase();
				this.show_quartier(s);
				this.suggestion = [];
				this.search = "";
			},
		},
		watch: {
			loaded: {
				immediate: true,
				handler() {
					this.display();
				},
			},
			search: {
				immediate: true,
				handler(search) {
					this.suggest(search);
				},
			},
		},
	});
})();
