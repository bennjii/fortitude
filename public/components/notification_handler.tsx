
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, FilePlus, Image, Loader, Plus, Repeat } from 'react-feather';
import { ClientContextType, ClientState, FortitudeNotification, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { addNotification, mimifiedToFull } from './helper'
import { UserIcon } from './user_icon'
import { KeyUI } from './ui_key'
import { KeyHandler } from '@public/@types/event'

const NotificationHandler: React.FC<{ keyHandlers: KeyHandler[], keyInteractions: { key: string, date: number }[] }> = ({ keyHandlers, keyInteractions }) => {
    const { client, user, state: clientState, callback: setClientState } = useContext<ClientContextType>(ClientContext);

    const [ localKeyHandlers, setKeyHandlers ] = useState(keyHandlers);
    const [ localKeyInteractions, setKeyInteractions ] = useState(keyInteractions);

    const [ date, setDate ] = useState(new Date().getTime())
    
    useEffect(() => {
        if(keyHandlers.length > 0) repeat;
    }, [keyHandlers])
    
    useEffect(() => {
        setKeyHandlers(keyHandlers)
    }, [keyHandlers])

    useEffect(() => {
        setKeyInteractions(keyInteractions)
    }, [keyInteractions])

    const repeat = setTimeout(() => {
        setDate(new Date().getTime());

        if(keyHandlers.length > 0)
            return setTimeout(repeat, 50);
    }, 50)

    if(localKeyHandlers.length > 0) repeat;
    else clearTimeout(repeat);

    return (
        <div className={styles.notificationMenu}>
            {
                clientState.notifications.map((event: FortitudeNotification, index) => {
                    addNotification(keyHandlers, {
                        expected_key: clientState.settings.bindings[event.action],
                        duration: event.duration,
                        fufil: () => {
                            console.log("Key Event Fufilled")
                            // setClientState({ ...clientState, notifications: clientState.notifications.splice(index, 1) });
                            if(event.duration <= 10) setClientState({ ...clientState, notifications: clientState.notifications.splice(index, 1) })

                            setClientState({ ...clientState, current_pannel: event.redirect });
                        }
                    });

                    const found_key = localKeyInteractions.find((e: { date: number, key: string}) => {
                        return (e?.key?.toLowerCase() == clientState.settings.bindings[event.action]?.toLowerCase()) ? e : null
                    });

                    if(((date - found_key?.date) / event.duration) > 0.99) {
                        setClientState({ ...clientState, notifications: clientState.notifications.splice(index, 1) });
                    }

                    return (
                        <div 
                            key={event.id} 
                            className={`${styles.notification} ${((date - found_key?.date) / event.duration) > 0.99 ? styles.notificationEnded : ''}`} 
                            style={{ marginTop: `${index * 2}%`, opacity: `${(index + 1) / clientState.notifications.length}` }}
                            onAnimationIteration={(e) => {
                                if(e.animationName.includes('begone')) {
                                    // setTimeout(setClientState({ ...clientState, notifications: clientState.notifications.splice(index, 1) }), 250);
                                }
                            }}
                        >
                            <div>
                                <div className={styles.notificationSender}>
                                    <UserIcon user_id={event.id} />
                                </div>

                                <div>
                                    <h2>{event.origin}</h2>
                                    <p>{event.message}</p>
                                </div>
                            </div>

                            {
                                event.duration > 0 ?
                                <div className={styles.openLine}>
                                    <div style={{ width: `${((date - found_key?.date) / event.duration) ? ((date - found_key?.date) / event.duration) * 100 : 0}%`, backgroundColor: 'var(--color-primary)', height: '3px', position: 'absolute' }}>

                                    </div>
                                </div>
                                :
                                <></>
                            }

                            <div>
                                <div>
                                    {
                                        event.accept_message.split("[spc]")[0]
                                    }

                                    <KeyUI binding={clientState.settings.bindings[event.action]} held={found_key == null}/>
                                    
                                    {   
                                        event.accept_message.split("[spc]")[1]
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export { NotificationHandler }