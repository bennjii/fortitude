
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState } from '@public/@types/client';

const HomeNav: React.FC<{ callback: Function, state: ClientState }> = ({ callback, state }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active: (state.current_pannel.startsWith('dm'))
    });

    useEffect(() => {
        setItemState({ ...itemState, active: (state.current_pannel.startsWith('dm')) });
    }, [state])

	return (
		<div 
            className={
                (itemState.active) ? styles.navigationElementActive : (itemState.hovered) ? styles.navigationElementHovered : styles.navigationElement
            }
            onClick={() => {
                setItemState({ ...itemState, active: true });
                if(!itemState.active) callback({ ...state, current_pannel: 'dm-home' })
            }}
            onMouseOver={() => setItemState({ ...itemState, hovered: true })}
            onMouseLeave={() => setItemState({ ...itemState, hovered: false })}
        >
            <Pill context={itemState} />
            <div className={(itemState.active) ? styles.navigationSideBarHomeActive : (itemState.hovered) ? styles.navigationSideBarHomeActive : styles.navigationSideBarHome} id={"navhome"}>
                <h1>F</h1>
            </div>
        </div>
	)
}

export { HomeNav }