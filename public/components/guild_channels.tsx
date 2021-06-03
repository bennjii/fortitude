
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState, Guild } from '@public/@types/client';

const ServerChannels: React.FC<{ data: any, client: SupabaseClient, callback: Function, state: ClientState, guild: Guild }> = ({ data, client, callback, state, guild }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active: false,
        image_url: null
    });

    useEffect(() => {
        client.from('')
    }, [])

	return (
        <div>
            {
               guild.channels.map(e => {
                   return (
                       <div>
                           {
                               e.name
                           }
                       </div>
                   )
               }) 
            }
        </div>
	)
}

export { ServerChannels }