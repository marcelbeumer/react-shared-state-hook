require('jsdom-global/register');
require('@babel/register')({
  presets: [['@babel/preset-env'], '@babel/preset-typescript', '@babel/preset-react'],
  extensions: ['.js', '.jsx', '.ts', '.tsx', 'tsx']
});
