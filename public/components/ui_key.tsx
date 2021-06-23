
import styles from '@styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import { ClientContextType, ClientState, SettingsContextType } from '@public/@types/client'
import { ClientContext, SettingsContext } from '@public/@types/context';

const KeyUI: React.FC<{ binding: string, held: boolean }> = ({ binding, held }) => {
    const { client, user } = useContext<ClientContextType>(ClientContext)

    const [ keybind, setKey ] = useState(binding);
    const [ buttonHeld, setButtonHeld ] = useState(held);

    useEffect(() => {
        setKey(binding);
    }, [binding])

    useEffect(() => {
        setButtonHeld(held);
    }, [held])

    console.log(buttonHeld);

    return (
        <div 
            className={styles.key_ui} 
            style={{ boxShadow: buttonHeld ? '0px 3px rgba(var(--color-primary-rgb), 0.5)' : '0px 1px rgba(var(--color-primary-rgb), 0.5)', transform: buttonHeld ? 'translateY(-2px)' : '', color: 'white' }}
        >
            {
                keybind
            }
        </div>
    )
}

export { KeyUI }