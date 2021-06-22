
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

    const [ imageURL, setImageURL ] = useState(url);

    useEffect(() => {
        setImageURL(url);
    }, [url])

    if(url && url !== 'null')
        return (
            <img src={imageURL ?? './public/user_icon.png'} alt="" className={styles.imageIconUser}/>                   
        )
    else 
        return  (
            <div className={styles.userDefaultIcon}>
                
            </div>
        )
}

export { UserIcon }