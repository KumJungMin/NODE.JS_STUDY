// data폴더가 업데이트 될 때마다 글목록을 업데이트하는 역할
const testFolder = './data';   //실행하는 파일 위치 기준(root 기준)
const fs = require('fs');


fs.readdir(testFolder, function(err, filelist){
    console.log(filelist);    //[ 'CSS', 'HTML', 'JS' ]
})