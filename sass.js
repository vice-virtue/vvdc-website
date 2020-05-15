var sass = require("sass");
var fs = require("fs");
var pkg = require("./package.json");

// Configs
var configs = {
	name: "www.washvicevirtue.com", // The name to use in the file banner
	files: ["app.scss"], // The files to process
	pathIn: "./source/assets/styles/", // The source directory for your Sass files
	pathOut: "./build/assets/styles/", // The directory to compile CSS files into
	sourceMap: true, // If true, will generate a sourcemap
	minify: true, // If true, a minified version will also be created with the .min suffix
};

// Banner
var banner = `/*! ${configs.name ? configs.name : pkg.name} v${
	pkg.version
} | (c) ${new Date().getFullYear()} ${pkg.author.name} | ${
	pkg.license
} License | ${pkg.repository.url} */`;

var getOptions = function (file, filename, minify) {
	return {
		file: `${configs.pathIn}/${file}`,
		outFile: `${configs.pathOut}/${filename}`,
		sourceMap: configs.sourceMap,
		indentType: configs.indentType,
		indentWidth: configs.indentWidth,
		outputStyle: minify ? "compressed" : "expanded",
	};
};

var parseSass = function (file, minify) {
	var filename = `${file.slice(0, file.length - 5)}${
		minify ? ".min" : ""
	}.css`;
	sass.render(getOptions(file, filename, minify), function (err, result) {
		// If there's an error, throw it
		if (err) throw err;

		// Create the directory path
		fs.mkdir(configs.pathOut, { recursive: true }, function (err) {
			// If there's an error, throw it
			if (err) throw err;

			// Write the file to the path
			fs.writeFile(
				`${configs.pathOut}/${filename}`,
				result.css,
				function (err) {
					if (err) throw err;

					var data = fs.readFileSync(
						`${configs.pathOut}/${filename}`
					);
					var fd = fs.openSync(
						`${configs.pathOut}/${filename}`,
						"w+"
					);
					var insert = new Buffer.from(banner + "\n");
					fs.writeSync(fd, insert, 0, insert.length, 0);
					fs.writeSync(fd, data, 0, data.length, insert.length);
					fs.close(fd, function (err) {
						if (err) throw err;
						console.log(`Compiled ${configs.pathOut}/${filename}`);
					});
				}
			);
		});
	});
};

configs.files.forEach(function (file) {
	parseSass(file);
	if (configs.minify) {
		parseSass(file, true);
	}
});
