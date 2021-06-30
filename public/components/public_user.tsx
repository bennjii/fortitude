
import { SupabaseClient } from '@supabase/supabase-js'
import clientStyles from '@styles/Home.module.css'
import styles from '@styles/Auth.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { Check, FilePlus, Image, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState } from '@public/@types/client'
import { ClientContext } from '@public/@types/context';

import Svg from "@public/dashed_border"
import { Loading } from '@supabase/ui'
import { supabase } from '@root/client'

import { v4 as uuidv4 } from 'uuid';
import { useUser } from './user_management'
import { UserImageBanner } from './user_image_banner'
import { UserIcon } from './user_icon'

const PublicUser: React.FC<{ user_id: string }> = ({ user_id }) => {
    const { client, state, callback } = useContext<ClientContextType>(ClientContext);
    const user = useUser(user_id);

	return (
		<div className={styles.userPublicView}>
            <div>
                <UserImageBanner user_id={user_id}  />
            </div>

            <div>
                <UserIcon user_id={user_id}/>

                {
                    user?.data?.username
                }
            </div>
        </div>
	)
}

export { PublicUser }