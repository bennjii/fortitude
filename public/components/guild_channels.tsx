
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState, Guild } from '@public/@types/client';
import { Hash, UserPlus, Volume2 } from 'react-feather';
import { ServerChannelNavigation } from './guild_channel_nav';

const ServerChannels: React.FC<{ data: any, client: SupabaseClient, callback: Function, state: ClientState, guild: Guild }> = ({ data, client, callback, state, guild }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active_channel: '',
    });

	return (
        <div>
            {
               guild.channels.map(e => {
                   return (
                       <ServerChannelNavigation data={e} state={itemState} callback={setItemState}/>
                   )
               }) 
            }
        </div>
	)
}

export { ServerChannels }