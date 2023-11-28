<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://luxo.vercel.app">
    <img src="readme/Logo.png" alt="Logo" width="80" height="36.5">
  </a>

  <h3 align="center">Welcome to Luxo
</h3>

  <p align="center">
    Luxo is a decentralized profile viewer on the Lukso network. Made specifically for the <a href="https://app.buidlbox.io/lukso/build-up-2">BuildUP #2</a> hackathon.
    <br />
    <a href="https://luxo.vercel.app"><strong>View demo »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Screenshot 1][product-screenshot]](https://luxo.vercel.app)
[![Screenshot 2][product-screenshot-2]](https://luxo.vercel.app)

### Built With

This project was developed using Next.js and Shadcn/ui components library.

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Get a free API Key at [https://pinata.cloud](http://pinata.cloud)
2. Clone the repo
   ```sh
   git clone https://github.com/almoloo/luxo
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a .env file in the root named `.env` and fill it with the following data
   ```js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<SOME_RANDOM_TEXT>
   NEXT_PUBLIC_RPC_MAINNET=https://rpc.lukso.gateway.fm
   NEXT_PUBLIC_RPC_TESTNET=https://rpc.testnet.lukso.gateway.fm
   NEXT_PUBLIC_PINATA_GATEWAY=<YOUR_PINATAT_GATEWAY>
   NEXT_PUBLIC_PINATA_API_KEY=<YOUR_PINATAT_API_KEY>
   NEXT_PUBLIC_PINATA_SECRET_KEY=<YOUR_PINATAT_SECRET_KEY>
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Add image support to edit profile
- [ ] Add short link support

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Ali Mousavi - [@almoloo](https://twitter.com/almoloo) - amousavig@icloud.com

Project Link: [https://github.com/almoloo/luxo](https://github.com/almoloo/luxo)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: readme/screenshot-1.png
[product-screenshot-2]: readme/screenshot-2.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
