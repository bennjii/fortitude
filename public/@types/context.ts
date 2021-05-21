import { createContext } from "react";
import { ClientContextType } from './client'

const ClientContext = createContext<ClientContextType>({
    client: null,
    state: null,
    callback: null
});

export { ClientContext }