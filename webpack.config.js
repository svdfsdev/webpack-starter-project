const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [new OptimizeCSSAssetsWebpackPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCSSExtractPlugin.loader,
      options: {
        hmr: true,
        reloadAll: true,
      },
    },
    'css-loader',
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = (preset) => {
  const options = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };

  if (preset) {
    options.presets.push(preset);
  }

  return options;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),

    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/icons'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/assets/images'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),

    new MiniCSSExtractPlugin({
      filename: filename('css'),
    }),
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),

  mode: 'development',

  entry: {
    main: ['@babel/polyfill', '@/index.js'],
    analytics: '@js/analytics.ts',
  },

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.js', '.json', '.png', '.jpg'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@js': path.resolve(__dirname, 'src/js/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@icons': path.resolve(__dirname, 'src/assets/icons/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    },
  },

  devServer: {
    port: 1000,
    hot: isDev,
  },

  devtool: isDev ? 'source-map' : '',

  optimization: optimization(),

  plugins: plugins(),

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },

      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },

      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },

      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },

      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },

      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        },
      },
    ],
  },
};
