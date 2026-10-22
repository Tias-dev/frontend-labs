{
  description = "Default flake-parts based setup";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
    import-tree.url = "github:vic/import-tree";
    systems.url = "github:nix-systems/default";
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nixvim.url = "github:Tias-dev/nixvim-config";

    devenv = {
      url = "github:cachix/devenv";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    git-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [inputs.treefmt-nix.flakeModule];
      systems = import inputs.systems;
      perSystem = {
        system,
        pkgs,
        ...
      }: let
        nvim = inputs.nixvim.lib.neovimWithOverrides system [
          {
            frontend.enable = true;
          }
        ];
      in {
        packages = {};
        devShells = {
          default = inputs.devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              (import inputs.import-tree ./devenv)
              {config._module.args = {inherit nvim;};}
            ];
          };
        };

        treefmt = import ./treefmt.nix;
      };
    };
}
