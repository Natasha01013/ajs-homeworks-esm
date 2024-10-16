const path = require('node:path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: 'path.public', //  publicPath: params.path, // Префикс пути, по которому будут лежать файлы у вебпак дев сервера 
      // Например: '/public/assets/' - файлы будут доступны по адресу: http://localhost/public/assets/file_name.js
    },
    host: 'localhost', // Host webpack dev server'a
    port: 8080, // Port webpack dev server'a
    hot: true, // Включить автоперезагрузку страницы при изменении файлов
    proxy: [
    { // Собственно настройки прокси
      '**': { // С какого адреса webpack dev server'a будут проксироваться запросы на адрес локального сервера. 
        // В данном случае ** - значит все адреса проксировать, начиная с корня http://localhost:8080
        // Например: http://localhost:8080/user запрос на http://localhost/user (адрес из target ниже)
        target: `http://localhost:8080/`, // Целевой адрес локального сервера, куда будут проксироваться запросы с дев сервера 
        onProxyRes(proxyRes, req, res) {
          if (proxyRes.headers.location) { // Если есть заголовок со свойством location (Где храниться полный адрес запроса к локальному серверу)
            let location = proxyRes.headers.location; // Сохраняем адрес зоголовка location из ответа в переменную location
            console.log(`LOCATION: ${proxyRes.headers.location}`); // Выводит в консоль адрес до замены
            location = location.replace('localhost', 'localhost:8080'); // Заменяем адрес локального сервера на адрес webpack dev server'a
            proxyRes.headers.location = location; // Присваиваем в заголовок location подмененный адрес из переменной location
            console.log(`REPLACED: ${proxyRes.headers.location}`); // Выводит в консоль адрес после замены
          }
        }
      }
    }
  ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
            MiniCSSExtractPlugin.loader, 
            'css-loader'
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new MiniCSSExtractPlugin()
  ],
};