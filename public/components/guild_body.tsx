
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState } from '@public/@types/client';
import { ChevronDown } from 'react-feather';
import { ServerChannels } from './guild_channels';

const GuildBody: React.FC<{ client: SupabaseClient, callback: Function, state: ClientState }> = ({ client, callback, state }) => {
    const [ guildData, setGuildData ] = useState(state.current_server.data);
    const [ initialFetch, setInitialFetch ] = useState(false);

    useEffect(() => {
        if(state.current_server.id !== guildData.id || !initialFetch) {
            setInitialFetch(true);
            
            client
                .from('guilds')
                .select('*')
                .eq('id', state.current_server.id)
                .then(e => {
                    console.log(e)
                    setGuildData(e?.data[0])
                })
        }

    }, [state]);

    useEffect(() => {
        if(state.current_server.id !== guildData.id) {
            const userListener = client
                .from(`guilds:id=eq.${state.current_server.id}`) 
                .on('*', (payload) => {
                    console.log(payload);
                    setGuildData(payload.new)
                })
                .subscribe()

            return () => {
                userListener.unsubscribe()
            }
        }
        
    }, [state])

    if(guildData)
        return (
            <div className={styles.searchMenuParent}>
                <div className={styles.serverMenu}>
                    <h1>
                        {
                            guildData.name
                        }
                    </h1>

                    <ChevronDown strokeWidth={2} size={18}/>
                </div>

                <div className={styles.scroll}>
                    <ServerChannels client={client} state={state} callback={callback} guild={guildData} data={guildData}/>
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