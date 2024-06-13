import { RestOrArray, APIEmbedField } from "discord.js";

export declare module "discord.js" {
  import { Player } from "discord-player";
  import {
    Collection,
    Client,
    GatewayIntentBits,
    Collection,
    EmbedBuilder,
  } from "discord.js";
  export declare interface Client {
    commands: Collection<any, any>;
    player: Player;
  }

  export declare class MessageEmbed extends EmbedBuilder {}
  export declare class MessageActionRow extends ActionRowBuilder {}
  export declare class MessageButton extends ButtonBuilder {}
}
