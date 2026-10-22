{
  lib,
  buildNpmPackage,
  runCommand,
  ...
}: let
  fs = lib.fileset;
  npmPackage = buildNpmPackage {
    pname = "simple-site";
    version = "1.0.0";
    npmDepsHash = "sha256-n9ZeKarhuEd+OFIw6w9TljUR/C1/v3bK4xYWE0ObAFU=";
    src = fs.toSource {
      root = ./.;
      fileset = fs.unions [
        ./index.html
        ./public
        ./assets
        ./package-lock.json
        ./package.json
        ./src
        ./tsconfig.json
        ./vite.config.ts
      ];
    };
  };
in
  runCommand "simple-site" {} ''
    mkdir -p $out
    cp -r ${npmPackage}/lib/node_modules/simple-site/dist/* $out/
  ''
