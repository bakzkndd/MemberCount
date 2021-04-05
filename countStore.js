import { Flux, FluxDispatcher } from '@vizality/webpack'

const counts = {};

class CountsStore extends Flux.Store {
  getStore () {
    return counts;
  }

  getPresenceCount (guildId) {
    return counts[guildId];
  }
}

module.exports = {
  store: new CountsStore(FluxDispatcher, {
    TOTAL_MEMBERS_UPDATE_COUNTS: ({ guildId, count }) => (counts[guildId] = count)
  }),
  updatePresencesCount: (guildId, count) =>
    FluxDispatcher.dirtyDispatch({
      type: 'TOTAL_MEMBERS_UPDATE_COUNTS',
      guildId,
      count
    })
};