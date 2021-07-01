import { ClientContextType, Guild, User } from "@public/@types/client";
import { ClientContext } from "@public/@types/context"
import { useContext, useEffect, useState } from "react"

export const useGuild = (guild_id) => {
    const { guilds, setGuilds, client } = useContext<ClientContextType>(ClientContext);
    const [ guild, setGuild ] = useState(guilds.find((guild: { data: Guild, id: string }) => guild.id == guild_id))

    const addGuild = () => {
        // Reserve the spot in the array, to add listeners to and prevent duplication for.
        guilds.push({ data: null, id: guild_id });
        const user_index = guilds.findIndex((guild: { data: Guild, id: string }) => guild.id == guild_id);

        client
            .from('guilds')
            .select("*")
            .eq('id', guild_id)
            .then(guild_response => {
                guilds.splice(user_index, 1, { data: { ...guild_response.data[0], icon: null }, id: guild_id });
                setGuild(guilds[user_index]);

                //              Get Server Icon???

                client
                    .storage
                    .from('server-icons')
                    .createSignedUrl(guild_response.data[0].iconURL, 172800000)
                    .then(icon => {
                        guilds.splice(user_index, 1);
                                
                        setGuild({ data: { ...guild_response.data[0], icon: icon.signedURL}, id: guild_id });

                        setGuilds([ ...guilds.splice(0, user_index), { data: { ...guild_response.data[0], icon: icon.signedURL }, id: guild_id }, ...guilds.splice(user_index + 1, guilds.length)  ]);
                        
                        updateGuild({ data: { ...guild_response.data[0].new, icon: icon.signedURL}, id: guild_id }, guild_id) 
                    }) 
            });
    }

    const getGuild = (guild_id) => {
        return guilds.find((guild: { data: Guild, id: string }) => guild.id == guild_id);
    }

    const updateGuild = (guild, guild_id) => {
        guilds[guilds.findIndex((guild: { data: Guild, id: string }) => guild.id == guild_id)] = guild;

        setGuild(guild);
    }

    useEffect(() => {
        const userListener = client
            .from(`users:id=eq.${guild_id}`) 
            .on('*', (payload) => {
                client
                    .storage
                    .from('user-icons')
                    .createSignedUrl(payload.new.avatarURL, 172800000)
                    .then(icon => {
                        client
                            .storage
                            .from('user-banners')
                            .createSignedUrl(payload.new.bannerURL, 172800000)
                            .then(banner => {
                                updateGuild({ data: { ...payload.new, banner: banner.signedURL, icon: icon.signedURL}, id: guild_id }, guild_id)
                            })
                    }) 

                
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [])

    useEffect(() => {
        setGuild(guilds.find((guild: { data: Guild, id: string }) => guild.id == guild_id));
    }, [guilds, guild_id])

    if(!guild)
        addGuild()

    return guild;
}