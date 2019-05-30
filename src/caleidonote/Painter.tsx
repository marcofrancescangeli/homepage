
interface Painter
{
    //paint new elements and return the rightmost coordinate (in canvas X)
    paint(context: CanvasRenderingContext2D) : number;

    //this notifies that the canvas is going out of sight (in canvas X)
    unpaint( upToX: number ) : void;

    // apply new offset to the graphics stuff and return the new rightmost coordinate (in canvas X)
    applyOffset(offset: number, context: CanvasRenderingContext2D) : number;
    
    // paint background
    paintBackground(context: CanvasRenderingContext2D) : void;
}

export default Painter;