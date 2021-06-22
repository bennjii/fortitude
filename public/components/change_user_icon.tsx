
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { Message, GuildContextType, Channel } from '@public/@types/client'

import { ClientContextType, ClientState } from '@public/@types/client';
import { ClientContext, GuildContext } from '@public/@types/context';
import { UserIcon } from './user_icon';

const ChangeUserIcon: React.FC<{}> = () => {
    const { client, state: clientState, callback: clientCallback, user } = useContext<ClientContextType>(ClientContext);

    const input = useRef<HTMLInputElement>();

    const [ itemState, setItemState ] = useState({
        hovered: false,
        image: user.avatarURL
    });

    const [ imageDrop, setImageDrop ] = useState({
        dragOver: false,
        droped: false,
        file: null,
        uploading: false,
        uploaded: false
    });

    useEffect(() => {
        if(imageDrop.file)
            setItemState({
                ...itemState,
                image: URL.createObjectURL(imageDrop.file?.target.files.item(0))
            });
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

            <UserIcon url={itemState.image}/>

            <div style={{ display: itemState.hovered ? "flex" : "none" }} className={styles.iconOverlay}>
                <h4>CHANGE ICON</h4>
            </div>
        </div>
    )
}

export { ChangeUserIcon }