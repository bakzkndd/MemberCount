import React, { Component } from 'react';
import { getModule, Flux, FluxDispatcher } from '@vizality/webpack';

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
          Total Members — {this.props.total}
        </h2>
	  </div>
	);
  }

  
}

const memberStore = getModule([ 'getMemberCount' ], false);
module.exports = Flux.connectStores(
  [ memberStore ],
  (props) => ({
    total: props.guildId ? memberStore.getMemberCount(props.guildId) : 420
  })
)(TotalMembers);