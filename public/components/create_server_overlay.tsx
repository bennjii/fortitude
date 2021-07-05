
import { SupabaseClient } from '@supabase/supabase-js'
import clientStyles from '@styles/Home.module.css'
import styles from '@styles/Auth.module.css'
import { createRef, useContext, useEffect, useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { Check, FilePlus, Image as ImageIcon, Loader, Plus } from 'react-feather';
import { ClientContextType, ClientState } from '@public/@types/client'
import { ClientContext } from '@public/@types/context';

import Svg from "@public/dashed_border"
import { Loading } from '@supabase/ui'
import { supabase } from '@root/client'

import { v4 as uuidv4 } from 'uuid';
import { useGuild } from './guild_management'

import Image from 'next/image'

const CreateServerOverlay: React.FC<{}> = () => {
    const { client, state, callback, user } = useContext<ClientContextType>(ClientContext);

    const [ serverCreate, setServerCreateState ] = useState('svr-create');
    const [ authInputState, setAuthInputState ] = useState({
        server_name: "",
        server_icon: "",
        server_created: false,
        join_url: ""
    });

    const [ imageDrop, setImageDrop ] = useState({
        dragOver: false,
        droped: false,
        file: null,
        uploading: false,
        uploaded: false
    });

    useEffect(() => {
        if(imageDrop.file) {
            const files = imageDrop.file?.target.files;
            if(!imageDrop.uploaded) setImageDrop({ ...imageDrop, uploaded: true })
        }
    }, [imageDrop])

    const input = createRef();

	return (
		<div className={clientStyles.overlay} onClick={(e) => {
            //@ts-expect-error
            if(e.target.classList.contains(clientStyles.overlay)) callback({ ...state, overlay: { ...state.overlay, createServer: false }});
        }}>
            <div className={styles.authBox}>
                <div className={styles.authLeft}>
                    {
                        (serverCreate == 'svr-create') ?
                        <div className={styles.authLogin}>
                            <div>
                                <h2>Create Server</h2>
                                <h3>Give your server some flair!</h3>
                                <br />
                            </div>
                            
                            <div className={styles.authInput + " " + clientStyles.createServerInput}>
                                <div className={clientStyles.serverIconInputHolder}>
                                    <div 
                                        className={(!imageDrop.dragOver) ? (imageDrop.uploading) ? clientStyles.itemUploading : clientStyles.imageDrop : clientStyles.imageDragging}
                                        // onDragEnter={() => {console.log("DRAGGIG ENTERINGG")}}
                                        onDragOver={() => {setImageDrop({...imageDrop, dragOver: true})}}
                                        onDrop={() => {setImageDrop({...imageDrop, droped: true})}}
                                        //@ts-expect-error
                                        onClick={() => {input.current.click()}}
                                    >
                                        
                                        <div className={clientStyles.createServerImage}>
                                            {
                                                (imageDrop.uploading) ?
                                                    (authInputState.server_created) ?
                                                    <div></div>
                                                    :
                                                    <Check size={32} color={"#fff"} strokeWidth={1}/>
                                                :
                                                <ImageIcon size={32} color={"#fff"} strokeWidth={1}/>
                                            }

                                            <div className={clientStyles.createServerImageIMAGE}>
                                                {
                                                    (imageDrop.uploading) ?
                                                        (imageDrop.uploaded) ? 
                                                            (authInputState.server_created) ?
                                                            <div>
                                                                <Check size={32} color={"#fff"} strokeWidth={1}/>
                                                            </div>
                                                            :
                                                            <img src={URL.createObjectURL(imageDrop.file?.target.files.item(0))} /> 
                                                        :
                                                        //@ts-expect-error
                                                        <Loading active={true} size={32} color={"#fff"} strokeWidth={1}> </Loading>
                                                    :
                                                    <h3>UPLOAD <br /> ICON</h3>
                                                }
                                            </div>
                                            
                                            
                                        </div>
                                        
                                        <input 
                                            type="file" 
                                            hidden={true} 
                                            onChange={(e) => setImageDrop({...imageDrop, file: e, uploading: true})} 
                                            //@ts-expect-error
                                            ref={input}
                                        />
                                    </div>
                                </div>
                                

                                <br />

                                <Input title={"SERVER NAME"} type="email" defaultValue={authInputState.server_name} onChange={(e) => setAuthInputState({ ...authInputState, server_name: e.target.value })}/>
                            </div>

                            <div>
                                <Button title={"Create"} onClick={async (clickEvent, callback) => {
                                    // Create Guild.
                                    const channel_id = uuidv4();

                                    const channel = {
                                        name: 'general',
                                        type: 'text',
                                        id: channel_id,
                                        permissions: [{
                                            role: "@everyone",
                                            id: '0',
                                            access: {
                                                read: true,
                                                write: true,
                                                react: true,
                                                join: true,
                                                mention_users: true,
                                                mention_server: true
                                            }
                                        }],
                                        messages: []
                                    };

                                    client
                                        .from('guilds')
                                        .insert([
                                            {
                                                owner: client.auth.user().id,
                                                name: authInputState.server_name,
                                                iconURL: '',
                                                channels: [
                                                    channel_id
                                                ]
                                            }
                                        ])
                                        .then((e) => {
                                            client
                                                .from('channels')
                                                .insert(channel)

                                            client.storage
                                                .from('server-icons')
                                                .upload(`${e.data[0].id}.${imageDrop.file?.target.files.item(0).name.split('.').pop().toLowerCase()}`, imageDrop.file?.target.files[0])
                                                .catch(e => console.error(e))
                                                .then(_e => {
                                                    // Add the server to the user.
                                                    client
                                                        .from('users')
                                                        .select()
                                                        .eq('id', client.auth.user().id)
                                                        .then((user_data) => {
                                                            client
                                                                .from('users')
                                                                .update({
                                                                    ...user_data.data[0],
                                                                    servers: [ ...user_data.data[0]?.servers ?? [], e.data[0].id ]
                                                                })
                                                                .eq('id', client.auth.user().id)
                                                                .then((e) => {
                                                                    setAuthInputState({ ...authInputState, server_created: true });
                                                                    callback();
                                                                })
                                                        });
                                                    
                                                    // Add the icon to the guild
                                                    client
                                                        .from('guilds')                                          
                                                        .update([
                                                            {
                                                                id: e.data[0].id,
                                                                owner: client.auth.user().id,
                                                                name: authInputState.server_name,
                                                                iconURL: `${e.data[0].id}.${imageDrop.file?.target.files.item(0).name.split('.').pop().toLowerCase()}`
                                                            }
                                                        ])
                                                        .eq('id', e.data[0].id)
                                                        .then(() => {
                                                            // Server Creation Sucessful
                                                        })
                                                })
                                        })
                                }}/>
                                <p>Have an invite already? <a href="#" onClick={() => setServerCreateState('svr-join')}>Join Server</a></p> 
                            </div>
                        </div>
                        :
                        <div className={styles.authLogin}>
                            <div>
                                <h2>Join Server</h2>
                                <h3>Join your friends, create a community!</h3>
                            </div>
                            
                            <div className={styles.authInput + " " + clientStyles.createServerInput}>
                                <Input title={"INVITE LINK"} type="email" defaultValue={authInputState.server_name} onChange={(e) => setAuthInputState({ ...authInputState, join_url: e.target.value })}/>
                                <h4>INVITES SHOULD LOOK LIKE</h4>

                                <h5>
                                    aksdm19as
                                    <br />
                                    or
                                    <br />
                                    https://fortitude.app/invite/aksdm19as
                                </h5>
                            </div>

                            <div>
                                <Button title={"Join"} onClick={async (clickEvent, callback) => {
                                    client
                                        .from('invite_links')
                                        .select("*")
                                        .eq('link', authInputState.join_url)
                                        .then(response => {
                                            const guild = response.data[0].guild;

                                            console.log(`Attempting to join ${guild}`)

                                            if(user.servers.includes(guild))
                                                return;

                                            client
                                                .from('guilds')
                                                .select()
                                                .eq('id', guild)
                                                .then(guild_response => {
                                                    console.log(guild_response);

                                                    client
                                                        .from('guilds')
                                                        .update([
                                                            {
                                                                members: [ ...guild_response.data[0].members, user.id ]
                                                            }
                                                        ])
                                                        .eq('id', guild)
                                                        .then(_ => {
                                                            client
                                                                .from('users')
                                                                .update([
                                                                    {
                                                                        servers: user.servers ? [ ...user.servers, guild ] : [ guild ]
                                                                    }
                                                                ])
                                                                .eq('id', user.id)
                                                                .then(_ => {
                                                                    callback();
                                                                })
                                                        })
                                                        
                                                })

                                            
                                        });
                                }}/>
                                <p>Want to make a new one? <a href="#" onClick={() => setServerCreateState('svr-create')}>Create Server</a></p> 
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
        </div>
	)
}

export { CreateServerOverlay }