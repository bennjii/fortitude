
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { Check, FilePlus, Image, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { fullToMimified } from './helper'

const SettingsNavigationElement: React.FC<{ name: string }> = ({ name }) => {
    const { state, callback } = useContext<SettingsContextType>(SettingsContext);

    const [ itemState, setItemState ] = useState({
        active: (state.current_pannel == name)
    });

    useEffect(() => {
        setItemState({ ...itemState, active: (state.current_pannel == fullToMimified(name)) })
    }, [name, state]);

    const short_name = fullToMimified(name);

    // const full_variation = short_name.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

	return (
        <div onClick={() => {  
            callback({ ...state, current_pannel: short_name })
        }} 
        className={`${styles.settingsNavigationElement} ${itemState.active ?
            styles.settingsNavActive
            :
            styles.settingsNavInactive
        }`
            

        }
        >
            <p>{name}</p>
        </div>
	)
}

export { SettingsNavigationElement }