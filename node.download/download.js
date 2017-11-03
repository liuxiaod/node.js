/**
 * Created by Administrator on 2017/11/3.
 */
// 需求文档：
// 完成一个下载功能--1.已下载 2.百分比 3.速度 4.总大小 5.用时
var fs = require('fs'),
    out = process.stdout;//process功能，用来打印输出值，和console.log()相仿。
var rs = fs.createReadStream('./shiping.rar'),
     ws = fs.createWriteStream('./shiping2.rar');
     rs.pipe(ws);
//获取文件信息
    var file = fs.statSync('./shiping.rar');//去获取文件详细信息
// console.log(file)
//获取文件大小
    var totalSize = file.size;//字节大小
    // console.log(totalSize)
//已下载的字节长度
//在这里，我们的已下载功能已经搞定，通过passedLength/(1024*1024)
    var passedLength = 0;//字节

//截止上一次时间点下载了多少字节
    var lastSize = 0 ;
//获取一下开始下载时间（用时=结束时间-开始时间）
   var startTime = Date.now();
//下载事件监听
//此时这个data是文件下载的字节，文件流。
   rs.on('data',function(chunk){
      passedLength+=chunk.length;
      // //防断网
// if(ws.write(chunk) === false){
//     rs.pause()//让其读写功能暂停
// }
})
//让其文档流读写时恢复
// rs.on('drain',function(){
//     rs.resume()//让其文档流继续恢复读写功能
// })
//其读写功能完毕
   rs.on('end',function(){
       ws.end()
   })
//setTimeout()  500ms监听一次，实时观测数据发生了哪些变化
setTimeout(function show(){
    //已下载大小
    var size = Math.ceil(passedLength/(1024*1024));//其后还需加入M(兆)，转化为已下载文件大小
    //求百分比
    var percent = Math.ceil((passedLength/totalSize)*100);// 其后还需加入%，转化为百分比
    //求速度
    var diff = (size - lastSize)*2;//对应M/s
    lastSize = size;
    out.clearLine()//清除行
    out.cursorTo(0);
    out.write(`已下载${size}Mb,${percent}%,速度${diff}Mb/s`)
    //递归操作
    if(passedLength<totalSize){
        setTimeout(show,500);
    }else{
       var endTime = Date.now();
       var times = (endTime-startTime)/1000;
       console.log(`总大小${size}Mb,用时${times}s`)
    }
},500)
