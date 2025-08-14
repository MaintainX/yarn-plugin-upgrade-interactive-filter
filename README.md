# Yarn Plugin Upgrade Interactive Filter

This Yarn plugin extends the interactive upgrade command to allow filtering by workspace names.

## Installation

### Local Development

1. Clone this repository:

```bash
git clone https://github.com/alexisloiselle/yarn-plugin-upgrade-interactive-filter.git
cd yarn-plugin-upgrade-interactive-filter
```

2. Install dependencies:

```bash
yarn install
```

3. Build the plugin:

```bash
yarn build
```

4. Install the plugin in your target project:

```bash
yarn plugin import /path/to/yarn-plugin-upgrade-interactive-filter/bundles/@yarnpkg/plugin-upgrade-interactive-filter.js
```

## Usage

The plugin adds a command: `yarn upgrade-interactive-filter <WORKSPACE_NAMES>` command:

```bash
# Upgrade dependencies only for specific workspaces
yarn upgrade-interactive-filter ts-scripts

# You can also use multiple workspace names
yarn upgrade-interactive-filter ts-scripts gql-gen
```

## How it works

The plugin adds the command `upgrade-interactive-filter` and:

1. For each workspace provided, it identifies matching workspaces in the project
2. For each filtered workspace, it runs `yarn upgrade-interactive` in that workspace's directory
3. When no workspace filter is provided, it fails

## Development

To work on this plugin:

1. Clone the repository
2. Install dependencies: `yarn install`
3. Make your changes in the `sources/` directory
4. Build the plugin: `yarn build`
5. Test in a target project by importing the built plugin
