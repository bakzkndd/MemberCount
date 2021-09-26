const { getModule, React } = require("@vizality/webpack");
const { SwitchItem } = require("@vizality/components/settings");

module.exports = class Blur extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { category0Opened: false, category1Opened: false };
  }
  render() {
    const { getSetting, toggleSetting, updateSetting } = this.props;
    return (
      <>
        <SwitchItem
          description="Make it stick to the top of the member list"
          value={getSetting("sticky", false)}
          onChange={() => toggleSetting("sticky")}
        >
          Sticky
        </SwitchItem>
      </>
    );
  }
};
