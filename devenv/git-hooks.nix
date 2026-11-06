{
  git-hooks.hooks = {
    alejandra = {
      enable = true;
      files = "\\.(nix)$";
    };
    prettier.enable = true;
  };
}
