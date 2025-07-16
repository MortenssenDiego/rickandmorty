module.exports = {
  presets: [
    '@babel/preset-typescript',
    'module:@react-native/babel-preset'
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
  ]
};