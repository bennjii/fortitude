import { SupabaseClient } from "@supabase/supabase-js"
import { createContext } from "react"
import { BooleanLiteral } from "typescript"

import uuid from 'uuid'

type Channel = {
    name: string,
    id: uuid,
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
    username: string,
    id: string,
    avatarURL: string,
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
    attatchments: any[],
    send_date: Date,
    unsent: boolean
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

type GuildState = {
    current_channel: Channel,
    current_channel_id: string,
    channels: Channel[],
    current_messages: Message[]
    
    //...
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
    current_pannel: 'dm-home' | 'dm-friends' | 'dm-dm' | 'svr-svr' | string,
    settings: {
        date_twenty_four_hour: boolean,
        short_date: boolean
    }
}

type SettingsState = {
    settings: {
        date_twenty_four_hour: boolean,
        short_date: boolean
    },
    current_pannel: string 
}

type GuildContextType = {
    guild: Guild,
    state: GuildState,
    callback: Function
}

type SettingsContextType = {
    state: SettingsState,
    callback: Function
}

type ClientContextType = {
    client: SupabaseClient,
    user: User,
    state: ClientState,
    callback: Function
}

export type { ClientState, ClientContextType, GuildContextType, SettingsContextType, Guild, User, Channel, Message }