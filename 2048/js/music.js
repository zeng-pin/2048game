
var music=document.getElementById("backgroundmusicbuttom");
var picture=document.getElementById("picture-checkmusic");
var play=document.getElementById("music-play");
var stop=document.getElementById("music-stop");
var ado=document.getElementById("ado");
picture.onclick=function(){
	if(music.checked==false){
		music.checked=true;
		play.style.opacity=0;
		stop.style.opacity=1;
	}
	else{
	music.checked=false;
	play.style.opacity=1;
	stop.style.opacity=0;
	}
	
	if(music.checked==true){
		ado.play();
		ado.onended=function(){
			ado.play();
		}
	}
	if(music.checked==false){
		ado.pause();
	}
}
