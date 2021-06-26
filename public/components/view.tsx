import { ClientState, FortitudeNotification, Guild } from '@public/@types/client'
import { ClientContext } from '@public/@types/context'
import { supabase } from '@root/client'
import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'
import { AlertCircle, ChevronDown, Home, LogOut, Plus, Settings, Users } from 'react-feather'

import Button from './button'
import { CreateServerOverlay } from './create_server_overlay'
import { GuildBase } from './guild_base'
import { GuildNav } from './guild_navigator'
import { HomeNav } from './home_navigator'
import { NewServerNav } from './new_server_navigation'
import { SettingsOverlay } from './settings_overlay'
import { UserComponent } from './user_component'
import { HomeComponent } from './home_component'
import { UserIcon } from './user_icon'
import { KeyUI } from './ui_key'
import { NotificationHandler } from './notification_handler'
import { KeyHandler } from '@public/@types/event'
import { handleKeyEvents } from './helper'

const View: React.FC<{ client: SupabaseClient }> = ({ client }) => {
    const [ data, setData ] = useState(null);

    // The below code specifies a key handler queue wherein as events are listened to, they are parsed and fufilled by the listener
    const keyHandlers = [];
    const keyInteractions = [];

    if(process.browser) document.addEventListener("keydown", (e) => {
        handleKeyEvents(keyHandlers, keyInteractions, e, 'down');
    });

    if(process.browser) document.addEventListener("keyup", (e) => {
        handleKeyEvents(keyHandlers, keyInteractions, e, 'up');
    });

    if(process.browser) document.addEventListener("blur", (e) => {
        keyInteractions.length = 0;
    });

    const [ clientState, setClientState ] = useState<ClientState>({
        activeServer: '',
        activeDirectMessage: '',
        overlay: {
            createServer: false,
            settings: false
        },
        current_server: null,
        current_pannel: 'dm-home', // dm-home, dm-friends, [dm-dm, svr-svr] - loads from activeServer and activeDirectMessage
        settings: {
            date_twenty_four_hour: false,
            short_date: false,
            bindings: {
                open_notification: 'P',
                accept_call: 'A',
                decline_call: 'D'
            }
        },
        notifications: [
            // {
            //     message: 'New Calender Event: Sunday Meeting',
            //     origin: 'a template server',
            //     id: '19173619aca210ad',
            //     duration: 0,
            //     redirect: 'dm-home',
            //     action: 'open_notification',
            //     accept_message: 'Press [spc] to open',
            //     icon: "a689a2b8-fa66-4f1c-9cac-7b5c3d33be0a.jpg"
            // },
            
        ]
    });

    const recieveNotification = (notification: FortitudeNotification) => {
        setClientState({ ...clientState, notifications: [ ...clientState.notifications, notification ]})
    }

    const [ users, setUsers ] = useState([]);

    const context = {
        client: supabase,
        state: clientState,
        callback: setClientState,
        user: data,
        users,
        setUsers
    };
    
    useEffect(() => {
        const userListener = client
            .from(`users:id=eq.${client.auth.user().id}`) // :id=eq.${client.auth.user().id}
            .on('*', (payload) => {
                setData(payload.new)
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [])

    useEffect(() => {
        client
            .from('users')
            .select('*')
            .eq('id', client.auth.user().id)
            .then(e => {
                setData(e.data[0]); // I mean they should be the first user right????
            });
    }, [])
    
    if(data)
        return (
            <ClientContext.Provider value={context} >
                <NotificationHandler keyHandlers={keyHandlers} keyInteractions={keyInteractions} />

                <div className={styles.client} >
                    <div className={styles.context}>
                        {
                            (clientState.overlay.createServer) &&
                            <CreateServerOverlay />
                        }

                        {
                            (clientState.overlay.settings) &&
                            <SettingsOverlay />
                        }

                        <div className={styles.navigationSideBar}>
                            <HomeNav />

                            <hr />

                            <div className={styles.nagigationGuildsList}>
                                {
                                    data.servers?.map((server: Guild) => {
                                        return <GuildNav data={server} key={server.id}/>
                                    })
                                }
                            </div>
                            
                            <NewServerNav />
                        </div>
                        
                        {
                            clientState.current_pannel.startsWith('svr') ?
                            <GuildBase userData={data} />
                            :
                            <div className={styles.base}>
                                <div className={styles.sideBar}>
                                    <div className={styles.sideBarContainer}>  
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
                                                        data.friends.map((e, i) => {
                                                            return (
                                                                <div key={`friend-${i}`}>
                                                                    {JSON.parse(e)}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <UserComponent userData={data}/>
                                    </div>
                                </div>

                                <div className={styles.container}>
                                    <div className={styles.bannerBar}>
                                        {
                                            clientState.current_pannel == "dm-home" &&
                                            <div className={styles.dmHome}>
                                                <Home size={20} strokeWidth={2} opacity={0.6}/>
                                                <br />
                                                <h3>Home</h3>
                                            </div>
                                        }

                                        {
                                            clientState.current_pannel == "dm-friends" && 
                                            <div className={styles.dmFriends}>
                                                <Users size={20} strokeWidth={2} opacity={0.6} />
                                                <br />
                                                <h3>Friends</h3>

                                                
                                            </div>
                                        }
                                    </div>

                                    <div>
                                        {
                                            clientState.current_pannel == 'dm-home' ?
                                            <div style={{ height: '100%' }}>
                                                <HomeComponent />
                                            </div>
                                            :
                                            <div>
                                                <Button title={"Send Notification"} onClick={() => {
                                                    recieveNotification(
                                                        {
                                                            message: 'someone is calling you',
                                                            origin: 'someone',
                                                            id: 'aw19c7a-asnalcc',
                                                            duration: 1000,
                                                            redirect: 'dm-home',
                                                            action: 'accept_call',
                                                            accept_message: 'Hold [spc] to accept',
                                                            icon: "a689a2b8-fa66-4f1c-9cac-7b5c3d33be0a.jpg"
                                                        }
                                                    )
                                                }}/>

                                                <Button title={"Update Users"} onClick={() => {
                                                    setUsers(users);
                                                }}/>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                                   
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