const path = require("path");

module.exports = {
	entry: path.join(__dirname, "index.js"),
	module: {
		rules: [
			{
				enforce: "pre",
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "eslint-loader",
				query:
				{
					configFile: ".eslintrc.yml",
				}
			},
            {
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
          			presets: ["es2015", "react"],
        		}
			},
            {
	            test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			},
		]
	},
    output: {
        path: path.join(__dirname, "/dist"),
		publicPath: "/dist/",
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: true
    }
}
