
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, FilePlus, Image, Loader, Plus, User, X } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { emailFilter, mimifiedToFull, textCensor } from './helper'
import { UserIcon } from './user_icon'
import { ChangeUserIcon } from './change_user_icon'
import { useUser } from './user_management'

const SettingsContent: React.FC<{}> = () => {
    const { client, user, state: SettingsState, callback: SettingsVisiblityCallback } = useContext<ClientContextType>(ClientContext)
    const { state, callback } = useContext<SettingsContextType>(SettingsContext);

    const [ userState, setUserState ] = useState(user);

    useEffect(() => {
        setUserState(user);
    }, [user])

	return (
        <div className={styles.settingsContentPannel}>
            <div>
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
                                            <div className={styles.userImageBanner}>
                                                {
                                                    userState?.icon ? 
                                                    <img src={userState?.icon} alt="" />
                                                    :
                                                    <div className={styles.newUserBanner}>

                                                    </div>
                                                }
                                                
                                            </div>

                                            <div className={styles.userSettingsPublicItems}>
                                                <div className={styles.userIconWrapper}>
                                                    <ChangeUserIcon />
                                                </div>
                                                
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

                                                    <div className={styles.editButton} onClick={() => {
                                                        alert("Dont u dare")
                                                    }}>
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

                                                    <div className={styles.editButton}>
                                                        Edit
                                                    </div>
                                                </div>

                                                <div>
                                                    <div>
                                                        <h4>PASSWORD</h4>
                                                        
                                                        <div>
                                                            <p>{textCensor(user.created_at)}</p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.editButton}>
                                                        Edit
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr />

                                        <div>
                                            <h4>ACCOUNT REMOVAL</h4>
                                            <p>Careful! By removing your account, you cannot recover it</p>
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
            

            <div className={styles.leaveObject} onClick={() => {
                SettingsVisiblityCallback({ ...SettingsState, overlay: { ...SettingsState.overlay, settings: false }});
            }}>
                <div>
                    <X size={18} color={"var(--text-normal)"} />
                </div>
                <p>ESC</p>
            </div>
        </div>
	)
}

export { SettingsContent }