
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { Message, GuildContextType, Channel, SettingsContextType } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ClientContext, GuildContext, SettingsContext } from '@public/@types/context';
import { UserIcon } from './user_icon';

import uuidv4 from 'uuid'

const ChangeUserIcon: React.FC<{}> = () => {
    const { client, state: clientState, callback: clientCallback, user } = useContext<ClientContextType>(ClientContext);
    const { state: settingsState, callback: settingsCallback } = useContext<SettingsContextType>(SettingsContext)
    const input = useRef<HTMLInputElement>();
    
    // useEffect(() => {
    //     setItemState({ ...itemState })
    // }, [user])

    const [ itemState, setItemState ] = useState({
        hovered: false
    });

    const [ imageDrop, setImageDrop ] = useState({
        dragOver: false,
        droped: false,
        file: null,
        uploading: false,
        uploaded: false
    });

    useEffect(() => {
        if(imageDrop.file) {
            const image_name = `${user.id}-${(Math.random() * 1000).toString().replace('.', '')}.jpg`;

            clientCallback({  
                ...clientState, 
                status_message: {
                    open: true,
                    message: 'Uploading Icon',
                    type: 'loading'
                } 
            })

            client
                .storage
                .from('user-icons')
                .remove([user.avatarURL])
                .then(e => {
                    client
                        .storage
                        .from('user-icons')
                        .upload(image_name, imageDrop.file?.target.files.item(0))
                        .then(e => {
                            client
                                .from('users')
                                .update([
                                    {
                                        avatarURL: image_name
                                    }
                                ])
                                .eq('id', user.id)
                                .then(e => {
                                    clientCallback({  
                                        ...clientState, 
                                        status_message: {
                                            open: true,
                                            message: 'Uploaded',
                                            type: "success"
                                        } 
                                    });
        
                                    setTimeout(() => {
                                        clientCallback({  
                                            ...clientState, 
                                            status_message: {
                                                open: false,
                                                message: 'Uploaded',
                                                type: "success"
                                            } 
                                        });
                                    }, 5000)
                                })
                        })
                        .catch(e => {
                            console.error(e)
                        })
                })
                .catch(e => {
                    console.error(e)
                })
        }
            
    }, [imageDrop]);

    return (
        <div 
            className={styles.changeIcon}
            onMouseOver={() => {
                setItemState({ ...itemState, hovered: true })
            }}
            onMouseLeave={() => {
                setItemState({ ...itemState, hovered: false })
            }}
            onDragOver={() => {setImageDrop({...imageDrop, dragOver: true})}}
            onDrop={() => {setImageDrop({...imageDrop, droped: true})}}
            onClick={() => {input.current.click()}}
        >
            <input 
                type="file" 
                hidden={true} 
                onChange={(e) => setImageDrop({...imageDrop, file: e, uploading: true})} 
                ref={input}
            />

            <UserIcon user_id={user.id} />

            <div style={{ display: itemState.hovered ? "flex" : "none" }} className={styles.iconOverlay}>
                <h4>CHANGE <br />ICON</h4>
            </div>
        </div>
    )
}

export { ChangeUserIcon }