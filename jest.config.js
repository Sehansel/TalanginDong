// jest.config.js
module.exports = {
  // Specify the root directory of your project
  rootDir: './',

  // Transform settings to use babel-jest for JavaScript and JSX files
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },

  // Define the environment in which your tests will run
  testEnvironment: 'jsdom', // Use 'node' if you are testing a Node.js environment

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
