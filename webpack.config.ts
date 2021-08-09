import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration } from 'webpack-dev-server';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const production = process.env.NODE_ENV === 'production';
const isDevServer = !!process.env.WEBPACK_DEV_SERVER;

// bug: https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/32
delete process.env.TS_NODE_PROJECT;

function getEntry() {
  if(production || !isDevServer) {
    return {
      polyfills: './src/polyfills.ts',
      main: './src/main.tsx',
    };
  } else {
    return [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3100',
      'webpack/hot/only-dev-server',
      './src/polyfills.ts',
      './src/main.tsx',
    ];
  }
}

const config: webpack.Configuration & { devServer?: Configuration } = {
  mode: production ? 'production' : 'development',
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: production ? '[name].[contenthash].js' : '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: production ? 'tsconfig.prod.json' : 'tsconfig.json',
            },
          },
        ],
        include: [
          path.join(__dirname, './src'),
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
        include: [
          path.join(__dirname, './src/styles'),
          path.join(__dirname, './src/style.scss'),
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: !production,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // chunks: ['polyfills', 'main'],
      // chunksSortMode: 'manual',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        { from: './src/favicon.png', to: 'favicon.png' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: production ? '[name].[contenthash].css' : '[name].css'
    }),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.json',
      }),
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  devtool: production ? false : 'source-map',
  externals: [
    // {
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    // },
  ],
  devServer: {
    hot: true,
    contentBase: './dist/',
    clientLogLevel: 'warning',
    historyApiFallback: true,
  },
  optimization: {
    moduleIds: production ? 'natural' : 'named',
    runtimeChunk: 'single',
  },
};

export default config;
