import { Plugin } from '@vizality/entities';
import { getModule, FluxDispatcher } from '@vizality/webpack';

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

  stop () {
	 
  }
}