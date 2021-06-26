
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import { ClientContext, GuildContext } from '@public/@types/context';
import { useUser } from './user_management'

const ListUser: React.FC<{ user_id }> = ({ user_id }) => {
    const { users } = useContext(ClientContext);
    const user = useUser(user_id);

    useEffect(() => {
        console.log("USERS WERE UPDATED!", users)
    }, [users])

    if(user)
        return (
            <div className={styles.divisionalUser}>
                <div>
                    <div>
                        <img src={user.data?.icon} alt="" />
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