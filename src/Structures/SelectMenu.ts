import {
  APIMessageComponentSelectMenuInteraction,
  APIMessageStringSelectInteractionData,
  APIMessageUserSelectInteractionData,
  APIMessageRoleSelectInteractionData,
  APIMessageChannelSelectInteractionData,
  APIMessageMentionableSelectInteractionData,
} from "discord-api-types/v10";
import { Context } from "hono";
import { Env, Variables } from "../env";

export type SelectType = "String" | "User" | "Channel" | "Role" | "Mentionable";

// map each SelectType → correct interaction.data type
type SelectMenuDataMap = {
  String: APIMessageStringSelectInteractionData;
  User: APIMessageUserSelectInteractionData;
  Channel: APIMessageChannelSelectInteractionData;
  Role: APIMessageRoleSelectInteractionData;
  Mentionable: APIMessageMentionableSelectInteractionData;
};

export type ExecuteReply = (
  body: any // RESTPostAPIInteractionCallbackJSONBody | RESTPostAPIInteractionCallbackFormDataBody
) => Promise<any>;

interface SelectMenuOptions<T extends SelectType = "String"> {
  customId: string;
  type?: T;
  execute: (
    ctx: Context<{ Bindings: Env; Variables: Variables }>,
    interaction: APIMessageComponentSelectMenuInteraction & {
      data: SelectMenuDataMap[T];
    },
    reply: ExecuteReply
  ) => any;
}

export class SelectMenu<T extends SelectType = "String"> {
  public readonly customId: string;
  public readonly type: T;
  public readonly execute: (
    ctx: Context<{ Bindings: Env; Variables: Variables }>,
    interaction: APIMessageComponentSelectMenuInteraction & {
      data: SelectMenuDataMap[T];
    },
    reply: ExecuteReply
  ) => any;

  constructor(menu: SelectMenuOptions<T>) {
    this.customId = menu.customId;
    this.type = (menu.type ?? "String") as T;
    this.execute = menu.execute;
  }
}