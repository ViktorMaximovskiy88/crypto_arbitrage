const webpack = require("webpack");

module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "fs": false,
        "buffer": require.resolve("buffer"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "url": false,
        "https": false,
        "zlib": require.resolve("browserify-zlib"),
        "assert": false,
        "constants": false,
        "util": require.resolve("util/"),
    };
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ];

    return config;
  };