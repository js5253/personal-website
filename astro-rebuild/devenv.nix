{
  pkgs,
  lib,
  config,
  ...
}:
{
  # devenv.sh/languages/
  languages.javascript = {
    enable = true;
    nodejs.enable = true;
    npm.enable = true;
    yarn.enable = true;
  };

  # See full reference at https://devenv.sh/reference/options/
}
