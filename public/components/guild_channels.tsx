
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { ServerChannelNavigation } from './guild_channel_nav';
import { GuildContext } from '@public/@types/context';

const ServerChannels: React.FC<{  }> = ({ }) => {
    const { guild, state, callback } = useContext(GuildContext)

    const [ itemState, setItemState ] = useState({
        current_channel: state.current_channel
    });

    useEffect(() => {
        if(state.current_channel !== itemState.current_channel)
            callback({ ...state, current_channel: itemState.current_channel })
    }, [itemState])

	return (
        <div>
            {
                guild.channels.map(e => {
                    return (
                        <ServerChannelNavigation key={Math.random() * 10000} active={itemState.current_channel == e.id} data={e} callback={() => {
                            setItemState({ ...itemState, current_channel: e.id });
                        }}/>
                    )    
                }) 
            }
        </div>
	)
}

export { ServerChannels }