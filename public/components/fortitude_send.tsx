
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { Message, GuildContextType, Channel } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ClientContext, GuildContext } from '@public/@types/context';

const FortitudeSend: React.FC<{}> = () => {
    const { client, state: clientState, callback: clientCallback, user } = useContext<ClientContextType>(ClientContext);
    const { guild, state: guildState, callback: guildCallback } = useContext<GuildContextType>(GuildContext)

    const input = useRef<HTMLInputElement>();

    return (
        <div className={styles.guildGontentInput}>
            <div>
                <input type="text" ref={input}
                    placeholder={`message #${guildState.channels.find((channel: Channel) => channel.id == guildState.current_channel_id)?.name}`} 
                    onChange={(e) => {
                        //... suggestions etc.
                    }}
                    onKeyPress={(e) => {
                        if(e.code == "Enter") {
                            const raw_message_content = input.current.value;
                            
                            const message: Message = {
                                sender: user,
                                content: raw_message_content,
                                attatchments: [],
                                send_date: new Date(),
                                unsent: true
                            };

                            guildCallback({  ...guildState, current_messages: [ ...guildState.current_messages, message ]})

                            sender('/api/send_message', guildState.current_channel_id, { ...message, unsent: false }, (updated_data) => {
                                guildCallback({ ...guildState, current_messages: updated_data.messages })
                            });
                            input.current.value = ''
                        }
                    }}
                    />
            </div>
            
            <p>xyz is typing...</p>

        </div>
    )
}

const sender = (url, channel, message, callback) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', channel, message: JSON.stringify(message) }),
    credentials: 'same-origin',
  }).then(async (res) => { 
    callback(await res.json())
  })

export { FortitudeSend }