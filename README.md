# firefox-fm

## Usage

0. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig) and compile with the command below.
1. Move [about-fm.uc.mjs](./about-fm.uc.mjs) to `<PROFILE_DIR>/chrome/JS`
2. Move the repo directory to `<PROFILE_DIR>/chrome/resources`
3. Restart Firefox with startup cache cleaned in about:support
4. Go to `about:fm` or click the newly appeared toolbar button.

## Development

Building is a simple `npm i && npm run build`.

This uses React instead of Lit because:

1. In chrome:// URIs it's unusable because of this warning: `Removed unsafe attribute. Element: div. Attribute: iconurl$lit$.`.
2. Fluent support.
