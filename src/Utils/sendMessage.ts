import { REST } from '@discordjs/rest';
import { Routes, RESTPostAPIChannelMessageJSONBody, APIInteraction } from 'discord-api-types/v10';

export async function sendMessage(
    rest: REST,
    interaction: APIInteraction,
    message: RESTPostAPIChannelMessageJSONBody
) {
    if (!interaction.channel?.id) {
        throw new Error('No channel_id found on interaction.');
    }
    return await rest.post(
        Routes.channelMessages(interaction.channel.id),
        { body: message }
    );
}