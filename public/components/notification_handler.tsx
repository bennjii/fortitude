
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, FilePlus, Image, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState, FortitudeNotification, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { mimifiedToFull } from './helper'
import { UserIcon } from './user_icon'
import { KeyUI } from './ui_key'
import { KeyHandler } from '@public/@types/event'

const NotificationHandler: React.FC<{ keyHandlers: KeyHandler[], keyInteractions: any[] }> = ({ keyHandlers, keyInteractions }) => {
    const { client, user, state: clientState, callback: setClientState } = useContext<ClientContextType>(ClientContext);

    const [ localKeyHandlers, setKeyHandlers ] = useState(keyHandlers);
    const [ localKeyInteractions, setKeyInteractions ] = useState(keyHandlers);

    useEffect(() => {
        setKeyHandlers(keyHandlers)
    }, [keyHandlers])

    useEffect(() => {
        setKeyInteractions(keyInteractions)
    }, [keyInteractions])

    return (
        <div className={styles.notificationMenu}>
            {
                clientState.notifications.map((event: FortitudeNotification, index) => {
                    keyHandlers.push({
                        expected_key: clientState.settings.bindings.open_notification,
                        duration: event.duration,
                        fufil: () => {
                            console.log("Key Event Fufilled")
                            setClientState({ ...clientState, notifications: clientState.notifications.splice(index, 1) });

                            setClientState({ ...clientState, current_pannel: event.redirect });
                        }
                    })

                    console.log(`${event.duration / localKeyInteractions.find((e) => e.key == clientState.settings.bindings.open_notification)?.duration}%`);

                    return (
                        <div key={event.id} className={styles.notification}>
                            <div>
                                <div className={styles.notificationSender}>
                                    <UserIcon url={event.icon} />
                                </div>

                                <div>
                                    <h2>{event.origin}</h2>
                                    <p>{event.message}</p>
                                </div>
                            </div>
                            
                            <div className={styles.openLine}>
                                <div style={{ width: `${event.duration / localKeyInteractions.find((e) => e.key == clientState.settings.bindings.open_notification)?.duration}%`, backgroundColor: 'var(--color-primary)', height: '2px', position: 'absolute' }}>

                                </div>
                            </div>

                            <div>
                                <div>Hold <KeyUI binding={clientState.settings.bindings.open_notification}/> to open</div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export { NotificationHandler }