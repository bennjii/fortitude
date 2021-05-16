
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Pill } from './pill';
import { ClientState } from '@public/@types/client';

import { Plus } from 'react-feather'

const NewServerNav: React.FC<{ callback: Function, state: ClientState }> = ({ callback, state }) => {
    const [ itemState, setItemState ] = useState({
        hovered: false,
        active: false
    });

    useEffect(() => {
        setItemState({ ...itemState, active: (state.current_pannel == ('svr-create')) });
    }, [state])

	return (
		<div 
            className={
                (itemState.active) ? styles.navigationElementActive : (itemState.hovered) ? styles.navigationElementHovered : styles.navigationElement
            }
            onClick={() => {
                setItemState({ ...itemState, active: true });
                if(!itemState.active) callback({ ...state, current_pannel: 'svr-create' })
            }} 
            onMouseOver={() => setItemState({ ...itemState, hovered: true })}
            onMouseLeave={() => setItemState({ ...itemState, hovered: false })}
        >
            <Pill context={itemState} />
            <div 
                className={styles.navigationSideBarHome} 
                id={"navhome"}
                style={{ backgroundColor: "transparent", border: '2px dashed rgba(var(--color-primary-rgb), 0.3)' }}
            >
                <Plus size={32} color={"rgba(var(--color-primary-rgb), 1)"}/>
            </div>
        </div>
	)
}

export { NewServerNav }