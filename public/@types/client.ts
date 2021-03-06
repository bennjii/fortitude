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

type FortitudeNotification = {
    message: string,
    origin: string,
    duration: number,
    id: string,
    redirect: string,
    icon: string,
    action: string,
    accept_message: string
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
    bannerURL: string,

    tag: string,
    flags: object[],

    created_at: Date,
    friends: Friend[],

    icon: string,
    banner: string,
    
    presence: {
        activity: string,
        status: object
    },
    servers: string[]
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
    members: string[],
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
    settings: Settings,
    notifications: FortitudeNotification[],
    status_message: {
        open: boolean,
        message: string,
        type: "loading" | "success" | "failure" | string
    }
}

type Friend = {
    uid: string,
    friendship_date: string
    direct_message: {
        id: string,
        open: boolean
    },
    affinity?: number
}

type Settings = {
    date_twenty_four_hour: boolean,
    short_date: boolean,
    bindings: {
        open_notification: string,
        accept_call: string,
        decline_call: string
    }
}

type SettingsState = {
    settings: Settings,
    current_pannel: string,
    status_message: {
        open: boolean,
        message: string,
        type: "loading" | "success" | "failure" | string
    }
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
    users: {data: User | null, id: string}[],
    guilds: {data: Guild | null, id: string}[],

    setUsers: Function,
    setGuilds: Function,

    state: ClientState,
    callback: Function
}

export type { ClientState, ClientContextType, GuildContextType, SettingsContextType, Guild, User, Channel, Message, FortitudeNotification }