import Embed from './Embed';
import locales from '../locales/locales';
import {MessageComponentInteraction, TextChannel} from 'discord.js';
import {mod} from '../helper/util';

/**
 * @class
 */
export default abstract class Paginator {
  /**
   * The pages
   * @type {Embed[]}
   * @protected
   */
  protected pages: Embed[];

  /**
   * The current Page
   * @type {number}
   * @private
   */
  private currentPage: number;

  /**
   * @constructor
   */
  constructor() {
    this.pages = [];
    this.currentPage = 0;
  }

  /**
   * Sets the footer for alle Embeds
   */
  protected setFooter() : void {
    this.pages.forEach((page, i) => {
      page.setFooter(`${locales.botEmbeds.page} ${i+1}/${this.pages.length}`);
    });
  }

  /**
   * Returns a basic embed
   * @param {number} pos - The position of the embed
   * @return {Embed}
   */
  protected getBaseEmbed() : Embed {
    return new Embed();
  }

  /**
   * @param {TextChannel} textChannel - The text channel
   */
  public async send(textChannel: TextChannel) {
    this.setFooter();

    // This code is from https://github.com/porridgewithraisins/jam-bot/blob/main/src/Messaging.ts

    const msg = await textChannel.send({
      embeds: [this.pages[this.currentPage]],
      components: [
        {
          type: 'ACTION_ROW',
          components: [
            /* {
              type: 'BUTTON',
              style: 'PRIMARY',
              label: 'First',
              emoji: '⏮️',
              customId: '⏮️',
            },*/
            {
              type: 'BUTTON',
              style: 'PRIMARY',
              label: `${locales.botEmbeds.previous}`,
              emoji: '◀️',
              customId: '◀️',
            },
            {
              type: 'BUTTON',
              style: 'PRIMARY',
              label: `${locales.botEmbeds.next}`,
              emoji: '▶️',
              customId: '▶️',
            },
            /* {
              type: 'BUTTON',
              style: 'PRIMARY',
              label: 'Last',
              emoji: '⏭️',
              customId: '⏭️',
            }, */
          ],
        },
      ],
    });

    const collector = msg.createMessageComponentCollector({
      max: this.pages.length * 5,
    });

    /* setTimeout(() => {
      collector.stop('Timeout');
      msg.edit({components: []});
    }, 150_000);*/

    collector.on('collect', async (interaction) => {
      const {customId} = interaction;
      switch (customId) {
        /* case '⏮️':
          this.currentPage = 0;
          this.update(interaction);
          break; */
        case '◀️':
          this.currentPage = mod(
              this.currentPage - 1,
              this.pages.length,
          );
          this.update(interaction);
          break;
        case '▶️':
          this.currentPage = mod(
              this.currentPage + 1,
              this.pages.length,
          );
          this.update(interaction);
          break;
        /* case '⏭️':
          this.currentPage = this.pages.length - 1;
          this.update(interaction);
          break; */
      }
    });
  }

  /**
   * Updates the embed
   * @param {MessageComponentInteraction} interaction - The interaction
   */
  private async update(interaction: MessageComponentInteraction) {
    await interaction.update({
      embeds: [
        this.pages[this.currentPage],
      ],
    });
  }
}
