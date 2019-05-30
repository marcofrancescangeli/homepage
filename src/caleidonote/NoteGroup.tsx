import Note from './PaintElements/Note'

class NoteGroup
{
    callback: ((notes:Note[], ...args: any[])=>void);

    constructor( callback :(notes:Array<Note>, ...args: any[])=>void )
    {
        this.callback = callback;
    }

    private inside : boolean = false;
    private notes : Note[] = [];
    private arguments : any[] = [];
    
    start = (...args: any[]) =>
    {
        this.end();
        this.inside = true;
        this.arguments = args;
    }

    end = () =>
    {
        if (this.notes.length > 0)
        {
            this.callback(this.notes, this.arguments);
        }
        this.inside = false;
        this.notes = [];
    }
    in = () : boolean => { return this.inside; }
    
    note = (note: Note) : void =>
    {
        if (this.inside)
        {
            if (this.onNewNote(note))
            {
                this.notes.push(note);
            }
            else
            {
                this.start();
            }
        }
    }
        
    onNewNote = (note: Note) : boolean =>
    {
        return true;
    }
}

export default NoteGroup