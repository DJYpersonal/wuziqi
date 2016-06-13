$(function(){

  var  canvasS = 600;
  var  row = 15;
  var  blockS = canvasS/row;
  ctx = $('#canvas').get(0).getContext('2d');
  var  starRadius = 3;


  $('#canvas').get(0).height = canvasS;
  $('#canvas').get(0).width = canvasS;

  var draw = function(){
    var off = blockS/2 + 0.5;
    var lineWidth = canvasS - blockS;

    ctx.save();
    ctx.beginPath();
    ctx.translate(off,off);
    for(var i = 0; i<row; i++){
      ctx.moveTo(0,0)
      ctx.lineTo(lineWidth,0);
      ctx.translate(0,blockS);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.translate(off,off);
    for(var i = 0; i<row; i++){
      ctx.moveTo(0,0)
      ctx.lineTo(0,lineWidth);
      ctx.translate(blockS,0);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    var points = [3.5*blockS+0.5 , 11.5*blockS + 0.5];
    for(var i = 0; i< 2; i++){
      for( var j=0; j<2; j++){
        var x = points[i];
        var y = points[j];
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }
    ctx.save();
    ctx.beginPath();
    ctx.translate(7.5*blockS+0.5, 7.5*blockS + 0.5);
    ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  draw();

  var qiziRadius = blockS/2*0.8;

  var drop = function(qizi){
    ctx.save();
    ctx.beginPath();
    ctx.translate((qizi.x+0.5)*blockS + 0.5, (qizi.y+0.5)*blockS + 0.5);
    ctx.arc(0,0,qiziRadius,0,Math.PI/180*360);
    if( qizi.color === 1){
      ctx.fill();
    }else{
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = 'black';
      ctx.fill();
      ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
  }

  var kaiguan = true;
  all = {};
  var step = 1;

  panduan = function(qizi){
    var shuju = {};
    $.each(all,function(k,v){
      if( v.color === qizi.color ){
        shuju[k] = v;
      }
    })
    var shu = 1,hang=1,zuoxie=1,youxie=1;
    var tx,ty;

    /*|*/
    tx = qizi.x; ty = qizi.y;
    while ( shuju [ tx + '-' + (ty + 1) ]){
      shu ++;ty++;
    }
    tx = qizi.x; ty = qizi.y;
    while ( shuju [ tx + '-' + (ty - 1) ]){
      shu ++; ty--;
    }

    /*-*/
    tx = qizi.x ; ty = qizi.y;
    while( shuju[ (tx+1) + '-' + ty ] ){
      hang++;tx++;
    }
    tx = qizi.x ; ty = qizi.y;
    while( shuju[ (tx-1) + '-' + ty ] ){
      hang++;tx--;
    }

    tx = qizi.x; ty = qizi.y;
    while( shuju[ (tx-1) + '-' + (ty-1) ] ){
      zuoxie++;tx--;ty--;
    }
    tx = qizi.x ; ty = qizi.y;
    while( shuju[ (tx+1) + '-' + (ty+1) ] ){
      zuoxie++;tx++;ty++;
    }

    tx = qizi.x ; ty = qizi.y;
    while( shuju[ (tx+1) + '-' + (ty-1) ] ){
      youxie++;tx++;ty--;
    }
    tx = qizi.x ; ty = qizi.y;
    while( shuju[ (tx-1) + '-' + (ty+1) ] ){
      youxie++;tx--;ty++;
    }

    if( shu >=5  || hang>=5 || zuoxie>=5 || youxie>=5){
      return true;
    }
  }

  $('#canvas').on('click',function(e){
    var x = Math.floor(e.offsetX/blockS);
    var y = Math.floor(e.offsetY/blockS);

    if( all[ x + '-' + y ]){
      return;
    }

    var qizi;

    if(kaiguan){
      qizi = {x:x,y:y,color:1,step:step};
      drop(qizi);
      if( panduan(qizi) ){
        $('.cartel').show().find('#tishi').text('黑棋赢');
      };
    }else{
      qizi = {x:x,y:y,color:0,step:step};
      drop(qizi);
      if( panduan(qizi) ){
        return;
      };
    }
    step += 1;
    kaiguan = !kaiguan;
    all[ x + '-' + y ] = qizi;

  });

  $("#restart").on('click',function(){
    $('.cartel').hide();
    ctx.clearRect(0,0,600,600);
    draw();
    kaiguan = true;
    all = {};
    step = 1;
  })

  $('#qipu').on('click',function(){
    $('.cartel').hide();
    $('#save').show();
    ctx.save();
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
    ctx.restore();
    var image = $('#canvas').get(0).toDataURL('image/jpg',1);
    $('#save').attr('href',image);
    $('#save').attr('download','qipu.png');
  })

  $('.tips').on('click',false);
  $('#close').on('click',function(){
      $('.cartel').hide();
  })
  $('.cartel').on('click',function(){
    $(this).hide();
  })
})
