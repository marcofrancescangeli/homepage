export class Signal
{
    public subscribe = ( callback : () => void ) =>
    {
        this.m_callbacks.push(callback);
    };

    public fire = () =>
    {
        this.m_callbacks.forEach(callback => {
            callback();
        });
    };

    private m_callbacks = new Array< () => void> ();
}