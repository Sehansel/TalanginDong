module.exports = api => {
  const isTest = api.env('test');

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      ...(isTest ? [] : []),
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      ...(isTest ? ['babel-plugin-dynamic-import-node'] : []), // This plugin transforms dynamic imports into require calls during tests
    ],
  };
};
