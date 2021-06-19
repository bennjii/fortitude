
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, FilePlus, Image, Loader, Plus, X } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { emailFilter, mimifiedToFull } from './helper'
import { UserIcon } from './user_icon'

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
                                        <div>
                                            <UserIcon url={user.avatarURL}/>

                                            <div className={styles.userSettingsUserName}>
                                                <div>
                                                    <h3>
                                                        {
                                                            user.username
                                                        }
                                                    </h3>

                                                    <p>
                                                        #{
                                                            user.tag
                                                        }
                                                    </p>
                                                </div>
                                                
                                                <div>
                                                    {
                                                        user.flags
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.changeUserSettings}>
                                            <div>
                                                <div>
                                                    <h4>USERNAME</h4>

                                                    <div>
                                                        <p>{user.username}</p>
                                                        <p>#{user.tag}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    Edit
                                                </div>
                                            </div>

                                            <div>
                                                <div>
                                                    <h4>EMAIL</h4>
                                                    
                                                    <div>
                                                        <p>{emailFilter(client.auth.user().email)}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
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

            <div className={styles.leaveObject}>
                <div><X /></div>
                ESC
            </div>
        </div>
	)
}

export { SettingsContent }