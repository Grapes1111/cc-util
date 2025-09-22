import { Hono } from 'hono'
import verifySignature from "@discord-interactions/verify";
import { Env, Variables } from './env';
import { APIInteraction, ApplicationCommandType, ComponentType, InteractionResponseType, InteractionType, MessageFlags } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import Commands from './Commands';
import { createReply } from './Utils/createReply';
import { isChatInputApplicationCommandInteraction, isMessageComponentButtonInteraction, isMessageComponentSelectMenuInteraction } from 'discord-api-types/utils';
import Buttons from './Buttons';
import SelectMenus from './SelectMenus';

const app = new Hono<{
    Bindings: Env,
    Variables: Variables
}>()

app.all("*", async (ctx, next) => {
    const rest = new REST()
        .setToken(ctx.env.BOT_TOKEN)
    ctx.set("rest", rest);

    await next()
})
app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.post("/interactions", async (ctx) => {
    const signature = ctx.req.header('x-signature-ed25519');
    const timestamp = ctx.req.header('x-signature-timestamp');
    const body = await ctx.req.text();

    const valid = signature &&
        timestamp &&
        await verifySignature(ctx.env.DISCORD_PUBLIC_KEY, signature, timestamp, body);

    if (!valid) return ctx.json("Bad request signature.", { status: 401 })

    const interaction = JSON.parse(body) as APIInteraction;

    switch (interaction.type) {
        case InteractionType.Ping:
            return ctx.json({
                type: InteractionResponseType.Pong,
            });

        case InteractionType.ApplicationCommand: {
            if (isChatInputApplicationCommandInteraction(interaction)) {
                const command = Commands[interaction.data.name];

                const reply = createReply(ctx, interaction);

                let response: Promise<any>
                if (!command) {
                    response = await reply({
                        data: {
                            content: "This command does not exist",
                            flags: MessageFlags.Ephemeral
                        }
                    })
                } else {
                    try {
                        await command.execute(ctx, interaction, reply);
                    } catch (error) {
                        await reply({
                            data: {
                                content: "An error occured whilst running that command",
                                flags: MessageFlags.Ephemeral
                            }
                        })
                    }
                }
            }
            break;
        }
        case InteractionType.MessageComponent: {
            if (isMessageComponentButtonInteraction(interaction)) {
                const button = Buttons[interaction.data.custom_id.split("-")[0]]

                const reply = createReply(ctx, interaction);

                let response: Promise<any>
                if (!button) {
                    response = await reply({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            content: "This command does not exist",
                            flags: MessageFlags.Ephemeral
                        }
                    })
                } else {
                    try {
                        await button.execute(ctx, interaction, reply);
                    } catch (error) {
                        console.log(error)
                        await reply({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                content: "An error occured whilst running that command",
                                flags: MessageFlags.Ephemeral
                            }
                        })
                    }
                }
            }
            if (isMessageComponentSelectMenuInteraction(interaction)) {
                const baseId = interaction.data.custom_id.split("-")[0];
                const menu = SelectMenus[baseId];
                const reply = createReply(ctx, interaction);

                if (!menu) {
                    await reply({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            content: "This menu does not exist",
                            flags: MessageFlags.Ephemeral,
                        },
                    });
                } else {
                    try {
                        switch (interaction.data.component_type) {
                            case ComponentType.StringSelect:
                                await menu.execute(ctx, interaction as any, reply);
                                break;
                            case ComponentType.UserSelect:
                            case ComponentType.RoleSelect:
                            case ComponentType.ChannelSelect:
                            case ComponentType.MentionableSelect:
                                await menu.execute(ctx, interaction as any, reply);
                                break;
                        }
                    } catch (error) {
                        console.error(error);
                        await reply({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                content: "An error occurred whilst running that menu",
                                flags: MessageFlags.Ephemeral,
                            },
                        });
                    }
                }
            }
        }

            return new Response(null, { status: 202 })
    }
})

export default app
