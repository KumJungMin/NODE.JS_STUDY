const fs = require('fs'); //파일시스템 모듈

fs.readFile('sample.txt', 'utf-8', (err,data)=>{  
    //node는 상위디렉토리에서 실행된 것이므로, 이 디렉토리를 기준으로 경로를 작성하거나, 터미널상 경로를 변경함
    if (err) throw err;
    console.log(data);
});