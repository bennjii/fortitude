
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, ChevronLeft, ChevronRight, FilePlus, Image, Loader, Plus, X } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { emailFilter, mimifiedToFull, textCensor } from './helper'
import { UserIcon } from './user_icon'
import dayjs from 'dayjs'

import { DisplayFriendUser } from './display_friend_user'

const FriendList: React.FC<{}> = () => {
    const { client, user, state, callback } = useContext<ClientContextType>(ClientContext)

	return (
        <div className={styles.friendView}>
			<h4>FRIENDS</h4>

            {
                user.friends.map(e => {
                    <DisplayFriendUser id={e.uid}/>
                })
            }
        </div>
	)
}

export { FriendList }