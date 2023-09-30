import "webpack-dev-server";
import path from "path";
import webpack from "webpack";
import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import nodeExternals from "webpack-node-externals";

const isDev = process.env.NODE_ENV === "development";
const root = path.join(__dirname, "..");

const configuration: webpack.Configuration = {
  mode: isDev ? "development" : "production",
  target: ["web", "electron-renderer"],
  externals: [nodeExternals()],
  entry: path.join(root, "src", "renderer", "index.tsx"),
  output: {
    path: path.join(root, "dist", "renderer"),
    publicPath: "./",
    filename: "renderer.js",
    library: {
      type: "umd",
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              module: "esnext",
            },
          },
        },
      },
      {
        test: /\.s?(c|a)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          "sass-loader",
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [path.join(root, "src"), path.join(root, "node_modules")],
    plugins: [new TsconfigPathsPlugins()],
  },
  plugins: [
    ...(isDev ? [new ReactRefreshWebpackPlugin()] : []),
    new HtmlWebpackPlugin({
      filename: path.join("index.html"),
      template: path.join(root, "src", "renderer", "index.html"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
    }),
  ],
  ...(isDev
    ? {
        devServer: {
          port: process.env.PORT,
          compress: true,
          hot: true,
          headers: { "Access-Control-Allow-Origin": "*" },
          static: {
            publicPath: "/",
          },
        },
      }
    : {}),
};

export default configuration;
