
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState, Guild } from '@public/@types/client';
import { Hash, UserPlus, Volume2 } from 'react-feather';
import { ServerChannelNavigation } from './guild_channel_nav';
import { GuildContext } from '@public/@types/context';

const ServerChannels: React.FC<{  }> = ({ }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active_channel: '',
    });

    const { guild } = useContext(GuildContext)

	return (
        <div>
            {
                guild.channels.map(e => {
                    return (
                        <ServerChannelNavigation key={Math.random() * 10000} data={e} state={itemState} callback={() => {}}/>
                    )    
                }) 
            }
        </div>
	)
}

export { ServerChannels }