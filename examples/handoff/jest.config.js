const path = require('path')

module.exports = {
    rootDir: "tests",
    transform: {
        "^.+\\.jsx?$": [
            "babel-jest",
            { "configFile": path.resolve(__dirname, "babel.config.js") },
          ],
    },
    transformIgnorePatterns: [
      "/node_modules/(?!@botonic).+\\.(js|jsx|ts|tsx)$"
    ],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(scss|css|less)$": "<rootDir>/__mocks__/styleMock.js"
    }
}