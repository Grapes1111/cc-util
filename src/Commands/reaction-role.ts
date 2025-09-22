import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from "@discordjs/builders";
import { SlashCommand } from "../Structures/SlashCommand";
import { ApplicationCommandOptionType, ApplicationIntegrationType, ButtonStyle, InteractionContextType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { getOption } from "../Utils/findOption";
import { adminRole, mainColour } from "../constants";
import { sendMessage } from "../Utils/sendMessage";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("reaction-role")
        .setDescription("Sends the reaction role menu")
        .addStringOption((option) => {
            return option
                .setName("type")
                .setDescription("Type of reaction role")
                .addChoices(
                    { name: "Bot Roles", value: "bot" },
                    { name: "Server roles", value: "server" },
                    { name: "Colour roles", value: "colour" }
                )
                .setRequired(true)
        })
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .toJSON(),
    async execute(ctx, interaction, reply) {
        const options = interaction.data.options;
        const member = interaction.member;

        if (!member) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Unable to resolve member object",
                    flags: MessageFlags.Ephemeral
                }
            })
        }

        if (!member.roles.includes(adminRole)) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "You must be an admin to use this command",
                    flags: MessageFlags.Ephemeral
                }
            })
        }

        if (!options?.length) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "No options was found",
                    flags: MessageFlags.Ephemeral
                }
            })
        }

        const choice = getOption(interaction.data.options, "type", ApplicationCommandOptionType.String);

        if (!choice) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "No choice was found",
                    flags: MessageFlags.Ephemeral
                }
            })
        }

        switch (choice.value) {
            case "bot": {
                await sendMessage(ctx.get("rest"), interaction, {
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Click below for roles\n<:status:1401608512106270840> - <@&1401606390178513148>\n<:update:1401606657045430402> - <@&1401606358092091423>`)
                            .setColor(mainColour)
                            .toJSON()
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .setComponents(
                                new ButtonBuilder()
                                    .setCustomId("rr_bot-1401606390178513148")
                                    .setLabel("Status")
                                    .setEmoji({ id: "1401608512106270840" })
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("rr_bot-1401606358092091423")
                                    .setLabel("Bot Updates")
                                    .setEmoji({ id: "1401606657045430402" })
                                    .setStyle(ButtonStyle.Secondary)
                            )
                            .toJSON()
                    ]
                });

                await reply({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "Sent that reaction role",
                        flags: MessageFlags.Ephemeral
                    }
                });
                break;
            }
            case "server": {
                await sendMessage(ctx.get("rest"), interaction, {
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `Click below for roles\n💰 - <@&1382888450654601276>`
                            )
                            .setColor(mainColour)
                            .toJSON()
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .setComponents(
                                new ButtonBuilder()
                                    .setCustomId("rr_bot-1382888450654601276")
                                    .setLabel("Server drops")
                                    .setEmoji({ name: "💰" })
                                    .setStyle(ButtonStyle.Secondary)
                            )
                            .toJSON()
                    ]
                });
                await reply({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "Sent that reaction role",
                        flags: MessageFlags.Ephemeral
                    }
                });
                break;
            }
            case "colour": {
                const roles = [
                    { id: "1419739699567657040", name: "Red" },
                    { id: "1419739700234682520", name: "Green" },
                    { id: "1419739701845295256", name: "Blue" },
                    { id: "1419739702449406043", name: "Yellow" },
                    { id: "1419739703006990437", name: "Purple" },
                    { id: "1419739703753838702", name: "Orange" }
                ];

                await sendMessage(ctx.get("rest"), interaction, {
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("Pick your colour role from the menu below:")
                            .setColor(mainColour)
                            .toJSON()
                    ],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .setComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("rr_colour")
                                    .setPlaceholder("Select a colour role")
                                    .addOptions(
                                        roles.map(r => ({
                                            label: r.name,
                                            value: r.id
                                        }))
                                    )
                            )
                            .toJSON()
                    ]
                });

                await reply({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "Sent that reaction role menu",
                        flags: MessageFlags.Ephemeral
                    }
                });
                break;
            }
            default: {
                await reply({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "Unknown option"
                    }
                })
            }
        }
    },
});
