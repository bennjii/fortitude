
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useState } from 'react'
import { Pill } from './pill';

const GuildNav: React.FC<{ data: any }> = ({ data }) => {
    const [ itemContext, setItemContext ] = useState({
        hovered: false,
        active: false
    });

	return (
		<div>
            <Pill context={itemContext} />
            <img src="" alt="" />
        </div>
	)
}

export { GuildNav }