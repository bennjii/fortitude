
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useContext, useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientContextType, ClientState, Guild } from '@public/@types/client';
import { ClientContext } from '@public/@types/context';

import Image from 'next/image'

const GuildNav: React.FC<{ data: any }> = ({ data }) => {
    const { client, state, callback } = useContext<ClientContextType>(ClientContext);
    const [ guildData, setGuildData ] = useState<Guild>(null); 

    const [ imageURL, setImageURL ] = useState(null);

    const [ itemState, setItemState ] = useState({
        hovered: false,
        active: false,
        image_url: ''
    });

    useEffect(() => {
        if(state.current_pannel !== `svr-${data}` && itemState.active) setItemState({ ...itemState, active: false });
    }, [state]);

    useEffect(() => {
        if(itemState.image_url == '')
            client
                .from('guilds')
                .select('*')
                .eq('id', data)
                .then(server => {
                    setGuildData(server.data[0]);

                    client
                        .storage
                        .from('server-icons')
                        .createSignedUrl(server.data[0].iconURL, 172800)
                        .then(e => {
                            setItemState({ ...itemState, image_url: e.signedURL });
                            setImageURL(e.signedURL); 
                        })
                })
    }, [])
    
	return (
        <div 
            className={
                (itemState.active) ? styles.navigationElementActive : (itemState.hovered) ? styles.navigationElementHovered : styles.navigationElement
            }
            onClick={() => {
                setItemState({ ...itemState, active: true });
                if(!itemState.active) callback({ ...state, current_pannel: `svr-${guildData.id}`, current_server: { id: guildData.id, data: guildData }})
            }}
            onMouseOver={() => setItemState({ ...itemState, hovered: true })}
            onMouseLeave={() => setItemState({ ...itemState, hovered: false })}
            >
            <Pill context={itemState} />
            <div className={(itemState.active) ? styles.navigationSideBarHomeActive : (itemState.hovered) ? styles.navigationSideBarHomeActive : styles.navigationSideBarHome} id={"navhome"}>
                <img src={imageURL} alt=""/>
            </div>
        </div>
	)
}

export { GuildNav }