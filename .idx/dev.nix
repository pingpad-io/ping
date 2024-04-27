{pkgs}: {
  channel = "stable-23.11";
  packages = with pkgs; [
    bun
  ];
  idx.extensions = [
    "vscodevim.vim"
    "biomejs.biome"
  ];
  idx.previews = {
    previews = [
      {
        command = [
          "bun"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        id = "web";
        manager = "web";
      }
    ];
  };
}
