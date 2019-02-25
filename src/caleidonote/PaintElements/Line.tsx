export class Line
{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    
    constructor(x1: number, y1: number, x2:number, y2:number)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    
    getY = (x:number) : number =>
    {
        var a = (x-this.x1)/(this.x2-this.x1)
        return this.y1 + (this.y2-this.y1)*a;
    }
    
    moveEnds = (x1:number,x2:number) : void =>
    {
        var y1 = this.getY(x1);
        var y2 = this.getY(x2);
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
    
    move = ( dx:number, dy:number ) : void =>
    {
        this.x1 += dx;
        this.x2 += dx;
        this.y1 += dy;
        this.y2 += dy;
    }
}

export default Line;