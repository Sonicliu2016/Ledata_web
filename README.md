# le_data_manager

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

git push --set-upstream origin dev_ls
git push --set-upstream origin dev_mali
git push --set-upstream origin dev

1：引入VueRouter： `npm i vue-router -S`或者`cnpm i vue-router -S`
2：引入ElementUI：`cnpm i element-ui -S`
  *此时如果报错，在webpack.config.js文件中加入一行：
  (参考-->https://blog.csdn.net/valderfields1206/article/details/80880392)
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader'
      }
3.引入axios：`cnpm install axios`
  -关于post跨域请求解决方案：https://www.cnblogs.com/snowhite/p/7872503.html
