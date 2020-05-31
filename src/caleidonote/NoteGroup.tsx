import Note from './PaintElements/Note'

class NoteGroup
{
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
        let toReturn = {notes: this.notes, arguments:this.arguments};
        this.inside = false;
        this.notes = [];
        return toReturn;
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