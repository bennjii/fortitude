import { useEffect, useState } from 'react' 
import { Check, RefreshCw, MoreVertical, UserCheck, X, Link } from 'react-feather'
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
    const [ link, setLink ] = useState(null);
    const [ reqServer, setReqServer ] = useState(null);

    const router = useRouter();
    const CODE = (router.query.code) ? router.query.code : null;

    const { code } = router.query;

    const [ cssProperties, setCssProperties ] = useState({
		"--color-primary": "rgb(88, 101, 242)",
		"--color-primary-rgb": "88, 101, 242"
	})

    useEffect(() => {
        console.log(supabase.auth.session())
        if(!supabase.auth.session()) router.push("../")

        const userListener = supabase
            .from(`users:id=eq.${supabase.auth.user().id}`)
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
        if(!supabase.auth.session()) router.push("../")

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
        if(!supabase.auth.session()) router.push("../")

    }, [, data])
    
    useEffect(() => {
        if(!supabase.auth.session()) router.push("../")
        console.log(CODE);
        
        supabase
            .from('invite_links')
            .select('*')
            .eq('link', CODE)
            .then(link => {
                if(link.data.length == 0) return;

                setLink(link.data[0])
                
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
    }, [CODE])

    const date_formatted = (new_date) => {
        const seconds = Math.floor(((new Date(new_date).getTime() - new Date().getTime()) / 1000));
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if(days >= 1) return `${days} ${days > 1 ? "days" : "day"}`;
        if(hours >= 1) return `${hours} ${hours > 1 ? "hours" : "hour"}`;
        if(minutes >= 1) return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
        if(seconds >= 1) return `${seconds} ${seconds > 1 ? "seconds" : "second"}`;
    }

    return (
        <div className={clientStyles.page} 
        //@ts-expect-error
        style={cssProperties}>
            <div className={styles.auth}>
                <div className={styles.authServerInviteBox}>
                    <div className={styles.authLeft}>
                        {
                            (authState == 'show') ?
                            reqServer ?
                            <div className={styles.authLoginAlt}>
                                <div className={styles.inviteIcons}>
                                    <img src={data?.icon} alt="" />

                                    <div className={styles.inviteIconLinkers}>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>

                                    <img src={reqServer?.icon} alt="" />
                                </div>

                                <div className={styles.inviteText}>
                                    <h1>{reqServer?.name}</h1>
                                    <h6>has invited you to join them!</h6>

                                    <p>Signed in as <b>{data?.username}</b><i>#{data?.tag ? data?.tag : "0000"}</i> <a onClick={() => {
                                        supabase.auth.signOut();
                                        router.push("../");
                                    }}>Not you?</a></p>
                                </div>

                                <hr />

                                <div className={styles.access}>
                                    <h2>This will allow access to</h2>
                                    <div>
                                        <div className={styles.approvedCheck}>
                                            <Check size={18} color={"var(--text-normal)"}/>
                                        </div>
                                        <p>Your avatar and username</p>
                                    </div>
                                    
                                    <div>
                                        <div className={styles.approvedCheck}>
                                            <Check size={18} color={"var(--text-normal)"}/>
                                        </div>
                                        <p>Send you messages</p>
                                    </div>
                                    
                                    <div>
                                        <div className={styles.deniedCross}>
                                            <X size={18} color={"var(--text-normal)"}/>
                                        </div>
                                        <p>Your shower thoughts</p>
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    <Link size={13} color={"var(--text-muted)"}/>
                                    <p>This link is valid for {date_formatted(link.expiry_date)}</p>
                                </div>
                            </div>
                            :
                            <div>
                                loading
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
                                    <h1>what</h1>
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div className={styles.authBottom}>
                        <Button title={authState == 'show' ? "Cancel" : 'Back'} onClick={(event, callback) => {
                            if(authState == 'show') {
                                router.push("../");
                            }else if(authState == 'accepted') {
                                setAuthState('show');
                                callback();
                            }
                        }}></Button>

                        <Button title={authState == 'show' ? "Continue" : 'Authenticate'} onClick={(event, callback) => {
                            if(authState == 'show') {
                                setAuthState('accepted');
                                callback();
                            }else if(authState == 'accepted') {
                                //...
                            }
                        }}></Button>
                    </div>
                </div> 

                <div>{"\t"}</div>
            </div>
        </div>
    )
}