{
  lib,
  buildNpmPackage,
  runCommand,
  ...
}: let
  fs = lib.fileset;
  npmPackage = buildNpmPackage {
    pname = "dashboard-site";
    version = "1.0.0";
    npmDepsHash = "sha256-VEALYFJ3oAZiYtaFE5c3ok1SI3J4U0BE6dSwQznmcl0=";
    src = fs.toSource {
      root = ./.;
      fileset = fs.unions [
        ./index.html
        ./public
        ./package-lock.json
        ./package.json
        ./src
        ./tsconfig.json
      ];
    };
  };
in
  runCommand "simple-site" {} ''
    mkdir -p $out
    cp -r ${npmPackage}/lib/node_modules/dashboard-site/dist/* $out/
  ''
