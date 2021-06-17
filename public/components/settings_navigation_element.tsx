
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { Check, FilePlus, Image, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';

const SettingsNavigationElement: React.FC<{ name: string }> = ({ name }) => {
    const { state, callback } = useContext<SettingsContextType>(SettingsContext);

    const short_name = name.toLowerCase().replace(/\s/g, '-');

    // const full_variation = short_name.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

	return (
        <div onClick={() => {  
            callback({ ...state, current_pannel: short_name})
        }} className={styles.settingsNavigationElement}>
            <p>{name}</p>
        </div>
	)
}

export { SettingsNavigationElement }