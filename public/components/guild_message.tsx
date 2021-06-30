
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { Message, GuildContextType } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ClientContext, GuildContext } from '@public/@types/context';
import { UserIcon } from './user_icon'
import { useUser } from './user_management'
import { PublicUser } from './public_user'

const GuildMessage: React.FC<{ message: Message, type: string }> = ({ message, type }) => {
    const { users } = useContext(ClientContext);
    const user = useUser(message.sender.id);

    const [ userClicked, setUserClicked ] = useState(false);

    useEffect(() => {
        console.log("USERS WERE UPDATED!", users)
    }, [users])

    if(type == 'normal')
        return (
            <div className={styles.message}>
                <div className={styles.messageImage}>
                    {/* <img src={user?.data?.icon} alt="" /> */}
                    <UserIcon user_id={message?.sender?.id} onClick={() => {
                        setUserClicked(!userClicked);
                    }}/> 
                </div>

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
                
                
                <div>
                    {
                        userClicked ?
                        <PublicUser user_id={message?.sender?.id}/>
                        :
                        <></>
                    }
                </div>

                <div className={styles.messageHeaders}>
                    <span className={styles.messageUsername} style={{ color: '#CEC9E6' }} onClick={() => {
                        setUserClicked(!userClicked);
                    }}>
                        {
                            user?.data?.username
                        }
                    </span>

                    <span className={styles.messageDate}>
                        {
                            dayjs(new Date(message.send_date)).from(new Date())
                        }
                    </span>
                </div>
                
                <div className={styles.messageContent} style={{ color: message.unsent ? '#00f0f0' : ''}} key={Math.random() * 10000}>
                    {
                        message.content
                    }
                </div>
            </div>
        )
    else if(type == 'continued' )
        return (
            <div className={`${styles.message} ${styles.messageContinued}`}>
                <div className={styles.messageContent} style={{ color: message.unsent ? '#00f0f0' : ''}} key={Math.random() * 10000}>
                    {
                        message.content
                    }
                </div>
            </div>
        )
    else 
        return (
            <div className={styles.message}>
                <div className={styles.messageImage}>
                    {/* <img src={user?.data?.icon} alt="" /> */}
                    <UserIcon user_id={message?.sender?.id} /> 
                </div>
                <div className={styles.messageHeaders}>
                    <span className={styles.messageUsername} style={{ color: '#CEC9E6' }}>
                        {
                            user?.data?.username
                        }
                    </span>

                    <span className={styles.messageDate}>
                        {
                            dayjs(new Date(message.send_date)).from(new Date())
                        }
                    </span>
                </div>
                
                <div className={styles.messageContent} style={{ color: message.unsent ? '#00f0f0' : ''}} key={Math.random() * 10000}>
                    {
                        message.content
                    }
                </div>
            </div>
        )
}

export { GuildMessage }