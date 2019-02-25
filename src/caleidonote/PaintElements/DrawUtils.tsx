export function drawFlat(ctx: CanvasRenderingContext2D)
{
    //flat
    ctx.lineWidth = 0.15;
    ctx.beginPath();
    ctx.moveTo(0.0,-1.7);
    ctx.lineTo(0,0.2);
    ctx.stroke();
    ctx.beginPath()
    ctx.moveTo(0.0,0.2);
    ctx.bezierCurveTo(0.9,-0.4, 0.9,-0.8, 0, -0.4);
    ctx.bezierCurveTo(0.6,-0.7, 0.8,-0.3, 0,  0.2);
    ctx.fill();
    ctx.stroke();
}

export function drawSharp(ctx: CanvasRenderingContext2D)
{
    //sharp
    ctx.lineWidth = 0.15;
        
    ctx.transform(1,-0.3, 0, 1, 0, 0);  
    
    ctx.beginPath();
    ctx.moveTo(-0.2,-1);
    ctx.lineTo(-0.2,+1);
    ctx.moveTo(+0.2,-1);
    ctx.lineTo(+0.2,+1);
    ctx.stroke();
    
    ctx.lineWidth = 0.2;
    ctx.beginPath();
    ctx.moveTo(-0.45,-0.4);
    ctx.lineTo(+0.45,-0.4);
    ctx.moveTo(-0.45,0.4);
    ctx.lineTo(+0.45,0.4);
    ctx.stroke();
}
 
export function drawDots( x: number, pitch: number, dots: number, ctx: CanvasRenderingContext2D )
{
    // Draw dots
    if ( dots > 0 )
    {
        let _y = 0;
        let _x = x;
        if ( pitch % 2 == 0 )
        {
            _y = -0.3;
        }
        ctx.beginPath();
        for ( var i=0; i < dots; ++i)
        {
            ctx.arc(_x,_y,0.15,0,2*Math.PI);
            _x += 0.7;
        }
        ctx.fill();
    }
}

export function drawStaff(left :number, right :number, space :number, ctx :CanvasRenderingContext2D)
{
    var i;
    ctx.lineWidth = 0.6;
      
    for ( i = 0; i < 5; ++i )
    {
      var y = i * space - (space*2);
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }
}