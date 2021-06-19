
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, FilePlus, Image, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { mimifiedToFull } from './helper'

const UserIcon: React.FC<{ url: string }> = ({ url }) => {
    const { client, user } = useContext<ClientContextType>(ClientContext)
    const { state, callback } = useContext<SettingsContextType>(SettingsContext);

    console.log(user.avatarURL && user.avatarURL !== 'null');

    if(user.avatarURL && user.avatarURL !== 'null')
        return (
            <img src={user.avatarURL && './public/user_icon.png'} alt="" />                   
        )
    else 
        return  (
            <div className={styles.userDefaultIcon}>
                
            </div>
        )
}

export { UserIcon }