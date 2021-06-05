
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState, Guild } from '@public/@types/client';
import { Hash, UserPlus, Volume2 } from 'react-feather';

const ServerChannelNavigation: React.FC<{ active: boolean, data: any, callback: Function }> = ({ active, data, callback }) => {
    const [ channelState, setChannelState ] = useState({
        hovered: false,
        active,
    });

    useEffect(() => {
        setChannelState({ ...channelState, active });
    }, [active])

	return (
        <div 
            className={`${styles.guildChannel} ${styles.guildChannelSelected}`} 
            onMouseOver={() => { setChannelState({ ...channelState, hovered: channelState.active ? false : true }) }}
            onMouseLeave={() => { setChannelState({ ...channelState, hovered: channelState.active ? false : false }) }}
            onClick={() => {
                callback();
            }}
        >
            <div className={styles.guildChannelEmbeddedContent}>
                {
                    data.type == 'text' ?
                    <Hash size={16} color={'var(--text-muted)'}/>
                    :
                    <Volume2 size={18} />
                }
                
                <p>
                    {
                        data.name
                    }
                </p>
            </div>  

            <div className={styles.guildChannelEmbeddedContentSide} hidden={!channelState.hovered}>
                <UserPlus size={16} />
            </div>
        </div>
	)
}

export { ServerChannelNavigation }