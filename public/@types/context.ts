import { createContext } from "react";
import { ClientContextType, GuildContextType, SettingsContextType } from './client'

const ClientContext = createContext<ClientContextType>(null);

const GuildContext = createContext<GuildContextType>(null);

const SettingsContext = createContext<SettingsContextType>(null);

export { ClientContext, GuildContext, SettingsContext }