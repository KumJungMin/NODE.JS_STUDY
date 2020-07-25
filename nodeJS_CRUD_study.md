
# nodeJS를 이용한 CRUD

## 1. nodeJS 기초

### 1) 웹 서버 구동하는 법

- `require`을 사용하여 라이브러리를 불러옵니다.
- `createServer`을 사용하여 서버를 만듭니다.
- `request.url`을 사용해, 사용자가 요청한 url 주소를 받아옵니다.
- `if(request.url === '/')` 만약 사용자가 요청한 url주소가 `/`이면 index.html을 화면에 띄웁니다.

```node

  var http = require('http');           // http 요청관련 모듈
  var fs = require('fs');               // FileSystem의 약자로 파일 처리와 관련된 모듈
  var url = require('url');             // url에 입력된 값을 이용할 때 쓰는 모듈

  var app = http.createServer(function(request, response){
    var urls = request.url;              //요청한 url값 배열모음
    var queryData = url.parse(urls, true).query; //요청한 url값모음의 쿼리값
    if(request.url === '/'){
      url = '/index.html';
    }
    if(request.url === '/favicon.ico'){ //요청한 url이 favicon이면
      return response.writeHead(404);   //404 not found로 응답합니다.
    }
    response.writeHead(200);            //200 : 성공 했다는 응답
    response.end(queryData.id)          //내보낼 값을 인수로 두고, 콘텐츠 출력을 종료
  
    });
    app.listen(3000);                   //앱을3000포트로 구동
```

<br/>

### 2) 동적엔 웹사이트의 시작
- `을 사용해서 nodeJS에서 html 코드 사용이 가능합니다.
- html코드안에서 변수는 `${변수명}`형태로 사용합니다.

```node
  var http = require('http');     //http module
  var fs = require('fs');         //file system module
  var url = require('url');       //url module
  
  var app = http.createServer(function(request, response){
    var urls = request.url;       //user requested url
    var queryData = url.parse(urls, true).query; //query of urls array
    var title = queryData.id;  
    
    if(urls ===  '/'){
      title = 'hi';
    }
    if(urls === '/favicon'){        //requested urls === /favicon
    return response.writeHead(404); //notFound
    }
    response.writeHead(200);        //success
    
    var template = `
      <head>
        <title>${title}</title>
      </head>
      <body>
        <h1><a href="/">WEBSITE</a></h1>
        <ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JS">JS</a></li>
        </ul>
        
        <h2>${title}</h2>
        <p>this is description</p>
      </body>
    `;
    response.end(template);     
  });
  app.listen(3000);             //port 3000

```

<br/>

### 3) 외부 파일 읽는 법
- `require('fs')` 모듈을 불러옵니다.
- `fs.readFile(파일명, 문자인코딩, 콜백함수)`를 사용하여 파일에서 읽은 내용을 사용합니다.
```node
  const fs = require('fs'); //파일시스템 모듈

  fs.readFile('sample.txt', 'utf-8', (err,data)=>{  
    //node는 상위디렉토리에서 실행된 것이므로, 이 디렉토리를 기준으로 경로를 작성하거나, 터미널상 경로를 변경함
    if (err) throw err;
    console.log(data);
});
```
```node
  var fs = require('fs');
  fs.readFile('file.txt', 'utf8', function(err, data){
    console.log(data);
  });
```

<br/>

## 2. CRUD

### 1) BASIC
- 필요한 모듈을 불러옵니다.

```node
  var http = require('http');     //http module
  var fs = require('fs');         //file system module
  var url = require('url');       //url access module
  var qs = require('querystring');//HTTP GET방식 요청에서 URL 뒤에 붙는 쿼리 스트링정보에 접근하는 모듈
```

<br/>


- `function`을 정의하여 중복된 코드를 함수화시킵니다.

```node
  //function(1)
  //: title(제목), list(파일목록데이터), body(html코드1), control(html코드2)
  //: 화면에 띄우는 html을 함수화시킨 코드
  function templateHTML(title, list, body, control){
    return `
      <head>
        <title>WEB-${title}</title>
        <meta charset="utf-8">
      </head>
      
      <body>
        <h1><a href="/">HOME</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
    `
  }

  //function(2)
  //: filelist(파일목록 데이터의 배열)
  //: 배열로 불러온 파일목록 데이터를 html상에 나타내는 코드
  function templateList(fileList){
    var list = '<ul>';
    var i = 0;
    while(i<filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i+1;
    }
    list = list + '</ul>';
    return list;
  }
