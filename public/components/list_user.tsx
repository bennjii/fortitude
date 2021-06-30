
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { ClientContext, GuildContext } from '@public/@types/context';
import { useUser } from './user_management'
import { UserIcon } from './user_icon';
import { PublicUser } from './public_user';

const ListUser: React.FC<{ user_id }> = ({ user_id }) => {
    const { users } = useContext(ClientContext);
    const user = useUser(user_id);

    const [ userClicked, setUserClicked ] = useState(false);

    if(user)
        return (
            <div className={styles.divisionalUser} onClick={() => {
                setUserClicked(!userClicked)
            }}>
                {
                    userClicked ?
                    <div onClick={() => {
                            setUserClicked(!userClicked);
                        }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, userSelect: 'none'  }}
                        >

                    </div>
                    :
                    <></>
                }

                {
                    userClicked ?
                    <PublicUser user_id={user?.data?.id}/>
                    :
                    <> </>
                }

                <div>
                    <div>
                        <UserIcon user_id={user.data?.id}/>
                    </div>

                    <div>
                        <span>{ user.data?.username }</span>
                        {
                            user.data?.presence?.status && <p>{ user.data?.presence?.status }</p>
                        }
                        
                    </div>
                </div>
            </div>
        )

    else return <></>
}

export { ListUser }