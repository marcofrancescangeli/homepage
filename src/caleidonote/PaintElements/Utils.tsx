export function average( start :number, end :number, what :(n:number)=>number ) : number
{
    var value = 0;
    
    for ( var i =start; i <end; ++i)
    {
        value += what(i);
    }
    return value / (end-start);
}

export function mod(a :number,b : number) :number
{
    return a - Math.floor(a/b)*b;
}
