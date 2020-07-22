window.onload = function(){
    function $(idName){
        return document.getElementById(idName);
    }
    var gamestart = $("gameStart");
    var start = $("start");
    var descriable =$("descriable");
    var cl1= $("cl1");
    var game = $("game");
    var oprate =$("oprate");
    var cl=$("cl");
    var sel=$("sel");
    var selFir=sel.firstElementChild;
    //游戏界面的高度和宽度
    var gameH = getStyle(gamestart,"height");
    var gameW = getStyle(gamestart,"width");
    //定时器
    var c,letterEles,level=3,letters="",score= 0,accu= "0%",s=0,count= 0,startTimeStamp=null,endTimeStamp=null;
    //点击开始，隐藏游戏开始界面，显示进入游戏的界面
    start.onclick = function(){
        gamestart.style.display="none";
        game.style.display="block";
    }
    if(!document.getElementsByClassName){
        document.getElementsByClassName = function(clsName){
            var all = document.all;
            var arr=[];
            for(var i=0;i<all.length;i++){
                arr.push(arr[i]);
            }
            return arr;
        }
    }
    //说明
    descriable.onclick = function(){
        des.style.display="block";

    }
    //提示关闭按钮
    cl1.onclick=function(){
        des.style.display="none";
    }
    //游戏界面四个操作按钮
    oprate.onclick = function(ev){
        var e = ev||window.event;
        var target = e.srcElement || e.target;
        //退出
        if(target.className== "t"){
            //首先结束游戏
            finished();
            //显示开始游戏界面，隐藏游戏界面
            gamestart.style.display="block";
            game.style.display="none";
        }
        //设置
        if(target.className=="set"){
            sel.style.display="block"; 
            //关闭游戏难易设置之后生效
            cl.onclick = function(){
                sel.style.display="none";
                level=selFir.value;
                // console.log(level);
            }           
        }
        //进入游戏界面之后的开始游戏
        if(target.className== "s"){
            target.innerHTML=target.innerHTML == "开始"?"暂停":"开始";

            //游戏的暂停
            if(target.innerHTML == "开始"){
                oprate.lastElementChild.style.cursor = "pointer";
                clearInterval(c);
                c=undefined;
                //清除所有元素的定时器
                clearAllLetters();
            }else{
                //游戏的开始
                oprate.lastElementChild.style.cursor = "not-allowed";

                if(c){
                    return;
                }
                startTimeStamp = new Date()*1;
                c= setInterval(function(){
                    endTimeStamp = new Date()*1
                    if(endTimeStamp- startTimeStamp <= 60*1000){
                        tit.children[1].firstElementChild.innerHTML = score;
                    }else{
                        tit.children[1].firstElementChild.innerHTML =Math.ceil(score/Math.ceil((endTimeStamp-startTimeStamp)/(60*1000)));
                    }
                    createLetter();
                    letterEles=document.getElementsByClassName("active");
                },level*500);            //500控制当前游戏界面显示字母的多少
                //暂停之后的开始游戏
                console.log(level);
                gameRstart();

            }
        }
        //结束
        if(target.className == "f"){
            finished();
        }

    }
    document.onkeyup = function(evt){
        var e= evt || window.event;
        var codeVal = e.keyCode;
        if(codeVal>=65&&codeVal<=90){
            count++
        }
        //根据键值找到该键值对于的字符
        var char = keyVal[codeVal];
        if(char){
            var index = letters.search(eval("/"+ char +"/gi"));
            if(index != -1) {
                game.removeChild(letterEles[index]);
                var exp = eval("/" + char + "/gi");
                letters=letters.replace(exp,"");
                tit.firstElementChild.firstElementChild.innerHTML = ++score;
            }
            tit.children[2].firstElementChild.innerHTML = (score/count*100).toFixed(2)+"%";

        }

    }

    //创建字母
    function createLetter(){
        var span = document.createElement("span");
        span.className=("active");
        var l=randLetter();      
        span.innerHTML = l;
        letters += l ;
        span.style.left = Math.floor(Math.random()*(gameW-30))+"px";
        span.style.background=ranBg();
        game.appendChild(span);
        startMove(span,gameH,"top");

    }
    //随机产生字母
    function randLetter(){
        var str = "abcdefghijklmnopqrstuvwxyz";
        str += str.toUpperCase();
        return str.charAt(Math.floor(Math.random()*str.length));
    }
    //随机产生颜色
    function ranBg(){
        var str = "0123456789abcdef";
        var colorVal="#"
        for(var i=0;i<6;i++){
            colorVal +=str.charAt(Math.floor(Math.random()*str.length));
        }
        return colorVal;
    }
    //获取元素使用样式的最终值
    function getStyle(ele,attr){
        var res=null;
        if(ele.currentStyle){
            res=ele.currentStyle[attr];
        }else{
            res=window.getComputedStyle(ele,null)[attr];
        }
        return parseFloat(res);
    }
    //运动函数，元素的运动，元素运动的最终值，元素的那个属性运动
    function startMove(ele,end,attr){
        //控制字母落下的速度
        var speed=1+score/100;
        ele.timer = setInterval(function(){
            var  moveVal= getStyle(ele,attr);
            if(moveVal >= end){
                clearInterval(ele.timer);
                game.removeChild(ele);
                letters=letters.replace(ele.innerHTML,"");
            }else{
                ele.style[attr] = moveVal +speed + "px";
            }
        },10);
    }
    //清除所有元素的定时器
    function clearAllLetters(){
        for(var i=0;i<letterEles.length;i++){
            clearInterval(letterEles[i].timer);
            letterEles[i].timer = undefined;
        }
    }
    //暂停之后开始游戏
    function gameRstart(){
        if(!letterEles) return;
        for(var i=0;i<letterEles.length;i++){
            startMove(letterEles[i],gameH,"top");
        }
    }
    //结束游戏
    function finished(){
        //清除单位时间内产生字母的定时器
        clearInterval(c);
        c= undefined;
        score=0;
        s=0;
        accu="0%"
        tit.children[0].firstElementChild.innerHTML = score;
        tit.children[1].firstElementChild.innerHTML = s;
        tit.children[2].firstElementChild.innerHTML = accu;

        //删除所有字母
        for(var i=letterEles.length-1;i>=0;i--){
            game.removeChild(letterEles[i]);
        }
        if(oprate.firstElementChild.innerHTML == "暂停"){
            oprate.firstElementChild.innerHTML = "开始";
        }
    }
}