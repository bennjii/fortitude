
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
            className={`${styles.guildChannel} ${active && styles.guildChannelSelected}`} 
            onMouseOver={() => { setChannelState({ ...channelState, hovered: true }) }}
            onMouseLeave={() => { setChannelState({ ...channelState, hovered: false }) }}
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
                <UserPlus size={14} />
            </div>
        </div>
	)
}

export { ServerChannelNavigation }