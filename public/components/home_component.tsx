
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, FilePlus, Image, Loader, Plus, X } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { emailFilter, mimifiedToFull, textCensor } from './helper'
import { UserIcon } from './user_icon'

const HomeComponent: React.FC<{}> = () => {
    const { client, user, state, callback } = useContext<ClientContextType>(ClientContext)
    const [ date, setDate ] = useState(new Date());

    useEffect(() => {
        const repeat = () => {
            setDate(new Date());
            setTimeout(repeat, 100)
        }

        setTimeout(repeat, 100);
    }, [])

	return (
        <div className={styles.homeView}>
            <div>
                <h1>
                    Good { date.getHours() < 10 ? 'Morning' : date.getHours() < 14 ? 'Day' : (date.getHours() > 18 ? 'Evening' : 'Night')} { user.username }
                </h1>
            </div>

            <div className={styles.time}>
				<h1>
					{
						(state.settings.date_twenty_four_hour) ?
						date.getHours() 
						:
						date.getHours() > 12 ? date.getHours()-12 : date.getHours() 
					}
					:
					{ 
						(date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes() 
					}
				</h1>

				<div>
					<p>{date.toLocaleString('en-us', {  weekday: 'long', day: '2-digit', month: (state.settings.short_date) ? 'short' : 'long' }).toUpperCase()}</p>
				</div>
			</div>
        </div>
	)
}

export { HomeComponent }