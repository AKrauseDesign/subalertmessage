var socket=io("http://localhost:3100"),lastTen=[],list=document.getElementsByClassName("content")[0],subCount=0,resubCount=0,userCount=0,viewerMessages,viewerMsg=function(s){viewerMessages=s.userMessages,$(".button").text(viewerMessages?"Disable Viewer Messages":"Enable Viewer Messages")};$(".button").click(function(){viewerMessages=!viewerMessages,$(".button").text(viewerMessages?"Disable Viewer Messages":"Enable Viewer Messages"),socket.emit("changeSettings",{viewerMessages:viewerMessages})});var getAvatar=function(s){var e=jQuery.Deferred();return $.getJSON("https://api.twitch.tv/kraken/users/"+s+"?&callback=?",function(s){e.resolve(s.logo)}),e.promise()},sectionFactory=function(s,e,a,t){getAvatar(s).then(function(n){switch(a){default:console.log("ERROR");break;case"userMsg":userCount++,list.insertAdjacentHTML("afterbegin",'<div class="cart"><div class="img-hold"> <img src="'+n+'"> </div><section class ="message-wrap"><div class ="user-info"> <span class="username">'+s+'</span><span class="type"> (Viewer Message)</span><span class="time">'+moment().format("h:mm:ss a")+'</span></div><p class="message">'+e+"</p></div></div></section></div>"),$("#viewer").text(userCount);break;case"resubMsg":resubCount++,list.insertAdjacentHTML("afterbegin",'<div class="cart"><div class="img-hold"> <img src="'+n+'"> </div><section class ="message-wrap"><div class ="user-info"> <span class="username">'+s+'</span><span class="type"> ('+t+' months)</span><span class="time">'+moment().format("h:mm:ss a")+'</span></div><p class="message">'+e+"</p></div></div></section></div>"),$("#resub").text(resubCount);break;case"subMsg":subCount++,list.insertAdjacentHTML("afterbegin",'<div class="cart"><div class="img-hold"> <img src="'+n+'"> </div><section class ="message-wrap"><div class ="user-info"> <span class="username">'+s+'</span><span class="type"> (New Sub)</span><span class="time">'+moment().format("h:mm:ss a")+'</span></div><p class="message">'+e+"</p></div></div></section></div>"),$("#sub").text(subCount)}})},findLastTen=function(s){null!==s&&(lastTen.unshift(s),lastTen.length>10&&lastTen.pop(),sectionFactory(lastTen[0].username,lastTen[0].message,lastTen[0].type,lastTen[0].resub))};socket.on("message",findLastTen),socket.on("settings",viewerMsg);