
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
            <img src={`https://sqhegzswatflhwibycub.supabase.co/storage/v1/object/sign/server-icons/${data}.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDk3MTQyMywiZXhwIjoxOTM2NTQ3NDIzfQ.t8fg-7qVZDKbUK2ML93XOZWPlyMridksN1PfGz49_4o`} alt="" />
        </div>
	)
}

export { GuildNav }