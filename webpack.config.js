const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = [
  // { name: "Background", path: 'src/pages/Background' },
  // { name: 'BrowserAction', path: 'src/pages/BrowserAction' },
  // { name: 'PageAction', path: 'src/pages/PageAction' },

  // { name: 'NewTab', path: 'src/pages/NewTab' },
  // { name: 'Options', path: 'src/pages/Options' },
  { name: "DevTools", path: 'src/pages/DevTools' },
  { name: "DevToolsPanel", path: 'src/pages/DevToolsPanel' },
  // { name: "ElementsSidebar", path: 'src/pages/ElementsSidebar' },
  // { name: "SourcesSidebar", path: 'src/pages/SourcesSidebar' },
];

const modules = [
  {
    name: 'contentScript',
    path: 'src/modules/contentScript'
  },
  {
    name: 'background-service-worker',
    path: 'src/pages/Background/service-worker'
  }
]

/** @type {import('webpack').Configuration} */
const config = {
  mode: "development",
  entry: {
    ...pages.reduce((pageMap, page) => (pageMap[`Pages/${page.name}/index`] = './' + page.path, pageMap), {}),
    ...modules.reduce((moduleMap, item) => (moduleMap[item.name] = './' + item.path, moduleMap), {}),
    "Background": './src/pages/Background'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/manifest.json' }, { from: 'assets', to: 'assets' }, { from: 'src/pages/Background/manifest.json', to: 'background-manifest.json' }],
    }),
    ...pages.map(page => new HtmlWebpackPlugin({
      title: page.name,
      filename: page.name === 'Background' ? 'Background.html' : `Pages/${page.name}/index.html`,
      chunks: [`Pages/${page.name}/index`],
      [page.template ? 'template' : '_']: page.template,
      scriptLoading: 'blocking'
    })),
    new HtmlWebpackPlugin({
      title: 'Background',
      filename: 'Background.html',
      chunks: ['Background'],
      scriptLoading: 'blocking'
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "css-loader",
            options: {
              exportType: "css-style-sheet",
            },
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset",
      },
    ]
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@base': path.resolve(__dirname, 'src/base/'),
      '@assets': path.resolve(__dirname, 'assets/'),
      '@common': path.resolve(__dirname, 'src/common/')
    },
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ],
  },
  devtool: "inline-source-map",
  // optimization: {
  //   splitChunks: {
  //     chunks: (chunk) => {
  //       if (chunk.name.includes('background-service-worker')) {
  //         return false
  //       }
  //       return true
  //     }
  //   }
  // },
  devServer: {
    contentBase: './dist'
  },
  experiments: {
    topLevelAwait: true
  }
};

module.exports = config;