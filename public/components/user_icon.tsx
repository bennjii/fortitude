import styles from '@styles/Home.module.css'
import { useUser } from './user_management'

const UserIcon: React.FC<{ user_id: string }> = ({ user_id }) => {
    if(!user_id) 
        return  (
            <div className={styles.userDefaultIcon}>
                
            </div>
        )

    const user = useUser(user_id);
    const userClick = () => {

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
                    <img src={`${user.data.icon}&d=${new Date().getTime()}` ?? './public/user_icon.png'} alt={user.data.username} onClick={userClick} className={styles.imageIconUser}/>                   
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