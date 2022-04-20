# tree-sitter-skull

Skull grammar for tree-sitter

## Installing

Before you start, make sure you [install Treesitter for Neovim](https://github.com/nvim-treesitter/nvim-treesitter#quickstart).

### Basic setup

```
$ git clone https://github.com/dosisod/tree-sitter-skull
$ cd tree-sitter-skull
$ npm i
$ npx tree-sitter-cli generate
```

> If `./node_modules/.bin` is on your `PATH`, you don't need to use `npx` to
> run the Treesitter CLI.

### Update nvim config

Add the following to your `init.lua` file:

```
local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
parser_config.skull = {
  install_info = {
    url = "~/PATH/TO/tree-sitter-skull",
    files = {"src/parser.c"},
    generate_requires_npm = false,
    requires_generate_from_grammar = false,
  },
  filetype = "sk",
}
```

Next, run the following commands to copy the query files into your Neovim runtime:

```
$ mkdir $VIMRUNTIME/queries/skull
$ cp queries/* $VIMRUNTIME/queries/skull/
```

Finally, open Neovim, and type `:TSUpdate`.
