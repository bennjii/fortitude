
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, ChevronLeft, ChevronRight, FilePlus, Image, Loader, Plus, X } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { emailFilter, mimifiedToFull, textCensor } from './helper'
import { UserIcon } from './user_icon'
import dayjs from 'dayjs'

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
				<div>
					<div className={styles.homeMessage}>
						<h1>Good { date.getHours() < 10 ? 'Morning' : date.getHours() < 14 ? 'Day' : (date.getHours() < 16 ? 'Afternoon' : (date.getHours() < 18 ? 'Evening' : 'Night'))}</h1> 
						
						<p>
							{ user.username }
						</p>
					</div>
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
            

			<div className={styles.homeCalender}>
				<div className={styles.homeCalenderHeader}>
					<div>
						<ChevronLeft size={18 }/>
						{
							(() => {
								const x = new Date()
								x.setMonth((date.getMonth() - 1) > 12 ? 1 : (date.getMonth() - 1 < 0) ? 12 : date.getMonth() - 1);

								return x.toLocaleString('default', { month: 'long' })
							})()
						}
					</div>

					<div>
						<h1>
							{
								date.toLocaleString('default', { month: 'long' }).toUpperCase()
							}
						</h1>

						<h6>
							{
								date.getFullYear()
							}
						</h6>
					</div>

					<div>
						{
							(() => {
								const x = new Date()
								x.setMonth((date.getMonth() + 1) > 12 ? 1 : (date.getMonth() + 1 < 0) ? 12 : date.getMonth() + 1);

								return x.toLocaleString('default', { month: 'long' })
							})()
						}
						<ChevronRight size={18 }/>
					</div>
				</div>

				<div>

				</div>

				<div>

				</div>
			</div>
        </div>
	)
}

export { HomeComponent }