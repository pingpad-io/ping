## Overview

**what?**

clarity paves the way for brilliance. [pingpad](https://pingpad.io) is a minimalistic decentralized social platform, focusing on clear and efficient solutions.

**how?**

built on top of [lens](https://lens.xyz), media is stored on [grove](https://grove.xyz) and [arweave](https://arweave.org)

<!-- ## Gallery
<img height="auto" width="700" style="border-radius:20px" src="https://github.com/pingpad-io/ping/assets/72769566/29e2ae6a-f89e-45cc-b17a-4d5c6a4dd841" />

<img height="auto" width="700" style="border-radius:20px" src="https://github.com/pingpad-io/ping/assets/72769566/4d6ec827-3e13-4119-aa60-63e0fbaf01cd" /> -->


## Contributing
First, clone the repository:
```sh
git clone https://github.com/pingpad-io/ping.git && cd ping
```

After that, follow the steps to run Pingpad on your local machine:


#### 1. Create a `.env` file

Copy the provided `.env.example` file to `.env`.

```sh
cp .env.example .env
```

Replace the variables with your own values.

#### 2. Install dependencies

Use `npm` to install dependencies.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

```bash
nvm install 18
nvm use 18
npm install
```

#### 3. Run the dev server

Finally, you can run the dev server:

```sh
npm run dev
```

and navigate to [http://localhost:3000/home](http://localhost:3000/home)

#### 4. You're awesome!

Now you're all set to start contributing to Pingpad! Next, read **[contributing.md](CONTRIBUTING.md)**

#### 5. (extra) Install Biome

Biome is used for formatting and linting in the project, and can be installed in the Zed/VSCode extensions or on [biome website](https://biomejs.dev/guides/getting-started/)

