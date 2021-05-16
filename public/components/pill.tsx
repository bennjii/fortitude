
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '../../styles/Home.module.css'
import { useState } from 'react'

const Pill: React.FC<{ context: any }> = ({ context }) => {
    const [ pillContext, setPillContext ] = useState({
        hovered: false,
        active: false
    });


	return (
		<span className={styles.pill}></span>
	)
}

export { Pill }