import {
  ButtonInteraction,
  CacheType,
  Client,
  CommandInteraction,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
export interface IExecuteParameter<T extends CacheType> {
  client: Client;
  interaction: CommandInteraction<T> | any;
}
export type TExecuteParameter<T extends CacheType = CacheType> = Partial<
  IExecuteParameter<T>
>;
export type TExecuteReturn<T extends void> = Promise<T>;

export interface ICommandBuilder<T extends CacheType = CacheType> {
  data: SlashCommandBuilder;
  execute(param: TExecuteParameter<T>): TExecuteReturn<void>;
}
