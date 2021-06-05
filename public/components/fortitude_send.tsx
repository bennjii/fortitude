
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { Message, GuildContextType } from '@public/@types/client'

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
                    placeholder={`message #${guildState.current_channel?.name}`} 
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
                                send_date: new Date()
                            };

                            client.from('')
                        }
                    }}
                    />
            </div>
            
            <p>xyz is typing...</p>

        </div>
    )
}

export { FortitudeSend }