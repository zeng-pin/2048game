function showNumberWithAnimation(i,j,randNumber){
	
	var numberCell=$('#number-cell-' + i + '-' + j);
	
	numberCell.css('background-color',getNumberBackgroundColor(randNumber) );
	numberCell.css('color',getNumberColor(randNumber) );
	numberCell.text(randNumber);
	
	
	numberCell.animate({
		width:"100px",
		height:"100px",
		top:getPosTop(i , j),
		left:getPosLeft(i , j)
	},50);
}


function showMoveAnimation(fromx , fromy ,tox , toy){
	var numberCell=$('#number-cell-' + fromx + '-' + fromy);
	numberCell.animate({
		top:getPosTop(tox , toy),
		left:getPosLeft(tox , toy)
	},200);
	
	
	
}


function updatescore( score ){
	$('#score').text(score);
	if(score<=100){
		$('#score').css({
			color: "#000000"
		})
	}
	else if(score<=500){
		$('#score').css({
			color: "#f2744a"
		})
	}
	else if(score<=1000){
		$('#score').css({
			color: "#f6bb43"
		})
	}
	else if(score<=2000){
		$('#score').css({
			color: "#cbed5b"
		})
	}
	else if(score<=3000){
		$('#score').css({
			color:" #74cc30"
		})
	}
	else if(score<=5000){
		$('#score').css({
			color: "#32e56e"
		})
	}
	else if(score<=7000){
		$('#score').css({
			color: "#34e5d1"
		})
	}
	else if(score<=10000){
		$('#score').css({
			color: "#33b5e5"
		})
	}
	else if(score<12000){
		$('#score').css({
			color: "#3176e5"
		})
	}
	else if(score<=15000){
		$('#score').css({
			color: "#3641e5"
		})
	}
	else if(score<=30000){
		$('#score').css({
			color: "#5f36e5"
		})
	}
	else {
		$('#score').css({
			color: "#9933cc"
		})
	}
}