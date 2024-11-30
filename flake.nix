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
    let
      system = "aarch64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.aarch64-linux.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          # General tools
          nodejs
          pnpm

          # LSPs
          typescript
          typescript-language-server
          emmet-language-server
        ];

        shellHook = ''echo "Abandon all hope, ye who enter here"'';
      };
    };
}
