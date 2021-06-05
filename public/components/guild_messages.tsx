
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { Message, GuildContextType } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ClientContext, GuildContext } from '@public/@types/context';

const GuildMessages: React.FC<{}> = () => {
    const { client, state: clientState, callback: clientCallback } = useContext<ClientContextType>(ClientContext);
    const { guild, state: guildState, callback: guildCallback } = useContext<GuildContextType>(GuildContext)

    const [ initialFetch, setInitialFetch ] = useState(false);

    console.log(guildState)

    if(guildState.current_channel == null) return <div></div>
    
    return (
        <div>
            {
                guildState.current_channel?.messages?.map((e: Message) => {
                    return (
                        <div>
                            {e.content}
                        </div>
                    )
                })
            }
        </div>
    )
}

export { GuildMessages }