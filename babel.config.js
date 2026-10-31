module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { lazy: true }],
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-typescript",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: "./",
          alias: {
            "@": "./src",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
  };
};