class Queue<T>
{
    size: number;
    data : Array<T|undefined>;
    begin: number = 0;
    end: number = 0;
    constructor(size: number)
    {
        this.size = size;
        this.begin = 0;
        this.end = 0;
        this.data = new Array<T>(this.size);      
    }
  
    isEmpty = () : boolean => { return this.end == this.begin; }

    forEach = (functor:(a:T)=>void) =>
    {
        this.forRange(this.begin, this.end, functor);
    }
  
    forRange = (begin:number, end:number, functor: (a:T)=>void) : void=>
    {
        let i = begin;
        while( i != end )
        {
            let d = this.data[i];
            if (d)
            {
                functor(d);
            }
            i++;
            if (i == this.size )
            {
                i = 0;
            }
        }
    }
  
    pushBack = ( what:T ): void =>
    {
        this.data[this.end] = what;
        this.end++;
        if (this.end == this.size )
        {
            this.end = 0;
        }
    }
  
    popFront = ():void =>
    {
        if ( this.isEmpty() )
        {
            return;
        }
        this.data[this.begin] = undefined;
        
        this.begin++;
        if (this.begin == this.size )
        {
            this.begin = 0;
        }
    }
  
    front = () : T|undefined =>
    {
        return this.data[this.begin];
    }  
};

export default Queue