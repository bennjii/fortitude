
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';

import { Users } from 'react-feather';

import { DisplayFriendUser } from './display_friend_user'

const FriendNavigator: React.FC<{}> = () => {
    const { client, user, state, callback } = useContext<ClientContextType>(ClientContext);
    

	return (
        <div className={styles.dmFriends}>
            <div>
                <Users size={20} strokeWidth={2} opacity={0.6} />
                <br />

                <h3>Friends</h3>
            </div>
            
            <hr />

            <div className={state.current_pannel == 'dm-friends-o' && styles.selected} onClick={() => callback({ ...state, current_pannel: 'dm-friends-o' })}>
                Online
            </div>

            <div className={state.current_pannel == 'dm-friends-a' && styles.selected} onClick={() => callback({ ...state, current_pannel: 'dm-friends-a' })}>
                All
            </div>

            <div className={state.current_pannel == 'dm-friends-p' && styles.selected} onClick={() => callback({ ...state, current_pannel: 'dm-friends-p' })}>
                Pendings
            </div>

            <div className={state.current_pannel == 'dm-friends-b' && styles.selected} onClick={() => callback({ ...state, current_pannel: 'dm-friends-b' })}>
                Blocked
            </div>

            <div className={state.current_pannel == 'dm-friends-add' && styles.selected} onClick={() => callback({ ...state, current_pannel: 'dm-friends-add' })}>
                Add Friend
            </div>
        </div>
	)
}

export { FriendNavigator }