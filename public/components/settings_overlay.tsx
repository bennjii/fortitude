
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { AlertCircle, Check, FilePlus, Image, Loader, Plus, RefreshCcw } from 'react-feather';
import { ClientContextType, ClientState } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';

import clientStyles from '@styles/Home.module.css'

import { SettingsNavigation } from './settings_navigation'
import { SettingsContent } from './settings_content'

const SettingsOverlay: React.FC<{}> = () => {
    const { client, state, callback } = useContext<ClientContextType>(ClientContext);

    const [ settingState, setSettingState ] = useState({
        current_pannel: "my-account",
        settings: state.settings,
        status_message: {
            open: false,
            message: 'Processing Changes',
            type: "loading"
        }
    });

	return (
		<div className={styles.overlay} style={{ backgroundColor: 'var(--background-primary)' }} onClick={(e) => {
            //@ts-expect-error
            if(e.target.classList.contains(clientStyles.overlay)) callback({ ...state, overlay: { ...state.overlay, settings: false }});
        }} onKeyPress={(event) => {
            console.log(event);
        }} >
            <SettingsContext.Provider value={{ state: settingState, callback: setSettingState }}>
                <div className={styles.settingsOverlayParent}>
                    <div className={styles.settingsNavigation}>
                        <SettingsNavigation />
                    </div>
                    
                    <SettingsContent />
                </div>


                {
                    settingState.status_message.open ?
                    <div className={`${styles.overlayStatus} ${styles[settingState.status_message.type + "_sett"]}`}>
                        <div>
                            {
                                (() => {
                                    switch(settingState.status_message.type) {
                                        case "loading":
                                            return <div className={styles.loadingSpin}>
                                                <RefreshCcw size={13}/>
                                            </div>
                                        case "success":
                                            return <div>
                                                <Check size={13} className={styles.loadingNoSpin}/>
                                            </div>
                                        case "failure":
                                            return <div>
                                                <AlertCircle size={13} className={styles.loadingNoSpin}/>
                                            </div>
                                    }
                                })()
                            }
                            
                            <p>{settingState.status_message.message}</p>
                        </div>
                        
                    </div>
                    :
                    <></>
                }
                
            </SettingsContext.Provider>
        </div>
	)
}

export { SettingsOverlay }