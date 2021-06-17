
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

const SettingsContent: React.FC<{}> = () => {
    const { client, user } = useContext<ClientContextType>(ClientContext)
    const { state, callback } = useContext<SettingsContextType>(SettingsContext);

	return (
        <div className={styles.settingsContentPannel}>
            <h1>
                {
                    mimifiedToFull(state.current_pannel)
                }
            </h1>

            {
                (() => {
                    switch(state.current_pannel) {
                        case 'my-account':  
                            return (
                                <div>
                                    <div className={styles.userSettingsContainer}>
                                        {
                                            user.username
                                        }
                                    </div>
                                </div>
                            )

                        default: 
                            return (
                                <div>
                                    <p>It appears an error has occured.</p>
                                </div>
                            )
                    }
                })()
            }
        </div>
	)
}

export { SettingsContent }