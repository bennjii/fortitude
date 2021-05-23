import { SupabaseClient } from "@supabase/supabase-js"
import { createContext } from "react"
import { BooleanLiteral } from "typescript"

type Channel = {
    name: string,
    type: 'text' | 'voice',
    permissions: {
        role: string,
        id: string,
        access: Permission[],
    },
    messages?: Message[]
}

type Permission = {
    read: boolean,
    write: boolean,
    react: boolean,
    join: boolean,

    mention_users: boolean,
    mention_server: boolean
}

type User = {
    name: string,
    id: string,
    iconURL: string,
    tag: string,
    flags: object[],
    created_at: Date,
    friends: object[],

    presence: {
        activity: string,
        status: object
    },
    servers: {
        id: string,
        data: Guild[],
    },
}

type Message = {
    sender: User,
    content: string,
    attatchments: string,
    send_date: Date
}

type Role = {
    name: string,
    id: string
    //...
}

type Guild = {
    id: string,
    owner: string,
    name: string,
    iconURL: string,
    channels: Channel[],
    members: User[],
    roles: Role[]
}

type ClientState = {
    activeServer: string,
    activeDirectMessage: string
    overlay: {
        createServer: boolean,
        settings: boolean
    },
    current_server: {
        id: string,
        data: Guild,
    },
    current_pannel: 'dm-home' | 'dm-friends' | 'dm-dm' | 'svr-svr' | string 
}

type ClientContextType = {
    client: SupabaseClient,
    state: ClientState,
    callback: Function
}

export type { ClientState, ClientContextType }