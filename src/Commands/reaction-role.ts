import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
} from "@discordjs/builders";
import { SlashCommand } from "../Structures/SlashCommand";
import {
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    ButtonStyle,
    InteractionContextType,
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/v10";
import { getOption } from "../Utils/findOption";
import { adminRole, mainColour } from "../constants";
import { sendMessage } from "../Utils/sendMessage";

const BOT_ROLES_MESSAGE = {
    embeds: [
        new EmbedBuilder()
            .setDescription(
                `Click below for roles\n<:status:1401608512106270840> - <@&1401606390178513148>\n<:update:1401606657045430402> - <@&1401606358092091423>\n📊 - <@&1475834120218083339>`,
            )
            .setColor(mainColour)
            .toJSON(),
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
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("rr_bot-1475834120218083339")
                    .setLabel("Polls")
                    .setEmoji({ name: "📊" })
                    .setStyle(ButtonStyle.Secondary),
            )
            .toJSON(),
    ],
};

const SERVER_ROLES_MESSAGE = {
    embeds: [
        new EmbedBuilder()
            .setDescription(`Click below for roles\n💰 - <@&1382888450654601276>`)
            .setColor(mainColour)
            .toJSON(),
    ],
    components: [
        new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId("rr_bot-1382888450654601276")
                    .setLabel("Server drops")
                    .setEmoji({ name: "💰" })
                    .setStyle(ButtonStyle.Secondary),
            )
            .toJSON(),
    ],
};

const COLOUR_ROLES_MESSAGE = {
    embeds: [
        new EmbedBuilder()
            .setDescription("Pick your colour role from the menu below:")
            .setColor(mainColour)
            .toJSON(),
    ],
    components: [
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("rr_colour")
                    .setPlaceholder("Select a colour role")
                    .addOptions([
                        { label: "Red", value: "1419739699567657040" },
                        { label: "Green", value: "1419739700234682520" },
                        { label: "Blue", value: "1419739701845295256" },
                        { label: "Yellow", value: "1419739702449406043" },
                        { label: "Purple", value: "1419739703006990437" },
                        { label: "Orange", value: "1419739703753838702" },
                    ]),
            )
            .toJSON(),
    ],
};

const POG_ROLES_MESSAGE = {
    embeds: [
        new EmbedBuilder()
            .setDescription(
                `Select your Pog roles below:\n\n<@&1385764630101754048>\n<@&1385764540050051202>\n<@&1385764529618555015>\n<@&1384281801148600590>\n<@&1385764456792985612>\n<@&1384281826561888288>`,
            )
            .setColor(mainColour)
            .toJSON(),
    ],
    components: [
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("rr_pog")
                    .setPlaceholder("Select Pog roles")
                    .setMinValues(0)
                    .setMaxValues(6)
                    .addOptions([
                        { label: "Single Print", value: "1385764630101754048" },
                        { label: "Mid Print", value: "1385764540050051202" },
                        { label: "Low Print", value: "1385764529618555015" },
                        { label: "High Wl", value: "1384281801148600590" },
                        { label: "Mid Wl", value: "1385764456792985612" },
                        { label: "Low Wl", value: "1384281826561888288" },
                    ]),
            )
            .toJSON(),
    ],
};

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
                    { name: "Colour roles", value: "colour" },
                    { name: "Pog roles", value: "pog" },
                    { name: "All", value: "all" },
                )
                .setRequired(true);
        })
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .toJSON(),
    async execute(ctx, interaction, reply) {
        const member = interaction.member;

        if (!member) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Unable to resolve member object",
                    flags: MessageFlags.Ephemeral,
                },
            });
        }

        if (!member.roles.includes(adminRole)) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "You must be an admin to use this command",
                    flags: MessageFlags.Ephemeral,
                },
            });
        }

        const choice = getOption(
            interaction.data.options,
            "type",
            ApplicationCommandOptionType.String,
        );

        if (!choice) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "No choice was found",
                    flags: MessageFlags.Ephemeral,
                },
            });
        }

        const rest = ctx.get("rest");

        switch (choice.value) {
            case "bot":
                await sendMessage(rest, interaction, BOT_ROLES_MESSAGE);
                break;
            case "server":
                await sendMessage(rest, interaction, SERVER_ROLES_MESSAGE);
                break;
            case "colour":
                await sendMessage(rest, interaction, COLOUR_ROLES_MESSAGE);
                break;
            case "pog":
                await sendMessage(rest, interaction, POG_ROLES_MESSAGE);
                break;
            case "all":
                await sendMessage(rest, interaction, BOT_ROLES_MESSAGE);
                await sendMessage(rest, interaction, SERVER_ROLES_MESSAGE);
                await sendMessage(rest, interaction, COLOUR_ROLES_MESSAGE);
                await sendMessage(rest, interaction, POG_ROLES_MESSAGE);
                break;
            default:
                return await reply({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "Unknown option",
                        flags: MessageFlags.Ephemeral,
                    },
                });
        }

        await reply({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Sent the requested reaction role menu(s)",
                flags: MessageFlags.Ephemeral,
            },
        });
    },
});