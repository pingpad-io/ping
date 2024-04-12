## Overview

### **[pingpad.io](https://pingpad.io)** - a minimalistic decentralized social platform

## Features

- Lens network integration
- Full Markdown support
- Rich embeddings
- LessWrong-style reactions
- Statically generated beauty

## Contributing
Thank you for considering contributing to Pingpad!

To contribute you will first need to fork and the repository:
```sh
git clone https://github.com/pingpad-io/ping.git && cd ping
```

After that, follow the steps to run Pingpad on your local machine:

### 0. Install bun 
Check the installation on the [bun website](https://bun.sh/) and never run foreign scripts without reading them first.

```sh
curl -fsSL https://bun.sh/install | bash  # Linux/Mac
```
```ps
powershell -c "irm bun.sh/install.ps1 | iex" # Windows
```


### 1. Create a `.env` file

Copy the provided `.env.example` file to `.env`.

```sh
cp .env.example .env
```

### 2. Install dependencies

Use `bun` to install dependencies.

```sh
bun install
```

### 3. Running the dev server

Finally, you can run the dev server:

```sh
bun run dev
```

and navigate to [http://localhost:3000/home](http://localhost:3000/home)

### 4. You're awesome!

Now you're all set to start contributing to Pingpad! 

To make a high quality contribution, read **[CONTRIBUTING.md](CONTRIBUTING.md)**

### 5. (extra) Install Biome

  Biome is used for formatting and linting in the project, and can be installed in the VSCode extension marketplace or on biome website: https://biomejs.dev/guides/getting-started/

read the [contributing guide](./CONTRIBUTING.md) to get started

![image psd(1)](https://github.com/kualta/ping/assets/72769566/fe22cb59-0442-4d4f-8af4-5709c2ce91d2)
