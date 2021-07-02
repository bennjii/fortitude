import { useEffect, useState } from 'react' 
import { Check, RefreshCw, MoreVertical } from 'react-feather'
import Button from '@components/button'
import Input from '@components/input'

import clientStyles from '@styles/Home.module.css'
import styles from '@styles/Auth.module.css'
import { useRouter } from 'next/router';
import { supabase } from '@root/client'
import { useUser } from '@components/user_management'

export default function Invite() {
    const [ authState, setAuthState ] = useState('show'); // show | accepted | redirecting
    
    const [ data, setData ] = useState(null);
    const [ reqServer, setReqServer ] = useState(null);

    const router = useRouter();
    const CODE = (router.query.code) ? router.query.code : null;

    useEffect(() => {
        const userListener = supabase
            .from(`users:id=eq.${supabase.auth.user().id}`) // :id=eq.${client.auth.user().id}
            .on('*', (payload) => {
                supabase
                    .storage
                    .from('user-icons')
                    .createSignedUrl(payload.new.avatarURL, 12800)
                    .then(icon => { 
                        setData({ ...payload.new, icon: icon.signedURL })
                    })   
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [])

    useEffect(() => {
        supabase
            .from('users')
            .select('*')
            .eq('id', supabase.auth.user().id)
            .then(e => {
                supabase
                    .storage
                    .from('user-icons')
                    .createSignedUrl(e.data[0].avatarURL, 12800)
                    .then(icon => { 
                        setData({ ...e.data[0], icon: icon.signedURL });
                    })   
            });
    }, [])

    useEffect(() => {
        supabase
            .from('invite_links')
            .select('*')
            .eq('link', CODE)
            .then(link => {
                if(link.data.length == 0) return;
                
                supabase
                    .from('guilds')
                    .select("*")
                    .eq('id', link.data[0].guild)
                    .then(guild => { 
                        console.log(guild);

                        supabase
                            .storage
                            .from('server-icons')
                            .createSignedUrl(guild.data[0].iconURL, 12800)
                            .then(icon => { 
                                setReqServer({ ...guild.data[0], icon: icon.signedURL });
                            })  
                    })   
            });
    }, [])

    return (
        <div className={clientStyles.page}>
            <div className={styles.auth}>
                <div className={styles.authBox}>
                    <div className={styles.authLeft}>
                        {
                            (authState == 'show') ?
                            <div className={styles.authLogin}>
                                <div>
                                    <h2>You've been invited!</h2>
                                    <h3><strong>{reqServer?.name}</strong> wants you to join thier server</h3>
                                </div>

                                <div className={styles.inviteIcons}>
                                    <img src={data?.icon} alt="" />

                                    <img src={reqServer?.icon} alt="" />
                                </div>

                                <div>
                                    <Button title={"Accept"} onClick={() => {
                                        // add them
                                    }}/>
                                    <p>Don't want to join? <a href="#" onClick={() => setAuthState('redirecting')}>Go Back</a></p> 
                                </div>
                            </div>
                            :
                            (authState !== "accepted") ?
                            <div className={styles.authLogin}>
                                <div>
                                    <h2>Redirecting...</h2>
                                    <h3>We're so excited to see you!</h3>
                                </div>
                                
                                <div className={styles.authInput}>
                                    <h4>Redirecting...</h4>
                                </div>
                            </div>
                            :
                            <div className={styles.authLogin}>
                                <div>
                                    <h2>Accepted!</h2>
                                    <h3>We're so excited to see you!</h3>
                                </div>
                                
                                <div className={styles.authSuccess}>
                                    <div className={styles.authSuccessCircle}>
                                        <Check color={"white"} size={64}/>
                                    </div>
                                    
                                    <div>
                                        <h1>Success</h1>
                                        <h3>Please verify your email</h3>
                                    </div>
                                    
                                </div>

                                <div>
                                    <p>Havent recieved an email? <a href="#" onClick={() => setAuthState('auth-login')}>Re-send</a></p> 
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div className={styles.authRight}>
                        {
                            //fetch(` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${client.auth.session().provider_token}`)
                        }
                    </div>
                </div> 

                <div>{"\t"}</div>
            </div>
        </div>
    )
}
