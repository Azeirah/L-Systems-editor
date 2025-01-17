{
  description = "Bun.js development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        setup-script = pkgs.writeScriptBin "setup-lsystems" ''
                  #!${pkgs.bash}/bin/bash
          	if [[ ! -d node_modules ]]; then
                    ${pkgs.bun}/bin/bun i
          	fi
        '';
      in {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            playwright-driver.browsers
            playwright-test
            # this package is necessary to run playwright with bun. I really don't know why.
            # See my comment on the issue: https://github.com/oven-sh/bun/issues/8222#issuecomment-2512722612
            nodejs_22
            setup-script
          ];

          buildInputs = with pkgs; [ bun ];

          PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";

          shellHook = ''
            setup-lsystems
            ${pkgs.gum}/bin/gum format <<EOF
            # Welcome to the L-systems development environment!

            For contact and questions

            - Contact laura at mail@laura.fm
            - Or [visit the github repository](https://github.com/Azeirah/L-Systems-editor)

            ## Quick start tips

            - Run \`bun run dev\` to get started with development

            ### Testing

            - Run 'bun run test' to run all tests
            - Run 'bun run test:ui' to open the test UI

            Have fun with nature! :)
            EOF
          '';
        };
      });
}
