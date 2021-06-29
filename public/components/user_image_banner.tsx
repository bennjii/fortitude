import styles from '../../styles/Home.module.css'
import { useUser } from './user_management';

const UserImageBanner: React.FC<{ user_id: string }> = ({ user_id }) => {
    const user = useUser(user_id);
    
	return (
        <div className={styles.userImageBanner}>
            {
                user?.data?.banner ? 
                <img src={user?.data?.banner} alt="" />
                :
                <div className={styles.newUserBanner}>

                </div>
            }
            
        </div>
	)
}

export { UserImageBanner }