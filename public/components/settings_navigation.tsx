
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, FilePlus, Image, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';

const SettingsNavigation: React.FC<{}> = () => {
    const { client } = useContext<ClientContextType>(ClientContext)
    const { state, callback } = useContext<SettingsContextType>(SettingsContext);

	return (
        <div className={styles.settingsNavPannel}>
            <h1>Fortitude</h1>

            <h4>USER SETTINGS</h4>

                <SettingsNavigationElement name={"My Account"} />
                <SettingsNavigationElement name={"Privacy & Safety"} />
                <SettingsNavigationElement name={"Customisation"} />

            <hr />

            <h4>APP APPEARANCE</h4>
                <SettingsNavigationElement name={"Appearance"} />
                <SettingsNavigationElement name={"Theme"} />
                <SettingsNavigationElement name={"Accessibility"} />
                <SettingsNavigationElement name={"Text & Images"} />
                <SettingsNavigationElement name={"Voice & Video"} />
                <SettingsNavigationElement name={"Notifications"} />
                <SettingsNavigationElement name={"Keybinds"} />
                <SettingsNavigationElement name={"Language"} />
                <SettingsNavigationElement name={"Advanced"} />

            <hr />

            <h4>ACTIVITY SETTINGS</h4>
                <SettingsNavigationElement name={"Activity Status"} />
                <SettingsNavigationElement name={"Presence"} />

            <hr />

            <h4>ABOUT</h4>
                <SettingsNavigationElement name={"Change Log"} />
                <SettingsNavigationElement name={"Version"} />

                <div onClick={() => {  
                    client.auth.signOut();
                }} className={styles.settingsNavigationElement}>
                    <p
                        style={{
                            color: 'rgb(255 120 120)'
                        }}
                    >Log Out</p>
                </div>
        </div>
	)
}

export { SettingsNavigation }