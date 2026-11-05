{
  pkgs,
  nvim,
  ...
}: {
  packages = with pkgs; [
    browser-sync
    nodejs
    nvim
  ];
}
