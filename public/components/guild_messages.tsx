
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { Message, GuildContextType } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ClientContext, GuildContext } from '@public/@types/context';

const GuildMessages: React.FC<{}> = () => {
    const { client, state: clientState, callback: clientCallback } = useContext<ClientContextType>(ClientContext);
    const { guild, state: guildState, callback: guildCallback } = useContext<GuildContextType>(GuildContext)

    const [ placedListener, setPlacedListener ] = useState(false);

    const setGuildMessages = (new_messages) => {
        guildCallback({ ...guildState, current_messages: new_messages })
    }

    useEffect(() => {
        if(guildState.current_channel_id)
            client
                .from('channels')
                .select('*')
                .eq('id', guildState.current_channel_id)
                .then(e => {
                    setGuildMessages(e.data[0].messages)
                })
    }, [guildState.current_channel_id])

    useEffect(() => {
        if(guildState.current_channel == null) {
            setTimeout(() => setPlacedListener(false), 100);
            return null;
        }

        const userListener = client
            .from(`channels:id=eq.${guildState.current_channel_id}`) 
            .on('*', (payload) => {
                setGuildMessages(payload.new.messages)
                setPlacedListener(true);
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [placedListener])

    // if(guildState.current_channel == null) return <div> <p>Something went terribly wrong...</p> </div>
    if(guildState?.current_messages?.length == 0) return <div>  <div className={styles.newChannelMessage}>  <h2>Type away!</h2> <h3>Just begin typing to start chatting with friends</h3></div>  </div>

    return (
        <div>
            {
                guildState?.current_messages?.map((message: Message) => {
                    return (
                        <div className={styles.message}>
                            <img src={message.sender.avatarURL} alt="" className={styles.messageImage}/>
                            <div className={styles.messageHeaders}>
                                <span className={styles.messageUsername} style={{ color: '#CEC9E6' }}>
                                    {
                                        message.sender.username
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
                })
            }
        </div>
    )
}

export { GuildMessages }