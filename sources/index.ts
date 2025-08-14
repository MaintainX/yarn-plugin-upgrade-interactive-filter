import { Plugin } from "@yarnpkg/core";
import { UpgradeInteractiveCommand } from "./commands/UpgradeInteractiveCommand";

const plugin: Plugin = {
  commands: [UpgradeInteractiveCommand],
};

export default plugin;
