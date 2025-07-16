module.exports = {
  "preset": "react-native",
  "transform": {
      "^.+\\.ts?$": "ts-jest",
      "^.+\\.(js|jsx)$": "babel-jest"
  },
  "transformIgnorePatterns": [],
  "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "\\.snap$"
  ]
};