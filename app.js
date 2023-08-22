const express = require('express');
const app = express();
const fs = require('fs');

app.get('/',function(request,response){
    response.sendFile(__dirname +"/index.html");
})

app.get('/video', function(request,response){
  const range = request.headers.range;
  if(!range){
    response.status(404).send("Requires Range header"); 
  }
  const videoPath = "./Oggy & Cockroaches.mp4";
  const videoSize = fs.statSync(videoPath).size;
  //console.log("size of video is :", videoSize);
const CHUNK_SIZE = 10**6;
const start = Number(range.replace(/\D/g,""));
const end = Math.min (start + CHUNK_SIZE , videoSize-1);
const headers = {
  "content-Range" : `bytes ${start}-${end}/${videoSize}`,
  "Accept-Ranges" : 'bytes',
  "Content-Length": "",
  "Content-Type": "video/mp4"
}
response.writeHead(206,headers);
const videoStream = fs.createReadStream(videoPath,{start,end});
videoStream.pipe(response);
})

app.listen(3080,function () {
  console.log("Server is running on port:",3080);  
});