import axios from "axios";
import "./styles.scss";

const app = new Vue({
	el: "#app",
	data: {
		map: null,
	},
	created: function () {
		axios
			.get("https://map.geoportail.lu/jsapilayers")
			.then((response) => {
				const layers = response.data;
				let layer_names = [];
				let layer_visibilities = [];
				let layer_opacity = [];
				for (let element in layers) {
					layer_names.push(layers[element].name);
					layer_visibilities.push(false);
					layer_opacity.push(0.5);
				}
				/* this.map = new lux.Map({
					target: "map",
					bgLayer: "blank",
					zoom: 11,
					position: [75977, 75099],
					layers: layer_names,
					layerVisibilities: layer_visibilities,
					layerOpacities: layer_opacity,
					layerManager: {
						target: "layers",
					},
					mousePosition: {
						target: "coordinates",
						srs: 2169,
					},
					search: {
						target: "search",
					},
				}); */
				this.map = new lux.Map({
					target: "map",
					bgLayer: "blank",
					layers: ["parcels", "parcels_labels"],
					features: {
						ids: ["061F00614004236"],
						layer: "359",
					},
					showLayerInfoPopup: true,
				});
				this.map.removeInfoPopup();
				/* this.map.on("click", function (evt) {
					var coordinate = ol.proj.transform(
						evt.coordinate,
						"EPSG:3857",
						"EPSG:2169"
					);
					lux.reverseGeocode(coordinate, function (address) {
						var html = [
							address.number,
							address.street,
							address.postal_code + " " + address.locality,
						].join(", ");
					});
				}); */
				/* this.map.showMarker({
					position: [70977, 75099],
					click: true,
					html: "A propos de ce marqueur !",
				}); */
			})
			.catch((e) => console.log(e));
	},
	mounted: function () {
		//document.getElementById("search").firstChild.style.background = "red";
	},
	methods: {},
});
