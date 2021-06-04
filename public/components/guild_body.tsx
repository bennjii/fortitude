
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { Guild, GuildContextType } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ChevronDown } from 'react-feather';
import { ServerChannels } from './guild_channels';
import { ClientContext, GuildContext } from '@public/@types/context';

const GuildBody: React.FC<{}> = () => {
    const { client, state: clientState, callback: clientCallback } = useContext<ClientContextType>(ClientContext);
    const { guild, state: guildState, callback: guildCallback } = useContext<GuildContextType>(GuildContext)

    const [ initialFetch, setInitialFetch ] = useState(false);

    if(guild)
        return (
            <div className={styles.searchMenuParent}>
                <div className={styles.serverMenu}>
                    <h1>
                        {
                            guild.name
                        }
                    </h1>

                    <ChevronDown strokeWidth={2} size={18}/>
                </div>

                <div className={styles.scroll}>
                    <ServerChannels />
                </div>
            </div>
        )
    else 
        return (
            <div className={styles.searchMenuParent}>
                <div className={styles.serverMenu}>
                    <h1>
                        ...
                    </h1>

                    <ChevronDown strokeWidth={2} size={18}/>
                </div>

                <div className={styles.scroll}>
                   
                </div>
            </div>
        )
}

export { GuildBody }