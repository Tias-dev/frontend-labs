{pkgs, nvim, ...}: {
  packages = with pkgs; [
    browser-sync
    nvim
  ];
}
