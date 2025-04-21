module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env.local",
        blocklist: null,
        allowlist: null,
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      }
    ],
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@": "./src", // @ 경로 별칭 설정
        }
      }
    ]
  ]
};
