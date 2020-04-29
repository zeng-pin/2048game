
var board = new Array;
var score = 0;
var hasConflicted = new Array();


$(document).ready(function(){
	newgame();
});
function newgame(){
	//初始化棋盘格
	init();
	//随机两个格子生成两个数
	generateOneNumber();
	generateOneNumber();
	
	shownewRecord();
}
function init(){
	//构造4*4；
	for(var i = 0 ; i<4 ;i++){
		for(var j = 0 ; j < 4 ; j ++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i , j) );
			gridCell.css('left',getPosLeft(i , j));
			
		}
	}
	
	
	for(var i = 0 ; i < 4 ; i ++){
		board[i]=new Array();
		hasConflicted[i] = new Array();
		for(var j = 0 ;j < 4 ;j ++){
			board[i][j]=0;
			hasConflicted[i][j]=false;;
		}
	}
	updateBoardView();
	score = 0;
	$("#score").text("0");
	$("#gameOver").css({
		opacity:0
		});
	$('#score').css({
			color:" #000000"
	})
	
}

//更新数据及动画
function updateBoardView(){
	
	$(".number-cell").remove();
	for(var i = 0 ; i < 4 ; i ++){
		for(var j = 0 ;j < 4 ;j ++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'" ></div>');
			var theNumberCell=$('#number-cell-'+i+'-'+j);
			
			
			if(board[i][j] == 0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j) + 50);
				theNumberCell.css('left',getPosLeft(i,j) + 50);
			}
			else{
				theNumberCell.css('width','100px');
				theNumberCell.css('height','100px');
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]) );
				theNumberCell.css('color',getNumberColor(board[i][j]) );
				theNumberCell.css('letter-spacing',indentation(board[i][j]));
				
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}

}



//生成一个数字
function generateOneNumber(){
	if(nospace(board) ){
		return false;}
		
	
	//随机一个位置
	var randx =parseInt( Math.floor(Math.random()*4) );
	var randy =parseInt( Math.floor(Math.random()*4) );
	
	var times = 0;//time是为了防止重复过多使程序卡顿；
	while(times < 50){
		if(board[randx][randy] == 0)break;
		
		randx =parseInt( Math.floor(Math.random()*4) );
		randy =parseInt( Math.floor(Math.random()*4) );
		
		times++ ;
	}
	if(times == 50){
		for(var i = 0 ;i < 4 ;i ++)
			for(var j = 0; j < 4 ; j ++){
				if (board[i][j] ==0){//生成最近的一个位置
					randx = i;
					randy = j;
				}
			}
		
	}
	
	//随机一个数字2||4
	var randNumber=Math.random()<0.5 ? 2 : 4;
	//奖励方块 x2 
	if(Math.random()<=0.2){ randNumber = -2}//------------------------------------------------x2概率调节
	//在随机位置显示随机数字
	if(randNumber >0){
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	}
	else if(randNumber == -2){
		board[randx][randy]="×2";
		showNumberWithAnimation(randx,randy,"×2");
	}
	
	
	
	return true;
}
//对键盘动作进行相应----------------------------------核心
$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
		if( moveLeft() ){
			setTimeout("generateOneNumber()" ,200);
			setTimeout("isgameover()" ,400); 
		}
		break;
		case 38://up
		if( moveUp() ){
			setTimeout("generateOneNumber()" ,200);
			setTimeout("isgameover()" ,400); 
		}
		break;
		case 39://right
		if( moveRight() ){
			setTimeout("generateOneNumber()" ,200);
			setTimeout("isgameover()" ,400); 
		}
		break;
		case 40://down
		if( moveDown() ){
			setTimeout("generateOneNumber()" ,200);
			setTimeout("isgameover()" ,400); 
		}
		break;
		default://else
		break;
	}
});


//游戏是否结束
function isgameover(){//------------------------------------------------
	if(nospace( board ) && nomove( board )){
		gameover();
	}
 }
function gameover(){
	var record="record-1"
	if(getcookie(record)<score || getcookie(record)==undefined){
		setcookie(record,score,30);
		shownewRecord();
	}
	$("#gameOver").animate({
		opacity:1
		},1000);
	
}


