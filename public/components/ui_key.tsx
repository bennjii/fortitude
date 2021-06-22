
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

const KeyUI: React.FC<{ binding: string }> = ({ binding }) => {
    const { client, user } = useContext<ClientContextType>(ClientContext)

    const [ keybind, setKey ] = useState(binding);

    useEffect(() => {
        setKey(binding);
    }, [binding])

    return (
        <div className={styles.key_ui}>
            {
                keybind
            }
        </div>
    )
}

export { KeyUI }