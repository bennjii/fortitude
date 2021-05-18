import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Home, LogOut, Plus, Settings, Users } from 'react-feather'

import Button from './button'
import { CreateServerOverlay } from './create_server_overlay'
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
        current_pannel: 'dm-home' // dm-home, dm-friends, [dm-dm, svr-svr] - loads from activeServer and activeDirectMessage
    });

    useEffect(() => {
        (async () => {
            await client
                .from('users')
                .select('*')
                .eq('id', client.auth.user().id)
                // .on('UPDATE', payload => {
                //     console.log('Change received!', payload)
                // })
                // .subscribe()
            .then(e => {
                setData(e.data[0]); // I mean they should be the first user right????
            })
        })();
    }, []);
    
    if(data)
        return (
            <div className={styles.client}>
                <div className={styles.context}>
                    {
                        (clientState.overlay.createServer) &&
                        <CreateServerOverlay client={client} callback={setClientState} state={clientState}/>
                    }

                    <div className={styles.navigationSideBar}>
                        <HomeNav callback={setClientState} state={clientState}/>

                        <hr />

                        {
                            data.servers.map(e => {
                                return <GuildNav data={e} key={e.id} />
                            })
                        }

                        <NewServerNav callback={setClientState} state={clientState}/>    
                    </div>

                    <div className={styles.base}>
                        <div className={styles.sideBar}>
                            
                            <div className={styles.sideBarContainer}>
                                <div className={styles.searchMenu}>
                                    <div className={styles.search}>
                                        <div>
                                            Find or start a conversation
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.scroll}>
                                    {/* SERVER */}
                                    {/* ... */}
        
                                    {/* DM */}
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
        )
    else 
        return (
            <div>
                loading thingy
            </div>
        )
}

export { View }