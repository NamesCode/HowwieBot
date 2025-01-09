# HowwieBot

The bot for the ZenBooda1 discord server!

## Usage

### Prerequisites

Firstly, you'll need to installing the following packages with your OS's package manager

- nodejs
- pnpm

#### With Nix

Just run `nix develop` lolz

### Running

Run `pnpm install` to install the initial dependencies.

After that, create a file with the environment variables and export it with `export $(grep -v '^#' .env | xargs)`.
Example `.env` file:
```
TOKEN=your-token-here
CLIENTID=bots-client-id
GUILDID=testing-guild-id
```

Then register commands with `node src/register-command.js`.

Finally run `TOKEN='your-token-here' node src/main.js` for the bot to go live.

### Making commands

TODO!

## Licensing and copyright

Copyright (c) 2024 Howwie & Name

Licensed under the AGPLv3.0 or later