//<-响应模块
function moveLeft(){
	if(!canMoveLeft())
	return false;
	
	for(var i = 0 ;i < 4 ;i ++)
		for(var j = 1; j < 4 ; j ++)
		{
			
			if(board[i][j] > 0){
				
				for(var k=0; k<j ;k++){
					if(board[i][k] == 0 && noBlockHorizontal(i , k , j , board)  ){
						//move
						showMoveAnimation(i ,j , i ,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(( board[i][k]=="×2"||board[i][k] == board[i][j]) &&noBlockHorizontal(i , k , j ,board) &&!hasConflicted[i][k]){
						//move
						showMoveAnimation(i ,j , i ,k);
						//add
						if(board[i][k]=="×2"){
							if(board[i][j]!="×2"){
							board[i][k] = board[i][j]*2;
							}
							else{
								continue;
							}
						}
						else{
						board[i][k] += board[i][j];
						}
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updatescore(score);
						continue;
					}
				
			}
		}
		else if(board[i][j] == "×2"){
			
			
			for(var k=0; k<j ;k++){
					if(board[i][k] == 0 && noBlockHorizontal(i , k , j , board)  ){
						//move
						showMoveAnimation(i ,j , i ,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(( board[i][k]=="×2"||board[i][k] > 0 ) &&noBlockHorizontal(i , k , j ,board) &&!hasConflicted[i][k]){
						//move
						if(board[i][k]=="×2"){
							showMoveAnimation(i ,j , i ,k+1);
						}
						else{showMoveAnimation(i ,j , i ,k);}
						//add
						if(board[i][k]=="×2"){
							if(board[i][j]!="×2")
							board[i][k] = board[i][k]*2;
							
							else{
								continue;
							}
						}
						else{
						board[i][k] += board[i][k];
						}
						board[i][j] = 0;
						
						//add score
						score += board[i][k];
						updatescore(score);
						continue;
					}
				
			}
			
			
		}
		
		
		
		
		
		
		
		}
		 setTimeout("updateBoardView()",200)
	return true;
}

 


function moveUp(){
	if(!canMoveUp())
	return false;
	
	for(var j = 0 ;j < 4 ;j ++)
		for(var i = 1; i < 4 ; i++)
		{
			
		
			if(board[i][j] > 0){
				
				for(var k=0; k<i ;k++){
					if(board[k][j] == 0 && noBlockVertical(j , k , i,board) ){
						//move
						showMoveAnimation(i ,j , k ,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						
						continue;
					}
					else if(( board[k][j]=="×2" || board[k][j] == board[i][j]) &&noBlockVertical(j , k , i,board)&& !hasConflicted[k][j]){
						//move
						showMoveAnimation(i ,j , k ,j);
						//add
						if(board[k][j]=="×2"){
							if(board[i][j]!="×2")
							
							board[k][j] = board[i][j]*2;
							else{
								continue;
							}
						}
						else{
						board[k][j] += board[i][j];
						}
						
						board[i][j] = 0;
						
						score += board[k][j];
						updatescore(score);
						continue;
					}
				
			}
		}
		else if(board[i][j] == "×2"){
			
			for(var k=0; k<i ;k++){
					if(board[k][j] == 0 && noBlockVertical(j , k , i,board) ){
						//move
						showMoveAnimation(i ,j , k ,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						
						continue;
					}
					else if(( board[k][j]=="×2" || board[k][j] > 0) &&noBlockVertical(j , k , i,board)&& !hasConflicted[k][j]){
						//move
						if(board[k][j]=="×2"){
							showMoveAnimation(i ,j , k+1,j);
						}
						else{showMoveAnimation(i ,j , k ,j);}
						//add
						if(board[k][j]=="×2"){
							if(board[i][j]!="×2")
							board[k][j] = board[k][j]*2;
							else{
								continue;
							}
						}
						else{
						board[k][j] += board[k][j];
						}
						
						board[i][j] = 0;
						
						score += board[k][j];
						updatescore(score);
						continue;
					}
				
			}

		}
	}
		 setTimeout("updateBoardView()",200)
	return true;
}

 function moveRight(){
 	if(!canMoveRight())
 	return false;
 	
 	for(var i = 0 ;i < 4 ;i ++)
 		for(var j = 2; j >=0 ; j --){
 			if(board[i][j] > 0){
 				
 				for(var k=3; k>j ;k--){
 					if(board[i][k] == 0 && noBlockHorizontal(i , j , k , board)){
 						//move
 						showMoveAnimation(i ,j , i ,k);
 						board[i][k] = board[i][j];
 						board[i][j] = 0;
 						
 						continue;
 					}
 					else if((board[i][k]=="×2"||board[i][k] == board[i][j]) &&noBlockHorizontal(i , j , k ,board) && !hasConflicted[i][k]){
 						//move
 						showMoveAnimation(i ,j , i ,k);
 						//add
						if(board[i][k]=="×2"){
							if(board[i][j]!="×2"){
							board[i][k] = board[i][j]*2;}
							else{
								continue;
							}
						}
						else{
 						board[i][k] += board[i][j];}
						
 						board[i][j] = 0;
						
						score += board[i][k];
						updatescore(score);
 						continue;
 					}
 				
 			}
 		}
		else if(board[i][j] == "×2"){
			
			for(var k=3; k>j ;k--){
					if(board[i][k] == 0 && noBlockHorizontal(i , j , k , board)){
						//move
						showMoveAnimation(i ,j , i ,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						
						continue;
					}
					else if((board[i][k]=="×2"||board[i][k] >0) &&noBlockHorizontal(i , j , k ,board) && !hasConflicted[i][k]){
						//move
						if(board[i][k]=="×2"){
							showMoveAnimation(i ,j , i ,k-1);
						}
						else{showMoveAnimation(i ,j , i ,k-1);}
						//add
						if(board[i][k]=="×2"){
							if(board[i][j]!="×2")
							board[i][k] = board[i][k]*2;
							else{
								continue;
							}
						}
						else{
						board[i][k] += board[i][k];}
						
						board[i][j] = 0;
						
						score += board[i][k];
						updatescore(score);
						continue;
					}
			  }
		}
	}
 		 setTimeout("updateBoardView()",200)
 	return true;
 }


 function moveDown(){
 	if(!canMoveDown())
 	return false;
 	
 	for(var j = 0 ;j <4  ;j ++)
 		for(var i = 2; i >=0 ; i--)
		{
 			if(board[i][j] > 0){
 				
 				for(var k=3; k>i ;k--){
 					if(board[k][j] == 0 && noBlockVertical(j , i , k ,board)){
 						//move
 						showMoveAnimation(i ,j , k ,j);
 						board[k][j] = board[i][j];
 						board[i][j] = 0;
 						
 						continue;
 					}
 					else if((board[k][j]=="×2"||board[k][j]== board[i][j] )&&noBlockVertical(j , i , k , board) && !hasConflicted[k][j]){
 						//move
 						showMoveAnimation(i ,j , k ,j);
 						//add
						if(board[k][j]=="×2"){
							if(board[i][j]!="×2")
							board[k][j] = board[i][j]*2;
							else{
								continue;
							}
						}
						else{
 						board[k][j] += board[i][j];}
 						board[i][j] = 0;
						
						score += board[k][j];
						updatescore(score);
 						continue;
 					}
 				
 			}
 		}
		
		else if(board[i][j]=="×2" ){
					for(var k=3; k>i ;k--){
						if(board[k][j] == 0 && noBlockVertical(j , i , k ,board)){
							//move
							showMoveAnimation(i ,j , k ,j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							
							continue;
						}
						else if((board[k][j]=="×2"||board[k][j] > 0)&&noBlockVertical(j , i , k , board) && !hasConflicted[k][j]){
							//move
							if(board[k][j]=="×2"){
								showMoveAnimation(i ,j , k-1 ,j);
							}
							else{showMoveAnimation(i ,j , k-1 ,j);}
							//add
							if(board[k][j]=="×2"){
								if(board[i][j]!="×2")
								board[k][j] = board[k][j]*2;
								else{
									continue;
								}
							}
							else{
							board[k][j] += board[k][j];}
							
							board[i][j] = 0;
							score += board[k][j];
							updatescore(score);
							continue;
						}
					
				}
			
		}

	}
 		 setTimeout("updateBoardView()",200)
 	return true;
 }
//响应模块->

//对屏幕上的按钮进行相应
window.onload=function(){
var buttonUp=document.getElementById("button-cell-up");
var buttonDown=document.getElementById("button-cell-down");
var buttonLeft=document.getElementById("button-cell-left");
var buttonRight=document.getElementById("button-cell-right");
buttonUp.onclick=function(){
	if( moveUp() ){
		setTimeout("generateOneNumber()" ,200);
		setTimeout("isgameover()" ,400); 
	}
}
buttonDown.onclick=function(){
	if( moveDown() ){
		setTimeout("generateOneNumber()" ,200);
		setTimeout("isgameover()" ,400); 
	}
}
buttonLeft.onclick=function(){
	if( moveLeft() ){
		setTimeout("generateOneNumber()" ,200);
		setTimeout("isgameover()" ,400); 
	}
}
buttonRight.onclick=function(){
	if( moveRight() ){
		setTimeout("generateOneNumber()" ,200);
		setTimeout("isgameover()" ,400); 
	}
}

}







/*bug 2020.4.3   1.×2在边界时判定会失效使其无法与其他数字累加；//已解决是因为在判断canmoveleft时没有判断×2的存在以及判断a[i+1][j]时的可行性；
				 2.×2与×2在相撞时会鬼畜；-------解决2020.4.5
待优化
				 1.最后一个如果是×2可以判定游戏没有失败；//已解决问题同1.
				 （解决方法可在gameover函数中遍历查找是否有×2
				 
				 2.可以优化一下游戏在第一次出现一个新数字时蹦出形如“GOOD”，“GREAT”，“WELL DONE”，“PERFECT”等动画。----------
				 3.可新增历史记录（cookie）
*/

/*

待优化 1.当数超过1024时会超框；-----解决2020.4.6
		2.数字超过1000000时变为无穷；
*/