
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState, Guild } from '@public/@types/client';
import { Hash, UserPlus, Volume2 } from 'react-feather';

const ServerChannelNavigation: React.FC<{ data: any, state: object, callback: Function }> = ({ data, state, callback }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active: false,
        image_url: null
    });

	return (
        <div className={styles.guildChannel} 
        onMouseOver={() => { setItemState({ ...itemState, hovered: true }) }}
        onMouseLeave={() => { setItemState({ ...itemState, hovered: false }) }}
        onClick={callback({ ...state, active_channel: data.id })}
        >
            <div className={styles.guildChannelEmbeddedContent}>
                {
                    data.type == 'text' ?
                    <Hash size={16} />
                    :
                    <Volume2 size={18} />
                }
                
                <p>
                    {
                        data.name
                    }
                </p>
            </div>  

            <div className={styles.guildChannelEmbeddedContentSide} hidden={!itemState.hovered}>
                <UserPlus size={16} />
            </div>
        </div>
	)
}

export { ServerChannelNavigation }