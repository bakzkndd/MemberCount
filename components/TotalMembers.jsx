import React, { Component } from 'react';
import { getModule } from '@vizality/webpack';

const { requestMembers } = getModule([ 'requestMembers' ], false);
const classes = {
	...getModule([ 'membersGroup' ], false),
	...getModule([ 'statusOnline' ], false)
};

export default class TotalMembers extends Component {
  render () {
	const cls = [
		'total-members',
		'groups',
		true && 'sticky'
	];
	return (
	  <div className={cls.filter(Boolean).join(' ')}>
		<h2 className={`group ${classes.membersGroup} container-2ax-kl`}>
          Total Members — {this.props.total.toLocaleString()}
        </h2>
        <h2 className={`group ${classes.membersGroup} container-2ax-kl`}>
          Online Members — {this.props.online.toLocaleString()}
        </h2>
	  </div>
	);
  }

  
}

const { store: countsStore } = require('../countsStore');
const memberStore = getModule([ 'getMemberCount' ], false);
module.exports = Flux.connectStores(
  [ countsStore, memberStore, powercord.api.settings.store ],
  (props) => ({
    online: props.guildId ? countsStore.getPresenceCount(props.guildId) : 69,
    total: props.guildId ? memberStore.getMemberCount(props.guildId) : 420
  })
)(TotalMembers);