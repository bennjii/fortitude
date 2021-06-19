
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { Check, FilePlus, Image, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';

import clientStyles from '@styles/Home.module.css'

import { SettingsNavigation } from './settings_navigation'
import { SettingsContent } from './settings_content'

const SettingsOverlay: React.FC<{}> = () => {
    const { client, state, callback } = useContext<ClientContextType>(ClientContext);

    const [ settingState, setSettingState ] = useState({
        current_pannel: "my-account",
        settings: {

        }
    });

	return (
		<div className={styles.overlay} style={{ backgroundColor: 'var(--background-primary)' }} onClick={(e) => {
            //@ts-expect-error
            if(e.target.classList.contains(clientStyles.overlay)) callback({ ...state, overlay: { ...state.overlay, settings: false }});
        }}>
            <SettingsContext.Provider value={{ state: settingState, callback: setSettingState }}>
                <div className={styles.settingsOverlayParent}>
                    <div className={styles.settingsNavigation}>
                        <SettingsNavigation />
                    </div>
                    
                    <SettingsContent />
                </div>
            </SettingsContext.Provider>
        </div>
	)
}

export { SettingsOverlay }