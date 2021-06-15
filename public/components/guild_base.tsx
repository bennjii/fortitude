
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
import { FortitudeSend } from './fortitude_send';

const GuildBase: React.FC<{ userData: User }> = ({ userData }) => {
    const { client, state, callback } = useContext<ClientContextType>(ClientContext);

    const [ guildData, setGuildData ] = useState<Guild>(state.current_server.data);
    const [ initialFetch, setInitialFetch ] = useState(true);

    const [ guildState, setGuildState ] = useState({
        current_channel: null,
        current_channel_id: '',
        channels: [],
        current_messages: []
    });

    useEffect(() => {
        console.log(state.current_server.id, guildData.id);

        if(state.current_server.id !== guildData.id || initialFetch) {
            setInitialFetch(false);
            
            client
                .from('guilds')
                .select(`
                    id,
                    name,
                    iconURL,
                    members,
                    roles,
                    channels
                `)
                .eq('id', state.current_server.id)
                .then(async _data => {
                    setGuildState({ 
                        ...guildState, 
                        current_channel_id: _data?.data[0]?.channels[0], 
                        current_channel: null 
                    })
                
                    await _data.data[0].channels.forEach(e => {
                        client
                            .from('channels')
                            .select(`
                                name,
                                type,
                                id
                            `)
                            .eq('id', e)
                            .then(cha => {
                                console.log(guildState.channels);
                                console.log(cha.data);
                                
                                let clonable_state = guildState;

                                if(cha.data[0].id == _data?.data[0]?.channels[0])  clonable_state.current_channel = cha.data[0];
                                setGuildState({ ...guildState, channels: [...guildState.channels, cha.data[0]] });

                                // Something keeps removing the channel!!! WTFF
                            })
                    });

                    setGuildData(_data?.data[0]);
                })
        }
    }, [state]);

    useEffect(() => {
        if(state.current_server.id !== guildData.id) {
            const userListener = client
                .from(`guilds:id=eq.${state.current_server.id}`) 
                .on('*', (payload) => {
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
                            <div className={styles.contentMessageParent}>
                                <GuildMessages />
                            </div>

                            <FortitudeSend />
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