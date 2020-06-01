import Generator from "./Generator"
import Symbol from "./PaintElements/Symbol"
import Queue from "./Queue";

export class Fetcher 
{
    private m_generator : Generator | null = null;
    private endOfGenerator = false;
    private m_buffer = new Queue<Symbol>(256);

    setGenerator = (generator: Generator)=>
    {
        this.m_generator = generator;
        this.endOfGenerator = false;
        this.fetchToBuffer();
    }

    getBackgroundSymbols = () : Symbol[] =>
    {
        if ( this.m_generator )
        {
            return this.m_generator.getBackgroundSymbols();
        }
        else
        {
            return [];
        }
    }
    
    fetchSymbol = () : Symbol | undefined =>
    {
        if (this.m_buffer.size() <= 1 && !this.endOfGenerator)
        {
            // make sure that we retrieve a whole chain of linked symbols after the one we have already
            do{
            } while(this.fetchToBuffer());
        }

        if (!this.m_buffer.isEmpty())
        {
            let toReturn = this.m_buffer.front();
            this.m_buffer.popFront();
            return toReturn;
        }
        else
        {
            return undefined;
        }
    }

    private fetchToBuffer = () : boolean =>{
        if ( !this.m_generator )
        {
            return false;
        }
        let next = this.m_generator.fetchSymbol();
        if (next)
        {
            this.m_buffer.pushBack(next.s);
            return next.linkedToPrevious && !this.endOfGenerator;
        }
        else
        {
            this.endOfGenerator = true;
            return false;
        }
    }

    applyOffset = (offset: number) : void=>
    {
        if ( this.m_generator )
        {
            this.m_generator.applyOffset(offset);
            this.m_buffer.forEach((s: Symbol)=>
            {
                s.centerX += offset;
            });
        } 
    }
}

export default Fetcher;