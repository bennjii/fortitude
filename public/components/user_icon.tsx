import styles from '@styles/Home.module.css'
import { useUser } from './user_management'

const UserIcon: React.FC<{ user_id: string, onClick?: Function }> = ({ user_id, onClick }) => {
    if(!user_id) 
        return  (
            <div className={styles.userDefaultIcon}>
                
            </div>
        )

    const user = useUser(user_id);
    const userClick = () => {
        if(onClick) onClick();
    }

    // return  (
    //     <div className={styles.userDefaultIcon} onClick={userClick}>
    //         { JSON.stringify(user.data) }
    //     </div>
    // )

    if(user)
        if(user.data)
            if(user.data.icon)
                return (
                    <img src={user.data.icon ?? './public/user_icon.png'} alt={user.data.username} onClick={() => userClick()} className={styles.imageIconUser}/>                   
                )
            else 
                return  (
                    <div className={styles.userDefaultIcon} onClick={userClick}>
                        
                    </div>
                )
        else 
            return  (
                <div className={styles.userDefaultIcon} onClick={userClick}>
                    
                </div>
            )
    else 
        return  (
            <div className={styles.userDefaultIcon} onClick={userClick}>
                
            </div>
        )
}

export { UserIcon }