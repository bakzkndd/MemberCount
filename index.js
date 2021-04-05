import { Plugin } from '@vizality/entities';
import { getModule, FluxDispatcher } from '@vizality/webpack';
import { forceUpdateElement } from '@vizality/util'
import { patch, unpatch} from '@vizality/patcher'

const TotalMembersComponent = require('./components/TotalMembers.jsx');

const { ListThin } = getModule([ 'ListThin' ], false);
const { getLastSelectedGuildId } = getModule([ 'getLastSelectedGuildId' ], false);

export default class MemberCount extends Plugin {
  start () {
    this.handleMemberListUpdate = this.handleMemberListUpdate.bind(this);
    patch('member-counter', ListThin, 'render', (args, res) => {
      if (!args[0] || !args[0].id || !args[0].id.startsWith('members')) {
        return res;
      }

      const id = getLastSelectedGuildId();
      res.props.children = [
        React.createElement(TotalMembersComponent, {
          entityID: this.entityID,
          guildId: id
        }),
        res.props.children
      ];

      return res;
    });

    FluxDispatcher.subscribe('GUILD_MEMBER_LIST_UPDATE', this.handleMemberListUpdate);
    this.forceUpdateMembersList();
  }

  forceUpdateMembersList () {
    forceUpdateElement(`.${getModule([ 'membersWrap' ], false).membersWrap}`);
  }

  handleMemberListUpdate (update) {
    if (update.id === 'everyone' || update.groups.find(g => g.id === 'online')) { // Figure out a better filter eventually
      const online = update.groups
        .map(group => group.id !== 'offline' ? group.count : 0)
        .reduce((a, b) => (a + b), 0);

      updatePresencesCount(update.guildId, online);
    }
  }

  stop () {
	 
  }
}