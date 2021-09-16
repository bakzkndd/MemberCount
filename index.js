import { Plugin } from '@vizality/entities';
import { getModule, FluxDispatcher } from '@vizality/webpack';
import { patch, unpatch} from '@vizality/patcher'
import React from 'react';

const TotalMembersComponent = require('./components/TotalMembers.jsx');

const { ListThin } = getModule([ 'ListThin' ], false);
const { getLastSelectedGuildId } = getModule([ 'getLastSelectedGuildId' ], false);

export default class MemberCount extends Plugin {
  start () {
    this.handleMemberListUpdate = this.handleMemberListUpdate.bind(this);
    
    patch('member-counter', ListThin, 'render', (args, res) => {
      if (!args[0] || !args[0]['data-list-id'] || !args[0]['data-list-id'].startsWith('members')) {
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
  }

  handleMemberListUpdate (update) {
    unpatch('member-counter');
    patch('member-counter', ListThin, 'render', (args, res) => {
      if (!args[0] || !args[0]['data-list-id'] || !args[0]['data-list-id'].startsWith('members')) {
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
  }

  stop () {
	 
  }
}