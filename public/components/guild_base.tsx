
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { Channel, Guild, User } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ChevronDown, Hash, Home, LogOut, Settings, Users } from 'react-feather';
import { ServerChannels } from './guild_channels';
import { ClientContext, GuildContext } from '@public/@types/context';
import { GuildBody } from './guild_body';
import { GuildMessages } from './guild_messages';
import { FortitudeSend } from './fortitude_send';

import Head from 'next/head'
import { UserComponent } from './user_component';

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
                .select(`*`)
                .eq('id', state.current_server.id)
                .then(async _data => {
                    const _channels = [];
                    let _current_channel;
                
                    await _data.data[0].channels.forEach(e => {
                        client
                            .from('channels')
                            .select(`*`)
                            .eq('id', e)
                            .then(cha => {
                                if(cha.data[0].id == _data?.data[0]?.channels[0]) {
                                    _current_channel = cha.data[0];
                                    console.log(cha.data[0]);
                                }

                                // setGuildState({ ...guildState, channels: [...guildState.channels, cha.data[0]] });
                                _channels.push(cha.data[0]);

                                setGuildState({ 
                                    ...guildState, 
                                    current_channel_id: _data?.data[0]?.channels[0], 
                                    current_channel: _current_channel,
                                    channels: _channels
                                });
                            })
                    });

                    setGuildState({ 
                        ...guildState, 
                        current_channel_id: _data?.data[0]?.channels[0], 
                        current_channel: _current_channel,
                        channels: _channels
                    });

                    console.log(_current_channel)

                    setGuildData(_data?.data[0]);
                })
        }
    }, [state]);

    useEffect(() => {
        console.log("SOMETHING CHANGED THE STATE TO", state);
        
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
                        <Head>
                            <title>
                                { guildState.channels.find((channel: Channel) => channel.id == guildState.current_channel_id)?.name }
                            </title>
                        </Head>
                        <GuildBody />
                            
                        <UserComponent userData={userData}/>
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
                                        guildState.channels.find((channel: Channel) => channel.id == guildState.current_channel_id)?.name
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