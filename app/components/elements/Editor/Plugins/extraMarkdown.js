var md = require("markdown-it")({
	html: true,
	breaks: true,
	linkify: false,
	typographer: false,
	quotes: '“”‘’'
  }),
settings = require("./settings.json");
/**
 * Apply a selection of markdown it plugins to the instance
 *
 * @param {markdown-it} md
 * @param {Object} settings
 */

function applyBundle(md, settings) {

	md.options.breaks = true; // breaks at newlines

	var mediasPlugin = require("./MediaPlugin");
	md.use(mediasPlugin, { mode: "embed" });

	// Container plugin
	var containerPlugin = require("markdown-it-container"),
		containerSettings = settings.plugins.container;

	function renderBlock(blockName) {
		var settings = Object.assign({}, containerSettings[blockName]);
		return {
			render: function renderDefault(tokens, idx, _options, env, self) {

				// add a class to the opening tag
				if (tokens[idx].nesting === 1) {
					tokens[idx].attrPush(["class", settings.cssClasses || "alert alert-" + blockName]);

					if (settings.tagName) {
						tokens[idx].tag = tagName.toLowerCase();
					}
				}

				return self.renderToken(tokens, idx, _options, env, self);
			}
		}
	}
	md.use(containerPlugin, "warning", renderBlock("warning"));
	md.use(containerPlugin, "info",    renderBlock("info"));
	md.use(containerPlugin, "success", renderBlock("success"));
	md.use(containerPlugin, "exemple", renderBlock("success"));
	md.use(containerPlugin, "danger",  renderBlock("danger"));
}

applyBundle(md, settings);

// make it available as a global markdown function
global.markdown = module.exports = function(text) {
	return md.render(text);
};

// // alias marked.setOptions to markdown-it.set()
// // translate marked options to markdown-it
// marked.setOptions = function(opt) {

// 	if (opt.breakLines) {
// 		md.options.breaks = opt.breakLines;
// 	}

// };
