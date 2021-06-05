
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { Guild, User } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ChevronDown, Hash, Home, LogOut, Settings, Users } from 'react-feather';
import { ServerChannels } from './guild_channels';
import { ClientContext, GuildContext } from '@public/@types/context';
import { GuildBody } from './guild_body';
import { GuildMessages } from './guild_messages';

const GuildBase: React.FC<{ userData: User }> = ({ userData }) => {
    const { client, state, callback } = useContext<ClientContextType>(ClientContext);

    const [ guildData, setGuildData ] = useState<Guild>(state.current_server.data);
    const [ initialFetch, setInitialFetch ] = useState(false);

    const [ guildState, setGuildState ] = useState({
        current_channel: null,
        current_channel_id: ''
    });

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
                    setGuildState({ ...guildState, current_channel_id: e?.data[0]?.channels[0]?.id, current_channel: e?.data[0].channels[0] })
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

    return (
        <GuildContext.Provider value={{ guild: guildData, state: guildState, callback: setGuildState }}>
            <div className={styles.base}>
                <div className={styles.sideBar}>
                    <div className={styles.sideBarContainer}>
                        <GuildBody />
                            
                        <div className={styles.panels}>
                            <img src={userData.avatarURL} />

                            <div className={styles.authAid}>
                                <h2>{userData.username}</h2>
                                <p>{userData.flags}#0000</p>
                            </div>
                            
                            <div className={styles.authIcons}>
                                <div onClick={() => {
                                        client.auth.signOut()
                                    }}>

                                    <LogOut size={18} strokeWidth={2}/>
                                </div>

                                <div onClick={() => {

                                    }}>
                                    <Settings size={18} strokeWidth={2}/>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.bannerBar}>
                        {
                            state.current_pannel.startsWith('svr') &&
                            <div>
                                <Hash size={18}/>
                                <h3>
                                    {
                                        guildState.current_channel?.name
                                    }
                                </h3>             
                            </div>
                        }
                    </div>
                    <div className={styles.mainContentBody}>
                        <div className={styles.contentBodyMessages}>
                            <div>
                                <GuildMessages />
                            </div>
                            <div>
                                <input type="text" />
                            </div>
                        </div>

                        <div className={styles.membersList}>
                            List of users here
                        </div>
                    </div>
                </div>
            </div>
        </GuildContext.Provider>
    )
}

export { GuildBase }