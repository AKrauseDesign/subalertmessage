var socket=io("http://hosted.stylerdev.io:3100"),lastTen=[],list=document.getElementsByClassName("content")[0],sectionFactory=function(s,e,n,a){a>0?list.insertAdjacentHTML("beforeend",'<section id="'+s+'"><span class="number">'+s+'</span><div class="wrap"><span class="title">Username: </span> <span class="username">'+e+" (Resub: "+a+' months)</span> <br> <span class="title">Message: </span> <span class="message">'+n+"</span></section>"):list.insertAdjacentHTML("beforeend",'<section id="'+s+'"><span class="number">'+s+'</span><div class="wrap"><span class="title">Username: </span> <span class="username">'+e+' (New Subscriber)</span> <br> <span class="title">Message: </span> <span class="message">'+n+"</span> </div> </section>")},findLastTen=function(s){if(null!==s){lastTen.unshift(s),lastTen.length>10&&lastTen.pop(),list.innerHTML=" ";for(var e=0;e<lastTen.length;e++)sectionFactory(e+1,lastTen[e].username,lastTen[e].message,lastTen[e].resub)}};socket.on("subMsg",findLastTen);