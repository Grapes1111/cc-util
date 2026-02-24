import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

const commands = [
    {
        name: "reaction-role",
        description: "Sends the reaction role menu",
        type: 1,
        options: [
            {
                name: "type",
                description: "Type of reaction role",
                type: 3, 
                required: true,
                choices: [
                    { name: "Bot Roles", value: "bot" },
                    { name: "Server roles", value: "server" },
                    { name: "Colour roles", value: "colour" },
                    { name: "All", value: "all" } 
                ]
            }
        ]
    }
];

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: "10" }).setToken(TOKEN);

await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: commands
});
