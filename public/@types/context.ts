import { createContext } from "react";
import { ClientContextType, GuildContextType } from './client'

const ClientContext = createContext<ClientContextType>(null);

const GuildContext = createContext<GuildContextType>(null);

export { ClientContext, GuildContext }