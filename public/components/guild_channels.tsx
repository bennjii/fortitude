
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { ServerChannelNavigation } from './guild_channel_nav';
import { ClientContext, GuildContext } from '@public/@types/context';

const ServerChannels: React.FC<{  }> = ({ }) => {
    const { client } = useContext(ClientContext);
    const { guild, state, callback } = useContext(GuildContext)

    const [ itemState, setItemState ] = useState({
        current_channel_id: state.current_channel_id,
        current_channel: state.channels.find((channel) => channel.id == state.current_channel_id)
    });

    useEffect(() => {
        if(state.current_channel_id !== itemState.current_channel_id)
            callback({ ...state, current_channel_id: itemState.current_channel_id, current_channel: itemState.current_channel })
    }, [itemState]);

	return (
        <div>
            {
                state?.channels?.map(e => {
                    return (
                        <ServerChannelNavigation key={`channel-${e.id}`} active={state.current_channel_id == e.id} data={e} callback={() => {
                            setItemState({ ...itemState, current_channel_id: e.id , current_channel: e});
                        }}/>
                    )    
                }) 
            }
        </div>
	)
}

export { ServerChannels }