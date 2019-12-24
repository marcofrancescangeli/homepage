import Symbol from './Symbol'
import NotePaintContext from './NotePaintContext';
import * as DrawUtils from './DrawUtils';
import * as Utils from './Utils';

export enum ChordType
{
    maj   =0,
    maj7,
    maj9,
    m,
    m6,
    m7,
    mMaj7,
    aug,
    aug7,
    aug9,
    augMaj7,
    dim,
    dim7,
    hdim,
    sus4,
    _6,
    _7,
    _7b5,
    _9,
    _11
};

export class Chord extends Symbol
{
    note :number;
    alt :number
    type :ChordType;
    name :string;
    
    constructor(note :number, alt :number, type: ChordType, x: number, context: NotePaintContext)
    {
        super( x, context);
    
        this.note = note;
        this.alt = alt;
        this.centerY = context.space * 8;
        this.type = type;
        this.bb.w = 50;
        switch(Utils.mod(note,7))
        {
            case 0: this.name = "C"; break;
            case 1: this.name = "D"; break;
            case 2: this.name = "E"; break;
            case 3: this.name = "F"; break;
            case 4: this.name = "G"; break;
            case 5: this.name = "A"; break;
            case 6: this.name = "B"; break;
            default: this.name = "";
        }
    }
    
    draw = ( ctx: CanvasRenderingContext2D ) :void =>
    {
        ctx.save();
        ctx.font = "20px Comic Sans MS";
        ctx.translate(this.centerX-10, this.centerY);
        ctx.fillText(this.name, 0, 0);
        ctx.translate(ctx.measureText(this.name).width+3,0);
        
        if ( this.alt !== 0)
        {
            //Flat/Sharp
            var xOffset = 0;
            ctx.save();
            ctx.scale(7,7);
            if (this.alt === -1)
            {
                ctx.translate(0.0,-0.2);
                DrawUtils.drawFlat(ctx);
                xOffset = 7;
            }
            else if (this.alt === 1)
            {
                ctx.translate(0.2,-0.9);
                DrawUtils.drawSharp(ctx);
                xOffset = 7;
            }
            ctx.restore();
            ctx.translate(xOffset, 0);
        }
        
        //minor
        
        if (this.type === ChordType.m 
        || this.type === ChordType.m6 
        || this.type === ChordType.m7
        || this.type === ChordType.mMaj7)
        {
            ctx.fillText("-", 0, 0);
            ctx.translate(ctx.measureText("-").width+2,0);
        }
        else if (this.type === ChordType.aug
        || this.type === ChordType.aug7
        || this.type === ChordType.aug9
        || this.type === ChordType.augMaj7)
        {
            ctx.fillText("+", 0, 0);
            ctx.translate(ctx.measureText("+").width+2,0);
        }
        ctx.translate(0,-5);
        ctx.scale(0.7,0.7);
        
//        if (this.type == ChordType.maj
//        || this.type == ChordType.maj9
//        || this.type == ChordType.augMaj7)
//        {
//            ctx.beginPath();
//            ctx.moveTo(0,0);
//            ctx.lineTo(8,0);
//            ctx.lineTo(4,-8);
//            ctx.closePath();
//            ctx.stroke();
//            ctx.translate(10,0);
//        }
        
        ctx.lineWidth = 2;
        
        if (this.type === ChordType.dim
        || this.type === ChordType.dim7)
        {
            ctx.beginPath();
            ctx.arc(3,-7, 4, 0, Math.PI*2);
            ctx.stroke();
            ctx.translate(10,0);
        }
        
        if (this.type === ChordType.hdim)
        {
            ctx.beginPath();
            ctx.arc(3,-7, 4, 0, Math.PI*2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-1,-14);
            ctx.lineTo(7, -1);
            ctx.stroke();
            ctx.translate(10,0);
        }
        
        var text="";
        switch(this.type)
        {
            case ChordType.maj7: text = "maj7"; break;
            case ChordType.maj9: text = "maj9"; break;
            case ChordType.m6: text = "6"; break;
            case ChordType.m7: text = "7"; break;
            case ChordType.mMaj7: text = "maj7"; break;
            case ChordType.aug7: text = "7"; break;
            case ChordType.aug9: text = "9"; break;
            case ChordType.augMaj7: text = "maj7"; break;
            case ChordType.dim7: text = "7"; break;
            case ChordType.sus4: text = "sus4"; break;
            case ChordType._6: text = "6"; break;
            case ChordType._7: text = "7"; break;
            case ChordType._7b5: text = "7b5"; break;
            case ChordType._9: text = "9"; break;
            case ChordType._11: text = "11"; break;
        }
        
        ctx.fillText(text, 0, 0);
        ctx.translate(ctx.measureText(text).width+3,0);
        
        ctx.restore();
    }
};

export default Chord