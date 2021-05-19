
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState } from '@public/@types/client';

const GuildNav: React.FC<{ data: any, client: SupabaseClient, callback: Function, state: ClientState }> = ({ data, client, callback, state }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active: false,
        image_url: null
    });

    useEffect(() => {
        client
            .storage
            .from('server-icons')
            .download(`${data}.png`)
            .then(e => {
                setItemState({ ...itemState, image_url: e.data })
            })
    }, [])

	return (
        <div 
            className={
                (itemState.active) ? styles.navigationElementActive : (itemState.hovered) ? styles.navigationElementHovered : styles.navigationElement
            }
            onClick={() => {
                setItemState({ ...itemState, active: true });
                if(!itemState.active) callback({ ...state, current_pannel: `svr-${data}` })
            }}
            onMouseOver={() => setItemState({ ...itemState, hovered: true })}
            onMouseLeave={() => setItemState({ ...itemState, hovered: false })}
            >
            <Pill context={itemState} />
            <div className={(itemState.active) ? styles.navigationSideBarHomeActive : (itemState.hovered) ? styles.navigationSideBarHomeActive : styles.navigationSideBarHome} id={"navhome"}>
                <img src={(itemState.image_url) && URL.createObjectURL(itemState.image_url)} alt="" />
            </div>
        </div>
	)
}

export { GuildNav }