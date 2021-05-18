type ClientState = {
    activeServer: string,
    activeDirectMessage: string
    overlay: {
        createServer: boolean,
        settings: boolean
    },
    current_pannel: 'dm-home' | 'dm-friends' | 'dm-dm' | 'svr-svr' | string 
}

export type { ClientState }