```

<br/>

- `createServer`을 사용하여 서버를 구동합니다.
- `readdir`을 사용하여 디렉토리 안에 있는 파일에 접근합니다.

```node
  var app = http.createServer(request, response){
    var urls = request.url;                       //user requested url
    var queryData = url.parse(urls, true).query;  //query
    var pathname = url.parse(urls, true).pathname;//pathname
  
    if(pathname === '/'){
      //요청한 쿼리의 id값이 없다면?->기본메인화면
      if(pathData.id === undefined){  
        //메인화면에 띄울 파일 목록을 가져오기 위해 readdir 사용
        fs.readdir('./data', finction(err, filelist){
          var title = 'HOME, HI';
          var desc = 'HELLO WOELD';
          var list =templateList(filelist);
          
          //화면에 띄울 html에 대한 코드
          var template = templateHTML(title, list, 
          `<h2>${title}</h2> <p>${desc}</p>`,
          `<a href = "/create">create</a>`)
        });
        response.writeHead(200);  //success
        response.end(template);   //operated template
      }
      
        //id값이 있는 경우의 코드
        //파일을 읽어서 이 내요을 desc에 담음 -> 사용
        //페이지가 열릴 때마다 txt를 매번 읽으므로, txt를 수정하면 바로 반영됨
      else{
        fs.readdir('./data', finction(err, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, desc){
            var list = templateList(filelist);
            var title = queryData.id;
            var template = templateHTML(title, list,
            `<h2>${title}</h2> <p>${desc}</p>`,
            `
            <a href = "/create">create</a> 
            <a href = "/update?id=${title}">update</a> 
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">  
              <input type="submit" value="delete">
            </form>
            `
            );
            response.writeHead(200);   //success
            response.end(template);    //operated template
          });
        });
        
       ....
      
      
      }
    }
  }
```

### 2) CREARE
- `create`버튼을 클릭했을 때, 구동되는 코드입니다.
- 버튼 클릭시, 글을 작성하는 페이지로 이동합니다.
- 글작성 후 `submit`을 클릭하여 `create_process`코드가 작동됩니다.

```node
      else if(pathname==='/create'){
        fs.readdir('./data', function(err, filelist){
          var title = 'web_create';
          var list = templateList(filelist);
          
          var template = templateHTML(title, list,
          `
           <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p><textarea name="desc" placeholder="desc"></textarea></p>
              <p><input type="submit"></p>
            </form>
          `,'');
           response.writeHead(200);
           response.end(template); 
        });
      }else if(pathname === '/create_process'){
        var body = '';
        //post방식으로 전송된 많은 데이터를 -> 데이터를 조각내고-> 수신할 때만 data조각을 보냄 
        request.on('data', function(data){
          body = body + data;
          if(body.length > 1e6){
            request.connection.destroy();
         }});
        //더이상 들어올 정보가 없으면 -> 이 함수를 호출
        request.on('end', function(){
          //parse함수를 사용하여, 저장된 바디를 입력값으로 줌-> post변수에 데이터들을 저장
          var post = qs.parse(body);
          var title = post.title;
          var desc = post.desc;
          
          // 입력한 정보를 data>파일에 저장하여 -> 목록에서 보이게 함
          fs.writeFile(`data/${title}`, desc, 'utf8', function(err){
            response.writeHead(302, {Location : `/?id=${title}`});  //302 - redirection
            response.end('success'); //주소값`         
          })
        })
      } ....
```

### 3) UDATE
- `readdir`을 사용하여 폴더에 접근하여 파일 리스트를 화면에 출력합니다.
- `readFile`을 사용하여 기존 데이터를 form에 placeholder로 둡니다.
- 사용자는 `update_process`버튼을 통해 데이터를 수정합니다. 
- 식별자는 `id`로 초기 데이터의 제목입니다.

```node
      else if(pathname==="/update"){
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
              `);
              response.writeHead(200);
              response.end(template);
            });
          });
        }else if(pathname === "/update_process"){
          var body = '';
          request.on('data', function(data){    
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
      } ...
```


### 4) DELETE
- `fs.unlink`를 사용하여 파일을 삭제합니다.

```node
      else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){     
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
```
















