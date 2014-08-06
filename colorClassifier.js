Point = function (r, g, b, label) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.label = label;
};

Point.prototype = {
	dist: function(p) {
		var r = Math.abs(p.r - this.r);
		var g = Math.abs(p.g - this.g);
		var b = Math.abs(p.b - this.b);

		return Math.sqrt(r * r + g * g + b * b);
	}
};

function getDataFromUrl(url, callback) {
	var data = [];
	$.getJSON(url, function (points) {
		for (var i = 0; i < points.length; ++i) {
			data.push(new Point(points[i].r, points[i].g, points[i].b, points[i].label));
		}
		callback(data);
	});
}

function getDataFromVariable(points, callback) {
	var data = [];
	for (var i = 0; i < points.length; ++i) {
		data.push(new Point(points[i].r, points[i].g, points[i].b, points[i].label));
	}
	callback(data);
}

function rgb_from_hex(triplet) {
	triplet = triplet.replace("#", "");

	// #rgb == #rrggbb
	if (triplet.length == 3) {
		triplet = triplet[0] + triplet[0] +
			triplet[1] + triplet[1] +
			triplet[2] + triplet[2];
	}

	value = parseInt(triplet, 16);
	var b = Math.floor(value % 256);
	var g = Math.floor((value / 256) % 256);
	var r = Math.floor((value / (256 * 256)) % 256);

	return new Point(r, g, b);
}

ColorClassifier = function () {
	this.data = [];
};

ColorClassifier.prototype = {
	learn: function (data) {
		this.data = data;
	},
	classify: function (triplet) {
		var point = rgb_from_hex(triplet);
		var min = Infinity;
		var min_idx = -1;
		var i, dist;
		for (i = 0; i < this.data.length; ++i) {
			dist = point.dist(this.data[i]);
			if (dist < min) {
				min = dist;
				min_idx = i;
			}
		}
		this.last_result = min_idx;
		return this.data[min_idx].label;
	},
	get_closest_color_hex: function(triplet) {
		var p = this.data[this.last_result];
		var val = p.r * (256 * 256) + p.g * 256 + p.b;
		var str = val.toString(16);
		while (str.length < 6)
			str = "0" + str;
		return "#" + str;
	}
};

