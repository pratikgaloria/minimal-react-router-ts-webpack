import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const cssModuleLoader = {
  loader: "css-loader",
  options: {
    modules: {
      mode: "local",
      localIdentName: "[name]_[local]-[hash:base64:5]",
    },
    importLoaders: 2,
  },
};

const config = {
  mode:
    (process.env.NODE_ENV as "production" | "development" | undefined) ??
    "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          cssModuleLoader,
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, cssModuleLoader, "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    client: {
      overlay: false,
    },
    static: [
      {
        directory: path.resolve(__dirname, "dist"),
      },
      {
        directory: path.resolve(__dirname, "assets"),
        publicPath: '/public',
      },
    ],
    hot: true,
    historyApiFallback: true,
    port: 8080,
    proxy: {
      '/api': {
         target: {
            host: "0.0.0.0",
            protocol: 'http:',
            port: 8081
         },
         pathRewrite: {
            '^/api': ''
         }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
};

export default config;
