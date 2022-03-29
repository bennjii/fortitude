
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { SettingsNavigationElement } from '@components/settings_navigation_element'

import { Check, ChevronLeft, ChevronRight, FilePlus, Image, Loader, Plus, X } from 'react-feather';
import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';
import { useUser } from '@components/user_management'

const DisplayFriendUser: React.FC<{ id: string }> = ({ id }) => {
    const user = useUser(id);

	return (
        <div className={styles.friend}>
			{
                user?.data?.username
            }
        </div>
	)
}

export { DisplayFriendUser }