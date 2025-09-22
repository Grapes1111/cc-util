import { APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType } from "discord-api-types/v10";

export function getOption<T extends ApplicationCommandOptionType = ApplicationCommandOptionType>(
  options: APIApplicationCommandInteractionDataOption[] | undefined,
  name: string,
  type?: T
): (Extract<APIApplicationCommandInteractionDataOption, { type: T }> & { value: any }) | undefined {
  if (!options) return undefined;
  return options.find(
    (opt) => opt.name === name && (type === undefined || opt.type === type)
  ) as any;
}