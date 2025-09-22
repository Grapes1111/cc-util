import { REST } from "@discordjs/rest";

export interface Env {
    BOT_TOKEN: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_PUBLIC_KEY: string
}

export interface Variables {
    rest: REST
}