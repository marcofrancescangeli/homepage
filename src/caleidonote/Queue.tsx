class Queue<T>
{
    maxSize: number;
    data : Array<T|undefined>;
    begin: number = 0;
    end: number = 0;
    constructor(size: number)
    {
        this.maxSize = size;
        this.begin = 0;
        this.end = 0;
        this.data = new Array<T>(this.maxSize);      
    }
  
    isEmpty = () : boolean => { return this.end === this.begin; }



    forEach = (functor:(a:T)=>void) =>
    {
        this.forRange(this.begin, this.end, functor);
    }
  
    forRange = (begin:number, end:number, functor: (a:T)=>void) : void=>
    {
        let i = begin;
        while( i !== end )
        {
            let d = this.data[i];
            if (d)
            {
                functor(d);
            }
            i++;
            if (i === this.maxSize )
            {
                i = 0;
            }
        }
    }
  
    pushBack = ( what:T ): void =>
    {
        this.data[this.end] = what;
        this.end++;
        if (this.end === this.maxSize )
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
        if (this.begin === this.maxSize )
        {
            this.begin = 0;
        }
    }
  
    front = () : T|undefined =>
    {
        return this.data[this.begin];
    }  

    size = () : number =>
    {
        return (this.end-this.begin + this.maxSize) % this.maxSize;
    }
};

export default Queue