import { supabase } from '../../client'

const sendMessage = async (req, res) => {
    const msg = req.headers.message;
    const channel = req.headers.channel;

    supabase
        .from('channels')
        .select('*')
        .eq('id', channel)
        .then(e => {
            if(e.error) return res.status(401).json(e.error);

            supabase
                .from('channels')
                .update({
                    ...e.data[0],
                    messages: [ ...e.data[0].messages, JSON.parse(msg) ]
                }).eq('id', channel)
                .then(e => {
                    if(e.error) return res.status(401).json(e.error);

                    return res.status(200).json(e.data[0])
                })
        });
}

export default sendMessage;