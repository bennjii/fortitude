import { User } from "@public/@types/client";
import { ClientContext } from "@public/@types/context"
import { useContext, useEffect, useState } from "react"

export const useUser = (user_id) => {
    const { users, setUsers, client } = useContext(ClientContext);
    const [ user, setUser ] = useState(users.find((user: { data: User, id: string }) => user.id == user_id))

    const addUser = () => {
        // Reserve the spot in the array, to add listeners to and prevent duplication for.
        users.push({ data: null, id: user_id });
        const user_index = users.findIndex((user: { data: User, id: string }) => user.id == user_id);

        client
            .from('users')
            .select("*")
            .eq('id', user_id)
            .then(e => {
                users.splice(user_index, 1, { data: { ...e.data[0], icon: null }, id: user_id });
                setUser(users[user_index]);

                client
                    .storage
                    .from('user-icons')
                    .createSignedUrl(e.data[0].avatarURL, 172800000)
                    .then(icon => {
                        client
                            .storage
                            .from('user-banners')
                            .createSignedUrl(e.data[0].bannerURL, 172800000)
                            .then(banner => {
                                users.splice(user_index, 1);
                                
                                setUser({ data: { ...e.data[0], icon: icon.signedURL}, id: user_id });

                                setUsers([ ...users.splice(0, user_index), { data: { ...e.data[0], icon: icon.signedURL, banner: banner.signedURL}, id: user_id }, ...users.splice(user_index + 1, users.length)  ]);
                                
                                updateUser({ data: { ...e.data[0].new, banner: banner.signedURL, icon: icon.signedURL}, id: user_id }, user_id)
                            })

                        
                    }) 
            });
    }

    const getUser = (user_id) => {
        return users.find((user: { data: User, id: string }) => user.id == user_id);
    }

    const updateUser = (user, user_id) => {
        users[users.findIndex((user: { data: User, id: string }) => user.id == user_id)] = user;

        setUser(user);
    }

    useEffect(() => {
        const userListener = client
            .from(`users:id=eq.${user_id}`) 
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
                                updateUser({ data: { ...payload.new, banner: banner.signedURL, icon: icon.signedURL}, id: user_id }, user_id)
                            })
                    }) 

                
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [])

    useEffect(() => {
        setUser(users.find((user: { data: User, id: string }) => user.id == user_id))
    }, [users])

    if(!user)
        addUser()

    return user;
}