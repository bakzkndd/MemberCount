import { Plugin } from "@vizality/entities";
import { getModule, FluxDispatcher } from "@vizality/webpack";
import { patch, unpatch } from "@vizality/patcher";
import React from "react";

const TotalMembersComponent = require("./components/TotalMembers.jsx");

const { ListThin } = getModule(["ListThin"], false);
const { getLastSelectedGuildId } = getModule(["getLastSelectedGuildId"], false);

const entityID = "Member-Counter-Component";

export default class MemberCount extends Plugin {
  start() {
    this.handleMemberListUpdate = this.handleMemberListUpdate.bind(this);
    this.injectStyles("./style.css");

    this.guildId = getLastSelectedGuildId();
    this.memberCount = 0;

    patch("member-counter", ListThin, "render", (args, res) => {
      if (
        !args[0] ||
        !args[0]["data-list-id"] ||
        !args[0]["data-list-id"].startsWith("members")
      ) {
        return res;
      }

      res.props.children = [
        React.createElement(TotalMembersComponent(this.settings.get), {
          entityID: entityID,
          guildId: this.guildId,
        }),
        res.props.children,
      ];

      return res;
    });

    FluxDispatcher.subscribe(
      "GUILD_MEMBER_LIST_UPDATE",
      this.handleMemberListUpdate
    );
  }

  handleMemberListUpdate(update) {
    if (update.guildId != getLastSelectedGuildId()) return;
    if (
      this.guildId == getLastSelectedGuildId() &&
      this.memberCount == update.memberCount
    )
      return;

    unpatch("member-counter");

    this.guildId = getLastSelectedGuildId();
    this.memberCount = update.memberCount;

    patch("member-counter", ListThin, "render", (args, res) => {
      if (
        !args[0] ||
        !args[0]["data-list-id"] ||
        !args[0]["data-list-id"].startsWith("members")
      ) {
        return res;
      }

      res.props.children = res.props.children.filter(
        (item) => item?.props?.entityID != entityID
      );

      const id = getLastSelectedGuildId();
      res.props.children = [
        React.createElement(TotalMembersComponent(this.settings.get), {
          entityID: entityID,
          guildId: id,
        }),
        res.props.children,
      ];

      return res;
    });
  }

  stop() {
    unpatch("member-counter");
    FluxDispatcher.unsubscribe(
      "GUILD_MEMBER_LIST_UPDATE",
      this.handleMemberListUpdate
    );
  }
}
