$(function(){
	var canvas = $('#canvas').get(0);
	var ctx = canvas.getContext('2d');
	var canvasS = 450;
	var row = 15;
	var r = 4;
	var blockS = canvasS / row;
	var step = 1;
	var flag = true;
	var all = {};

	canvas.height = canvasS;
	canvas.width = canvasS;

   //画棋盘
   var draw = function(){
   	 var off = blockS / 2 + 0.5;
   	 var lineWidth = canvasS - blockS;

   	 var img = new Image();
   	 img.src = 'image/bg.jpg';
   	 img.onload = function(){
   		ctx.drawImage( img, 0,0,450,450);
        			//画横线
        			ctx.save();
        			ctx.beginPath();
        			ctx.translate( off,off );
        			for(var i= 0; i<row; i++){
        				ctx.moveTo( 0,0 );
        				ctx.lineTo( lineWidth,0 );
        				ctx.translate( 0,blockS );
        			}
        			ctx.stroke();
        			ctx.closePath();
        			ctx.restore();

        //画竖线 
        ctx.save();
        ctx.beginPath();
        ctx.translate( off,off );
        for(var i= 0; i<row; i++){
        	ctx.moveTo( 0,0 );
        	ctx.lineTo( 0,lineWidth );
        	ctx.translate( blockS,0 );
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

		//画四个点
		var pos = [ 3.5*blockS+0.5,11.5*blockS+0.5 ];
		for( var i = 0; i < pos.length; i++){
			for(var j = 0; j < pos.length; j++){
				var x = pos[i];
				var y = pos[j];
				ctx.save();
				ctx.beginPath();
				ctx.translate( x,y );
				ctx.arc( 0,0,r,0,(Math.PI / 18 *360) );
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		}
        //画中间点
        ctx.save();
        ctx.beginPath();
        ctx.translate( 7.5*blockS + 0.5,7.5*blockS + 0.5 );
        ctx.arc( 0,0,r,0,(Math.PI / 18 * 360) );
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        
    }

}
draw();


	//落棋子函数
	var drop = function(qizi){
		ctx.save();
		ctx.translate( (qizi.x+0.5)*blockS+0.5,(qizi.y+0.5)*blockS+0.5);
		ctx.beginPath();
		ctx.arc( 0,0,10,0,(Math.PI / 18 * 360) );
		if( qizi.color === 1){
			var black = new Image();
			black.src = 'image/black.png';
			black.onload = function(){
				ctx.drawImage(black,qizi.x*blockS,qizi.y*blockS,30,30);
			}
			$('#black_play').get(0).play();
		}else{
			var white = new Image();
			white.src = 'image/white.png';
			white.onload = function(){
				ctx.drawImage(white,qizi.x*blockS,qizi.y*blockS,30,30);
			}
			$('#white_play').get(0).play();
		}
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	var panduan = function(qizi){
		var shuju = {};
		$.each( all,function(k,v){
			if( v.color === qizi.color ){
				shuju[k] = v;
			}
		})
		var shu = 1,hang = 1,zuoxie = 1,youxie = 1;
		var tx,ty;
		/*shu*/
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ tx + '-' + (ty + 1)] ){
			shu ++;
			ty ++;
		}
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ tx + '-' + (ty - 1)] ){
			shu ++;
			ty --;
		}
		/*hang*/
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ (tx+1) + '-' + ty ] ){
			hang++; tx++;
		}
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ (tx-1) + '-' + ty ] ){
			hang++; tx--;
		}
		/*zuoxie*/
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ (tx-1) + '-' + (ty-1) ] ){
			zuoxie++; tx--; ty--;
		}
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ (tx+1) + '-' + (ty+1) ] ){
			zuoxie++; tx++; ty++;
		}
		/*youxie*/
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ (tx+1) + '-' + (ty-1) ] ){
			youxie++; tx++; ty--;
		}
		tx = qizi.x;
		ty = qizi.y;
		while( shuju[ (tx-1) + '-' + (ty+1) ] ){
			youxie++; tx--; ty++;
		}

		if( shu>=5 || hang>=5 || zuoxie>=5 || youxie>=5){
			return true;
		}
	}

	//单击下棋
	$(canvas).on('click',function(e){
		var x = Math.floor( e.offsetX / blockS );
		var y = Math.floor( e.offsetY / blockS );
		if( all[ x + '-' + y ] ){
			return;
		}
		var qizi;
		if( flag ){
			qizi = {x:x,y:y,color:1,step:step};
			drop( qizi );
			if( panduan(qizi) ){
				$('.cartel').show().find('#text').text('黑棋赢!');
			}
		}else{
			qizi = {x:x,y:y,color:0,step:step};
			drop( qizi );
			if( panduan(qizi) ){
				$('.cartel').show().find('#text').text('白棋赢!');
			}
		}
		step += 1;
		flag = !flag;
		all[ x + '-' + y ] = qizi;
	})

	$('#restart').on('click',function(e){
		$('.cartel').hide();
		ctx.clearRect(0,0,600,600);
		draw();
		kaiguan = true;
		all = {};
		step = 1;
	})
	$('#qipu').on('click',function(e){
		$('.cartel').hide();
		
		ctx.save();
		ctx.beginPath();
		ctx.font = "20px consolas";
		for( var i in all){
			if( all[i].color === 1){
				ctx.fillStyle = '#fff';
			}else{
				ctx.fillStyle = 'black';
			}
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(all[i].step,
				(all[i].x+0.5)*blockS,
				(all[i].y+0.5)*blockS);
		}
		ctx.closePath();
		ctx.restore();
		/*var image = $('canvas').toDataURL('image/jpg',1);
		$('#save').attr('href',image);
		$('#save').attr('download','qipu.png');*/
	})
	$('.tips').on('click',false);
	$('#close').on('click',function(){
		$('.cartel').hide();
	})
	$('.cartel').on('click',function(){
		$(this).hide();
	})



})