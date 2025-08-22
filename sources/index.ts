import { Plugin } from "@yarnpkg/core";

import UpgradeInteractiveCommand from "./commands/upgrade-interactive";

const plugin: Plugin = {
  commands: [UpgradeInteractiveCommand],
};

export default plugin;
