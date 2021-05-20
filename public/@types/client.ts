type Channel = {
    name: string,
    type: 'text' | 'voice',
    permissions: object,
    messages: Message[]
}

type User = {
    name: string,
    id: string,
    iconURL: string
}

type Message = {
    sender: User,
    content: string,
    attatchments: string,
}

type Role = {
    name: string
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

export type { ClientState }