const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
			"LL-dd-yyyy"
		);
	});

	eleventyConfig.addFilter("readableDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
			"LLLL dd, yyyy"
		);
	});

	// Copy the `admin` directory to the compiled site folder
	eleventyConfig.addPassthroughCopy("source/admin");

	// Copy all .txt files to the compiled site folder
	eleventyConfig.addPassthroughCopy("source/*.txt");

	// Copy the netlify redirects to the compiled site folder
	eleventyConfig.addPassthroughCopy("_redirects");

	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(pluginRss);

	return {
		dir: {
			input: "./source",
			output: "./build",
		},
		passthroughFileCopy: true,
	};
};
