{
  description = "Bun.js development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            playwright-driver.browsers
            playwright-test
          ];

          shellHook = ''
          echo "Welcome to the l-systems development environment!

                For contact and questions
                - contact laura at mail@laura.fm
                - Or visit the github repository https://github.com/Azeirah/L-Systems-editor

                Quick start tips
                - Run 'bun run dev' to get started with development
                - Run 'playwright' to open the test environment

                Have fun with the trees :)
          ";
          '';
        };
      });
}
