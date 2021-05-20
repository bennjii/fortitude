
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState } from '@public/@types/client';

const ServerChannels: React.FC<{ data: any, client: SupabaseClient, callback: Function, state: ClientState, guild: object }> = ({ data, client, callback, state, guild }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active: false,
        image_url: null
    });

    // useEffect(() => {
    //     if(state.current_pannel !== `svr-${data.id}` && itemState.active) setItemState({ ...itemState, active: false });
    // }, [state]);

    useEffect(() => {
        console.log(data);

        client
            .storage
            .from('server-icons')
            .download(data.data.iconURL)
            .then(e => {
                setItemState({ ...itemState, image_url: e.data })
            })
    }, [])

	return (
        <div>
            {
                // MAP
            }
        </div>
	)
}

export { ServerChannels }