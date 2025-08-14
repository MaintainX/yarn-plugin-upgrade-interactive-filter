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

The plugin adds a `--workspace` option to the `yarn upgrade-interactive` command:

```bash
# Upgrade dependencies only for specific workspaces
yarn upgrade-interactive --workspace workspace1 --workspace workspace2

# You can also use multiple workspace names
yarn upgrade-interactive --workspace frontend --workspace backend --workspace shared
```

## How it works

The plugin replaces the built-in `upgrade-interactive` command and:

1. Adds a `--workspace` option to filter by workspace names
2. When workspace filters are provided, it identifies matching workspaces in the project
3. For each filtered workspace, it runs `yarn upgrade-interactive` in that workspace's directory
4. When no workspace filter is provided, it falls back to running the standard `upgrade-interactive` command

## Development

To work on this plugin:

1. Clone the repository
2. Install dependencies: `yarn install`
3. Make your changes in the `sources/` directory
4. Build the plugin: `yarn build`
5. Test in a target project by importing the built plugin
