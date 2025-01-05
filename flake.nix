{
  description = "HowwieBot: The bot for the ZenBooda1 discord server.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    {
      devShells =
        nixpkgs.lib.genAttrs
          [
            "x86_64-linux"
            "aarch64-linux"
            "x86_64-darwin"
            "aarch64-darwin"
          ]
          (
            system:
            let
              pkgs = nixpkgs.legacyPackages.${system};
            in
            {
              default = pkgs.mkShell {
                nativeBuildInputs = with pkgs; [
                  # General tools
                  nodejs
                  pnpm

                  # LSPs
                  typescript
                  typescript-language-server
                  emmet-language-server
                ];

                shellHook = ''echo "Abandon all hope, ye who enter"'';
              };
            }
          );
    };
}
