
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
import { GuildMessage } from './guild_message'

const GuildMessages: React.FC<{}> = () => {
    const { client, state: clientState, callback: clientCallback } = useContext<ClientContextType>(ClientContext);
    const { guild, state: guildState, callback: guildCallback } = useContext<GuildContextType>(GuildContext)

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
        const userListener = client
            .from(`channels:id=eq.${guildState.current_channel_id}`) 
            .on('*', (payload) => {
                console.log("Messages were updated!")
                setGuildMessages(payload.new.messages)
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [])

    // if(guildState.current_channel == null) return <div> <p>Something went terribly wrong...</p> </div>
    if(guildState?.current_messages?.length == 0) return <div>  <div className={styles.newChannelMessage}>  <h2>Type away!</h2> <h3>Just begin typing to start chatting with friends</h3></div>  </div>

    const isContinued = (index) => {
        const prev_author = index > 0 ? guildState.current_messages[index - 1] : null;

        if(!prev_author) return 'normal'

        if(guildState.current_messages[index].sender.id == prev_author.sender.id) {
            return 'continued'
        }else {
            return 'normal'
        }
    }

    return (
        <div>
            {
                guildState?.current_messages?.map((message: Message, index: number) => {
                    return (
                        <GuildMessage message={message} type={isContinued(index)} key={message.send_date.toString()} />
                    )
                })
            }
        </div>
    )
}

export { GuildMessages }