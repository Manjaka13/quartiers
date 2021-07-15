//Map manipulations
export default class Map {
	constructor() {
		this.map = null;
		this.baselayer_obj = null;
		this.coordinates = "";
		this.layers_shown = [];
		this.layers_shown_obj = [];
	}
	create(baselayer, params, wms, center, zoom) {
		if (!this.map && baselayer) {
			this.map = L.map("map");
			if (wms) {
				this.baselayer_obj = L.tileLayer
					.wms(baselayer, params || null)
					.addTo(this.map);
			} else
				this.baselayer_obj = L.tileLayer(baselayer).addTo(this.map, params || null);
			this.center(center, zoom);
			return true;
		}
		return false;
	}
	destroy() {
		if (this.map) {
			this.clear_layers();
			this.map.removeLayer(this.baselayer_obj);
			this.map.remove();
			this.baselayer_obj = null;
			this.map = null;
		}
	}
	center(center, zoom) {
		if (this.map && center && zoom) this.map.setView(center, zoom);
	}
	polygon(polypoints, styles) {
		if (this.map) {
			styles =
				typeof styles === "object"
					? styles
					: {
							weight: 3,
							color: "red",
							fillOpacity: 0.03,
					  };
			return L.polygon(polypoints, styles).addTo(this.map);
		}
		return null;
	}

	show_layer(layers_url, layers_params) {
		if (this.map) {
			const l = L.tileLayer.wms(layers_url, layers_params).addTo(this.map);
			this.layers_shown.push(layers_params.layers);
			this.layers_shown_obj.push(l);
			//console.log("Show: " + layers_params.layers);
			return true;
		}
		return false;
	}
	hide_layer(name) {
		if (this.map && this.layers_shown.length > 0 && name) {
			let id = -1;
			for (let i = 0; i < this.layers_shown.length; i++)
				if (this.layers_shown[i] === name) {
					id = i;
					break;
				}
			if (id >= 0 && id < this.layers_shown.length) {
				//console.log("Hide: " + name);
				this.map.removeLayer(this.layers_shown_obj[id]);
				this.layers_shown.splice(id, 1);
				this.layers_shown_obj.splice(id, 1);
				return true;
			}
		}
		return false;
	}
	clear_layers() {
		if (this.map && this.layers_shown.length > 0) {
			this.layers_shown.forEach((l, k) => {
				//console.log("Hide: ", l);
				this.map.removeLayer(this.layers_shown_obj[k]);
			});
			this.layers_shown = [];
			this.layers_shown_obj = [];
		}
	}
	create_marker(position, html) {
		if (this.map && position)
			return L.marker(position)
				.addTo(this.map)
				.bindPopup(
					html || "<p><strong>Do not forget to add html to marker !</strong></p>"
				)
				.openPopup();
	}
}
