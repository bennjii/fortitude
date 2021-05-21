import { ClientContext } from '@public/@types/context'
import { supabase } from '@root/client'
import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'
import { ChevronDown, Home, LogOut, Plus, Settings, Users } from 'react-feather'

import Button from './button'
import { CreateServerOverlay } from './create_server_overlay'
import { GuildBody } from './guild_body'
import { ServerChannels } from './guild_channels'
import { GuildNav } from './guild_navigator'
import { HomeNav } from './home_navigator'
import { NewServerNav } from './new_server_navigation'

const View: React.FC<{ client: SupabaseClient }> = ({ client }) => {
    const [ data, setData ] = useState(null);
    const [ clientState, setClientState ] = useState({
        activeServer: '',
        activeDirectMessage: '',
        overlay: {
            createServer: false,
            settings: false
        },
        current_server: null,
        current_pannel: 'dm-home' // dm-home, dm-friends, [dm-dm, svr-svr] - loads from activeServer and activeDirectMessage
    });

    const context = {
        client: supabase,
        state: clientState,
        callback: setClientState
    };
    
    useEffect(() => {
        const userListener = client
            .from(`users:id=eq.${client.auth.user().id}`) // :id=eq.${client.auth.user().id}
            .on('*', (payload) => {
                console.log(payload);
                setData(payload.new)
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [])

    useEffect(() => {
        (async () => {
            await client
                .from('users')
                .select('*')
                .eq('id', client.auth.user().id)
            .then(e => {
                setData(e.data[0]); // I mean they should be the first user right????
            })
        })();
    }, []);
    
    if(data)
        return (
            <ClientContext.Provider value={context}>
                <div className={styles.client}>
                    <div className={styles.context}>
                        {
                            (clientState.overlay.createServer) &&
                            <CreateServerOverlay />
                        }

                        <div className={styles.navigationSideBar}>
                            <HomeNav />

                            <hr />

                            <div className={styles.nagigationGuildsList}>
                                {
                                    data.servers.map(e => {
                                        return <GuildNav data={e} key={e.id} />
                                    })
                                }
                            </div>
                            
                            <NewServerNav />    
                        </div>

                        <div className={styles.base}>
                            <div className={styles.sideBar}>
                                
                                <div className={styles.sideBarContainer}>
                                    {
                                        (clientState.current_pannel.startsWith('dm'))
                                        ?
                                            <div className={styles.searchMenuParent}>
                                                <div className={styles.searchMenu}>
                                                    <div className={styles.search}>
                                                        <div>
                                                            Find or start a conversation
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.scroll}>
                                                    <div className={styles.DMscroll}>
                                                        <div className={(clientState.current_pannel == 'dm-home') ? styles.menuSwitcherActive : styles.menuSwitcher} onClick={() => {
                                                            setClientState({ ...clientState, current_pannel: 'dm-home' });
                                                        }}>
                                                            <Home size={24} />
                                                            <h3>Home</h3>
                                                        </div>

                                                        <div className={(clientState.current_pannel == 'dm-friends') ? styles.menuSwitcherActive : styles.menuSwitcher} onClick={() => {
                                                            setClientState({ ...clientState, current_pannel: 'dm-friends' });
                                                        }}>
                                                            <Users size={24} />
                                                            <h3>Friends</h3>
                                                        </div>

                                                        <br />

                                                        <div className={styles.directMessageDivider}><h4>DIRECT MESSAGES</h4><Plus size={18}/></div>
                                                        {
                                                            data.friends.map(e => {
                                                                return (
                                                                    <div>
                                                                        {JSON.parse(e)}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        :
                                            <GuildBody />
                                        }
                                    <div className={styles.panels}>
                                        <img src={data.avatarURL} />

                                        <div className={styles.authAid}>
                                            <h2>{data.username}</h2>
                                            <p>{data.flags}#0000</p>
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
                                        clientState.current_pannel == "dm-home" &&
                                        <div>
                                            <Home size={20} strokeWidth={2} opacity={0.6}/>
                                            <h3>Home</h3>
                                        </div>
                                    }

                                    {
                                        clientState.current_pannel == "dm-friends" && 
                                        <div>
                                            <Users size={20} strokeWidth={2} opacity={0.6} />
                                            <h3>Friends</h3>
                                        </div>
                                    }
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>          
            </ClientContext.Provider>
        )
    else 
        return (
            <div>
                loading thingy
            </div>
        )
}

export { View }