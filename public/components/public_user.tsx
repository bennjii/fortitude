import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import { ClientContextType, ClientState } from '@public/@types/client'
import { ClientContext } from '@public/@types/context';

import { useUser } from './user_management'
import { UserImageBanner } from './user_image_banner'
import { UserIcon } from './user_icon'
import { Award } from 'react-feather';

const PublicUser: React.FC<{ user_id: string }> = ({ user_id }) => {
    const { client, state, callback } = useContext<ClientContextType>(ClientContext);
    const user = useUser(user_id);

	return (
		<div className={styles.userPublicView}>
            <div>
                <UserImageBanner user_id={user_id}  />
            </div>

            <div className={styles.publicViewIconPannel}>
                <div className={styles.userPublicIcon}>
                    <div className={styles.userIconWrapper}>
                        <UserIcon user_id={user_id}/>
                    </div>
                </div>
            </div>
        
            <div className={styles.publicViewIconPannelFlags}>
                <div className={styles.adminFlag}>
                    <Award size={13}/>

                    Admin
                </div>
            </div>

            <div className={styles.publicUserContentHeader}>
                <h3>
                    {
                        user?.data?.username
                    }
                </h3>
                
                <p>
                    #{
                        user?.data?.tag
                    }
                </p>
            </div>

            <div className={styles.userPublicStatus}>
                <p>physics :{"<"}</p>
            </div>

            <div className={styles.userPublicStatus}>
                <h4>ABOUT ME</h4>
                <p>Idk man, kinda pog</p>


            </div>
        </div>
	)
}

export { PublicUser }