import { useEffect, useState } from 'react' 
import { Check, RefreshCw, MoreVertical, UserCheck, X, Link, Clock, Lock } from 'react-feather'
import Button from '@components/button'
import Input from '@components/input'

import clientStyles from '@styles/Home.module.css'
import styles from '@styles/Auth.module.css'
import { useRouter } from 'next/router';
import { supabase } from '@root/client'
import { useUser } from '@components/user_management'
import { AuthCode } from '@components/auth_code'
import dayjs from 'dayjs'
import { useRef } from 'react'

import Image from 'next/image'

export default function Invite() {
    const [ authState, setAuthState ] = useState('show'); // show | accepted | redirecting
    
    const [ data, setData ] = useState(null);
    const [ link, setLink ] = useState(null);
    const [ reqServer, setReqServer ] = useState(null);

    const router = useRouter();
    const CODE = (router.query.code) ? router.query.code : null;

    const [ copied, setCopied ] = useState(false);

    const continue_button = useRef();

    const { code } = router.query;

    const [ cssProperties, setCssProperties ] = useState({
		"--color-primary": "rgb(88, 101, 242)",
		"--color-primary-rgb": "88, 101, 242"
	});

    useEffect(() => {
        if(!supabase.auth.session()) {
            router.push({ pathname: '/', search: `redir=/invite/${CODE}`});
            return;
        }

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
    }, [CODE])
    
    useEffect(() => {
        supabase
            .from('invite_links')
            .select('*')
            .eq('link', CODE)
            .then(link => {
                if(link.data.length == 0) return;

                setLink(link.data[0]);

                var res = 'show'

                if((new Date(link.data[0].expiry_date).getTime() - new Date().getTime()) < 0) {
                    console.log("The link is expired!")
                    res = ('expired')
                }
                
                supabase
                    .from('guilds')
                    .select("*")
                    .eq('id', link.data[0].guild)
                    .then(guild => { 
                        supabase
                            .storage
                            .from('server-icons')
                            .createSignedUrl(guild.data[0].iconURL, 12800)
                            .then(icon => { 
                                setReqServer({ ...guild.data[0], icon: icon.signedURL });

                                if(guild.data[0].members.includes(supabase.auth?.user()?.id)) {
                                    if(res !== 'expired') res = ('existing')
                                }

                                setAuthState(res);
                            })  
                    })   
            });
    }, [CODE])

    const date_formatted = (new_date) => {
        if(Math.floor(((new Date(new_date).getTime() - new Date().getTime()) / 1000)) < 0) return false;
        const seconds = Math.floor(((new Date(new_date).getTime() - new Date().getTime()) / 1000));
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if(days >= 1) return `${days} ${days > 1 ? "days" : "day"}`;
        if(hours >= 1) return `${hours} ${hours > 1 ? "hours" : "hour"}`;
        if(minutes >= 1) return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
        if(seconds >= 1) return `${seconds} ${seconds > 1 ? "seconds" : "second"}`;
    }

    const codeSubmission = (code, callback) => {
        const ref = link.code.toLowerCase();
        const comp = code.toLowerCase();

        if(ref == comp) {
            //@ts-expect-error
            continue_button.current?.click()
            callback(true);
        }else {
            callback(false)
        }
    }

    return (
        <div className={clientStyles.page} 
        //@ts-expect-error
        style={cssProperties}>
            <div className={styles.auth}>
                <div className={styles.authServerInviteBox} style={{  minHeight: authState == 'existing' || 'expired' ? "500px" : authState == 'accepted' ? "625px" : "625px"}}>
                    <div className={styles.authLeft} >
                        {
                            (authState == 'expired') ?
                            <div className={styles.authLoginAlt}>
                                <div className={styles.inviteIcons}>
                                    <img src={data?.icon} alt="" />

                                    <div className={styles.inviteIconLinkerFailed}>
                                        <div></div>
                                        <X size={18} color={"var(--text-negative)"}/>
                                        <div></div>
                                    </div>

                                    <img src={reqServer?.icon} alt="" />
                                </div>

                                <div className={styles.inviteText}>
                                    <h1>Well, this is awkward</h1>
                                    <h6>this link to <b>{reqServer?.name.trim()}</b> has expired!</h6>

                                    <p>Signed in as <b>{data?.username}</b><i>#{data?.tag ? data?.tag : "0000"}</i> <a onClick={() => {
                                        supabase.auth.signOut();
                                        router.push({ pathname: '/', search: `redir=/invite/${code}`});
                                    }}>Not you?</a></p>
                                </div>

                                <hr />

                                <div>
                                    <div>
                                        <Link size={13} color={"var(--text-muted)"}/>
                                        <p>{date_formatted(link.expiry_date) ? `This link is valid for ${date_formatted(link.expiry_date)}` : `This link is invalid`}</p>
                                    </div>
                                    <div>
                                        <Clock size={13} color={"var(--text-muted)"}/>
                                        <p>Server active since {dayjs(new Date(reqServer.creation_date)).format("d MMM YYYY")}</p>
                                    </div>
                                </div>
                            </div>
                            :
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
                                        router.push({ pathname: '/', search: `redir=/invite/${code}`});
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
                                    <div>
                                        <Link size={13} color={"var(--text-muted)"}/>
                                        <p>This link is valid for {date_formatted(link.expiry_date)}</p>
                                    </div>
                                    <div>
                                        <Clock size={13} color={"var(--text-muted)"}/>
                                        <p>Server active since {dayjs(new Date(reqServer.creation_date)).format("d MMM YYYY")}</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className={styles.loadingDiv}>
                                <div className={styles.inviteIconLinkers}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            :
                            (authState !== "accepted") ?
                            <div className={styles.authLoginAlt}>
                                <div className={styles.inviteIcons}>
                                    <img src={data?.icon} alt="" />

                                    <div className={styles.inviteIconLinkerFailed}>
                                        <div></div>
                                        <X size={18} color={"var(--text-negative)"}/>
                                        <div></div>
                                    </div>

                                    <img src={reqServer?.icon} alt="" />
                                </div>

                                <div className={styles.inviteText}>
                                    <h1>Well, this is awkward</h1>
                                    <h6>you are already a part of <b>{reqServer?.name.trim()}</b>!</h6>

                                    <p>Signed in as <b>{data?.username}</b><i>#{data?.tag ? data?.tag : "0000"}</i> <a onClick={() => {
                                        supabase.auth.signOut();
                                        router.push({ pathname: '/', search: `redir=/invite/${code}`});
                                    }}>Not you?</a></p>
                                </div>

                                <hr />

                                <div>
                                    <h2>Send it to someone else</h2>
                                    <div className={styles.overlayLinkForwarder} onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        setCopied(true);
                                    }} onMouseLeave={() => setCopied(false)}>
                                        <p>{window.location.href}</p>
                                        <span className={styles.tooltip}>{copied ? `Copied` : "Click to Copy"}</span>
                                    </div>
                                    <p style={{ margin: 0 }}>Belive this to be an issue? <a href="">Report it</a></p>
                                </div>

                                <hr />

                                <div>
                                    <div>
                                        <Link size={13} color={"var(--text-muted)"}/>
                                        <p>This link is valid for {date_formatted(link.expiry_date)}</p>
                                    </div>
                                    <div>
                                        <Clock size={13} color={"var(--text-muted)"}/>
                                        <p>Server active since {dayjs(new Date(reqServer.creation_date)).format("d MMM YYYY")}</p>
                                    </div>
                                </div>
                            </div>
                            :
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
                                        router.push({ pathname: '/', search: `redir=/invite/${code}`});
                                    }}>Not you?</a></p>
                                </div>

                                <hr />
                                    
                                <div>
                                    <h2>This link is protected</h2>

                                    <div className={styles.inviteText} style={{ justifyContent: 'flex-start' }}>
                                        <p className={styles.verifText}>Please enter the code to continue  <a onClick={() => {
                                            supabase.auth.signOut();
                                            router.push("../");
                                        }}>Don't have one?</a></p>
                                    </div>

                                    <br />

                                    <AuthCode submissionCallback={codeSubmission}/>
                                </div>
                                
                                <hr />

                                <div>
                                    <div>
                                        <Lock size={13} color={"var(--text-muted)"}/>
                                        <p>Password Protected Link</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div className={styles.authBottom}>
                        <Button title={authState == 'show' ? "Cancel" : 'Back'} onClick={(event, callback) => {
                            if(authState == 'show' || authState == 'existing' || authState == 'expired') {
                                router.push("../");
                            }else if(authState == 'accepted') {
                                setAuthState('show');
                                callback();
                            }
                        }} ></Button>

                        <Button title={authState == 'show' ? "Continue" : 'Join'} disabled={authState == "existing" || authState == 'expired'} onClick={(event, callback) => {
                            if(authState == 'show') {
                                setTimeout(() => {
                                    setAuthState('accepted');
                                    callback();
                                }, 500)
                                
                            }else if(authState == 'accepted') {
                                const d = new Date().getTime();
                                supabase
                                    .from('guilds')
                                    .select()
                                    .eq('id', reqServer.id)
                                    .then(guild_response => {
                                        console.log(guild_response);

                                        supabase
                                            .from('guilds')
                                            .update([
                                                {
                                                    members: [ ...guild_response.data[0].members, data.id ]
                                                }
                                            ])
                                            .eq('id', reqServer.id)
                                            .then(_ => {
                                                supabase
                                                    .from('users')
                                                    .update([
                                                        {
                                                            servers: data.servers ? [ ...data.servers, reqServer.id ] : [ reqServer.id ]
                                                        }
                                                    ])
                                                    .eq('id', data.id)
                                                    .then(_ => {
                                                        const comp = new Date().getTime();

                                                        console.log(comp - d);

                                                        if(comp - d < 1000)
                                                            setTimeout(() => {
                                                                callback();
                                                                router.push("../")
                                                            }, 1000 - (comp - d))
                                                        else {
                                                            callback();
                                                            router.push("../")
                                                        }  
                                                    })
                                            })
                                            
                                    })
                            }
                        }} ref={continue_button}></Button>
                    </div>
                </div> 

                <div>{"\t"}</div>
            </div>
        </div>
    )
}