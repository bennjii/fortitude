type ClientState = {
    activeServer: string,
    activeDirectMessage: string

    current_pannel: 'dm-home' | 'dm-friends' | 'dm-dm' | 'svr-svr' | string 
}

export type { ClientState }