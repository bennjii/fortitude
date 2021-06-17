
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { Message, GuildContextType, User } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ClientContext, GuildContext } from '@public/@types/context';
import { LogOut, Settings } from 'react-feather'

const UserComponent: React.FC<{ userData: User }> = ({ userData }) => {
    const { client, state: clientState, callback: clientCallback } = useContext<ClientContextType>(ClientContext);

    return (
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
                        clientCallback({ ...clientState, overlay: { ...clientState.overlay, settings: !clientState.overlay.settings }});
                    }}>
                    <Settings size={18} strokeWidth={2}/>
                </div>
            </div>
            
        </div>
    )
}

export { UserComponent }