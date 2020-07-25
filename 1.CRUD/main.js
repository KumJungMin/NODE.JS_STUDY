var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
  return `  
  <!doctype html>
  <html>
    <head>
      <title>WEB1 - ${title} </title>
      <meta charset="utf-8">
    </head>
    
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list} 
      ${control}    <!--pathname = /create-->
      ${body}
    </body>
  </html>`
}


function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';  
    return list;  
}


var app = http.createServer(function(request,response){
    var _url = request.url;                          //요청한 url값모음
    var queryData = url.parse(_url, true).query;     //요청한 url값모음>쿼리값
    // var title = queryData.id;                        //요청한 url값>쿼리값>id값  (?id=값)
    var pathname = url.parse(_url, true).pathname;   //요청한 url값모음>pathname
    console.log(pathname);
    if(pathname === '/'){
      if(queryData.id === undefined){
        // 파일목록을 가져옴
        fs.readdir('./data', function(err, filelist){
          var title = 'hi';
          var desc = 'hello node.js';
          var list = templateList(filelist);

          var template = templateHTML(title, list, `<h2>${title}</h2> <p>${desc}</p>`, 
          `<a href = "/create">create</a> `
          );  //``이거임 '아님
              response.writeHead(200);
              response.end(template); //주소값`
        })        

        //id값이 있는 경우의 코드
        //파일을 읽어서 이 내요을 desc에 담음 -> 사용
        //페이지가 열릴 때마다 txt를 매번 읽으므로, txt를 수정하면 바로 반영됨
      } else {
        fs.readdir('./data', function(error, filelist){ 
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, desc){
            var list = templateList(filelist);
            var title = queryData.id;
            var template = templateHTML(title, list, `<h2>${title}</h2> <p>${desc}</p>`,
            `
            <a href = "/create">create</a> 
            <a href = "/update?id=${title}">update</a> 
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">  
              <input type="submit" value="delete">
            </form>
            `);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } 
    else if(pathname === '/create'){  // [if = pathname이 '/'가 아닐 때]
      fs.readdir('./data', function(err, filelist){
        var title = 'WEB-CREATE';
        var list = templateList(filelist);

        var template = templateHTML(title, list,
           `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p><textarea name="desc" placeholder="desc"></textarea></p>
              <p><input type="submit"></p>
            </form>
           `, '');  
            response.writeHead(200);
            response.end(template); //주소값`
      }) 
    
    }
    else if(pathname==='/create_process'){
      var body = '';
      request.on('data', function(data){    //post방식으로 전송된 많은 데이터를 -> 데이터를 조각내고-> 수신할 때만 data조각을 보냄  
        body += data;  //data조각을 추가
        // 전송한 데이터가 너무 크면 접속을 끊어버림
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){       //더이상 들어올 정보가 없으면 -> 이 함수를 호출
        var post = qs.parse(body);        //parse함수를 사용하여, 저장된 바디를 입력값으로 줌-> post변수에 데이터들을 저장
        var title = post.title;
        var desc = post.desc;

        // 입력한 정보를 data>파일에 저장하여 -> 목록에서 보이게 함
        fs.writeFile(`data/${title}`, desc, 'utf8', function(err){
            response.writeHead(302, {Location : `/?id=${title}`});  //302 - redirection
            response.end('success'); //주소값`
        })
      })

    }else if(pathname==="/update"){
      fs.readdir('./data', function(error, filelist){
        var list = templateList(filelist);
        
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, desc){
          var title = queryData.id;
          var template = templateHTML(title, list, 
          `
          <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}" />     <!--식별자-->
              <p><input type="text" name="title" placeholder="title"
              value="${title}"></p>
              <p><textarea name="desc" placeholder="desc">${desc}</textarea></p>
              <p><input type="submit"></p>
          </form>
          `,
          `
          <a href = "/create">create</a> 
          <a href = "/update?id=${title}">update</a> 
          `); ;
          response.writeHead(200);
          response.end(template);
        });
      });
    }else if(pathname === "/update_process"){
      var body = '';
      request.on('data', function(data){    //post방식으로 전송된 많은 데이터를 -> 데이터를 조각내고-> 수신할 때만 data조각을 보냄  
        body += data;  //data조각을 추가
        // 전송한 데이터가 너무 크면 접속을 끊어버림
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){       //더이상 들어올 정보가 없으면 -> 이 함수를 호출
        var post = qs.parse(body);        //parse함수를 사용하여, 저장된 바디를 입력값으로 줌-> post변수에 데이터들을 저장
        var title = post.title;
        var desc = post.desc;
        var id = post.id;

        fs.rename(`data/${id}`, `data/${title}`, function(err){  //파일명 수정
        // 입력한 정보를 data>파일에 저장하여 -> 목록에서 보이게 함
          fs.writeFile(`data/${title}`, desc, 'utf8', function(err){
            response.writeHead(302, {Location : `/?id=${title}`});  //302 - redirection
            response.end('success'); //주소값`
          })
        })
      })

    }else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){    //post방식으로 전송된 많은 데이터를 -> 데이터를 조각내고-> 수신할 때만 data조각을 보냄  
        body += data;  //data조각을 추가
      });

      request.on('end', function(){       //더이상 들어올 정보가 없으면 -> 이 함수를 호출
        var post = qs.parse(body);        //parse함수를 사용하여, 저장된 바디를 입력값으로 줌-> post변수에 데이터들을 저장
        var id = post.id;
        
        //id값에 해당하는 정보를 삭제한다.
        fs.unlink(`data/${id}`, function(err){
          response.writeHead(302, {Location : '/'});  //302리다이렉션-> /로 감
          response.end();
        })
      })
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
 
 
 
});
app.listen(3000);