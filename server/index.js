const http = require('http');
const fs = require('fs');
const path = require('path'); /*nodejs自带的模块*/

const baseUrl = './dist'; //静态资源根路径
const httpPort = 8090;
const mime = require('./mime.json');
http
  .createServer((req, res) => {
    /* 处理文件路径 */
    let pathUrl = baseUrl + req.url;
    /\/$/.test(pathUrl) && (pathUrl += 'index.html');

    /* 文件后缀 */
    let extname = path.extname(pathUrl);
    if (!extname) {
      // 不存在则默认返回index.html
      pathUrl = baseUrl + '/index.html';
      extname = path.extname(pathUrl);
    }

    let writeHeadConfig = {
      'Content-Type': `${mime[extname]}`,
    };

    /html|css|js/.test(extname) && (pathUrl += '.gz') && (writeHeadConfig['Content-Encoding'] = 'gzip');
    // 因webpack打包已生成.gz文件，不需要node服务gzip压缩
    // 响应头开启Content-Encoding:gzip，并返回.gz文件即可
    fs.readFile(pathUrl, '', (err, content) => {
      if (err) {
        console.log(`We cannot open "${pathUrl}" file.`);
      }
      console.log(pathUrl);
      res.writeHead(200, writeHeadConfig);

      res.end(content);
    });
  })
  .listen(httpPort, () => {
    console.log('Server listening on: http://localhost:%s', httpPort);
  });
