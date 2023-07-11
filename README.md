<div id="top"></div>

<div align="center">
 <a href="https://bde.42mulhouse.fr" title="Go to BDE website"><img src="https://img.shields.io/static/v1?label=BDE - La Fregate&message=website&color=BE6144&logo=github&style=for-the-badge" alt="BDE - La Fregate - Website"></a>
 <a href="https://en.wikipedia.org/wiki/2022"><img src="https://img.shields.io/badge/Year-2022-ffad9b?style=for-the-badge&color=yellow" alt="Year - 2022"></a>
  <a href="https://www.linux.org/" title="Go to Linux homepage"><img src="https://img.shields.io/badge/OS-linux-blue?logo=linux&logoColor=white&style=for-the-badge&color=9E59B4" alt="OS - Linux"></a>
  <br/>
 <a href="https://nodejs.org/en" title="Go to NodeJS homepage"><img src="https://img.shields.io/badge/Node.js-^20.2.0-blue?logo=node.js&logoColor=white&style=for-the-badge&color=719960" alt="Package - NodeJS"></a>
 <a href="https://react.dev/" title="Go to React homepage"><img src="https://img.shields.io/badge/React-^18.2.0-blue?logo=react&logoColor=white&style=for-the-badge&color=80D1EF" alt="Package - React"></a>
  <a href="https://www.postgresql.org/" title="Go to Postgresql homepage"><img src="https://img.shields.io/badge/PostgreSQL-^14.8-blue?logo=postgresql&logoColor=white&style=for-the-badge&color=3F6388" alt="DB - PostgreSQL"></a>
</div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a>
    <img src="https://www.42mulhouse.fr/wp-content/uploads/2022/06/logo-42-Mulhouse-white.svg" alt="Logo" width="192" height="80">
  </a>

  <h3 align="center">BDE Website</h3>

  <p align="center">
   <em>Cool website isn't it ?</em><br/>
    First dockerized website of the BDE developped from scratch by <a href="https://github.com/Link-Wolf">Link</a> & <a href="https://github.com/sur4c1">iCARUS</a>, started less than 5 month after started the cursus, way before attempting Inception
    <br />
    <br />
    <a href="https://gitlab.42mulhouse.fr/Link/bde-website/-/issues">Report Bug</a>
    ·
    <a href="https://gitlab.42mulhouse.fr/Link/bde-website/-/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary style="font-size: 1.2em;font-weight: bold">Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a>
		  <ul>
			<li><a href="#docker-prerequisites">Docker</a></li>
		    <li><a href="#local-prerequisites">Local</a></li>
		  </ul>
		</li>
        <li><a href="#installation">Installation</a>
		  <ul>
		    <li><a href="#docker-installation">Docker</a></li>
			<li><a href="#local-installation">Local</a></li>
		  </ul>
		</li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#todo">TODO</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

<!-- ABOUT THE PROJECT -->

## About The Project 🎯

<div align="center">
  <a>
    <img src="https://cdn.discordapp.com/attachments/453159761639112706/1126807216868053104/image.png" alt="home page of the website">
  </a>
</div>
</br>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started 🏃

It's our beloved website so please be kind with it, even if it's not perfect, it's our first website and we are proud of it.
The few next parts will be split in two parts, the first one for a dockerized version and the second one for a non-dockerized version.

### Prerequisites

#### Docker Prequisites

Having Docker installed on your machine is not only a must have but also the only thing you need to run the website, if you don't have it, you can install it by following the instructions on the [official website](https://docs.docker.com/get-docker/).

#### Local Prerequisites

If you don't want to use docker, or prefer to launch it locally to make changes in real time for example, you will need to install the following packages on your machine:

-   [NodeJS](https://nodejs.org/en/)
-   [React](https://react.dev/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Redis](https://redis.io/)

### Installation

**❗️ You'll need to copy the .template.env files as .env files and fill all the values ❗️**

#### Docker Installation

1. Clone the repo

    ```sh
    $> git clone ssh://git@gitlab.42mulhouse.fr:422/Link/bde-website.git
    ```

2. Start it using docker-compose

    ```sh
    $> cd bde-website
    $> docker-compose up --build
    ```

    And that's it, when it's up you can access the website on your browser at the following address: http://localhost:3000

#### Local Installation

You'll first have to create the database within PostgreSQL:

```sh
	$> psql postgres
	=# CREATE DATABASE [your .env database name];
	=# CREATE USER [your .env user name] WITH PASSWORD '[your .env password]';
	=# \q
```

Now you will need to launch the server and the client separately, here are the steps to do so:

1. Clone the repo

    ```sh
    $> git clone ssh://git@gitlab.42mulhouse.fr:422/Link/bde-website.git
    ```

2. Launch Redis in a terminal

    ```sh
    $> cd bde-website
    $> redis-server
    ```

3. Launch the server in a **second** terminal

    ```sh
    $> cd bde-website/server
    $> npm run start
    ```

    You can also use `npm run start:dev` to launch the server in dev mode, it will restart automatically when you make changes to the code.
    <br/>

4. Launch the client in a **third** terminal

    ```sh
    $> cd bde-website/client
    $> npm start
    ```

Be sure to launch the server before the client and to have Redis running in the background, otherwise you will have errors.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage 🚀

<div align="center">
 <a>
   <!-- <img src=TODO: alt="usage example"> -->
 </a>
</div>

Because we admit that you're not that old and/or disconnected, first we'll just list the main features currently available

-   Connection/Registration by using the 42 API
-   Available and current events, with subscription system
-   Window shop
    -   Show the different products available and their informations
        -   Stock
        -   Price
        -   Product composition
        -   Photos
-   Profile page with:
    -   Some of your informations
    -   Subscribed events
    -   And we once planned to add your potentials receipts for example but we never did it
-   Contact page to send a message to the BDE
-   A Ping Pong registration system, to submit the games played in the Cantina, with a ranking system
-   A donation system using Paypal

We won't explain how to use the website step by step, it's pretty intuitive, but we will explain how to use the admin panel, which may not be that intuitive(?)

**To access the admin panel, you need to be logged in with an account that has sufficient `clearance`**

<img align="right" width="auto" height="1000" src="https://cdn.discordapp.com/attachments/907303542438629406/1128283392081936536/image.png">


*   List all the registered users
*   Sort them ascending/descending by:
	*   Login
	*   Name
	*   Surname
	*   Registration date
	*   Last connection date
	*   Authorization level
*   Ping Pong Game management
    *   List all the games submitted
    *   Delete a game
    *   Sort them ascending/descending by:
        *   Date
        *   Score
    *   Filter them by login
*   Event management
    *   List all the events
    *   Delete an event
    *   Modification of an event
    *   Creation of an event
        *   Name
        *   Begin date
        *   End date (or not)
        *   End of subscription date (or not), must be before the end date
        *   Available date, when the event will be visible on the website
        *   Description
        *   Price
        *   Price for premium members (see below "`premium` members")
        *   Number of slots (-42 if there is no limit)
        *   Number of slots for premium members (see below "`premium` members")
        *   Place
        *   A picture to illustrate the event
        *   Checkbox for some infos
            *   Is the event outside of 42
            *   Is the event sponsored (we hope, one day)
            *   Is there any consumption
            *   Is it available for the piscineux
*   Subscriptions management
    *   List all the subscriptions for the given event, showing
        *   The login
        *   The price payed
        *   The date
    *   Delete a subscription
    *   Force subscribe a user to an event
*   Products management
    *   List all the products
    *   Delete a product
    *   Modification of a product
    *   Creation of a product
        *   Name
        *   Description
        *   Price
        *   A picture to illustrate the product
        *   The total stock for this product AND the stock for each size
            *   **We didn't manage to do it properly or manage to connect the website to the google sheet we used to manage our stocks, so it has to be edited for each sale, and if the total stock isn't equal to the sum of all the size's stock, we admit it's a unique size (like the caps). It's really dirty**
*   Logs
    *   For all the logs created by the backend, we only display the warning and errors
    *   Filter them by:
        *   Warn
        *   Error
        *   Admin (if the log was created by an admin action)
        *   Login
        *   Masquing or not the logs created by the admin navigation, because there is specific logs and check by accessing each admin page
    *   Sort them ascending/descending by:
        *   Date
*   Admin management
    *   List all admins
    *   Demote an admin
    *   Promote a user to admin
    *   Bequeath our powers to someone else
        *   The idea here is that the BDE Captain is the only one (with the webmaster) to be able to access this page, manage his admins, but since he can't demote himself, he can bequeath his Captain powers to someone else, and then demote himself
 
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## TODO (and TOFIX) 🚧

Ultimately and honnestly, the website would deserve to be entirely rewrite from scratch, but we (Link & iCARUS) don't have the time to do so, so unless someone wants to do it, we will keep it as it is. And in this case, there are a lot of things to fix and to add, so here is a list of a few things that we would have liked to do:

-   Add a Club page : List of all clubs/commisions, with their description, their members, their events, etc.
-   Upgrade the Ping Pong game submition system, so both players have to validate the score and the winner to avoid cheating
-   Add a system of seasons for the Ping Pong turnament, maybe with rewards
-   Either implements or remove all traces of the `premium` members, which was a thing we had in mind once, where students could pay like a cotisation to have access to some premium features, reductions, access to limited slots events, etc., but we never had the time and the good ideas to implement it properly
-   Improve the Products List design on Home page, so it's easier to add new products in the future
-   Adjust the CGU/CGV according to any changes (and maybe just..adjust it because it could be better? But I -Link- wrote them myself with lot of love so I'm not sure I want to change them myself)
-   Fix the filters button that apply a blur effect on the background, to fit the screen
-   Change the contact system that currently uses an extern API from client-side, to a server-side solution to avoid spam

#### On Admin side specifically

-   Add a way to add, edit and remove clubs/commissions and maybe add a manager for each one who can edit its own club/commission
-   Pages with multiple forms (Events, Products) aren't CSSed properly.
-   Globally, admin pages are either not CSSed on mobile, or not enough, so it's not really user friendly and/or responsive
-   Admin side pannel doesn't extend to the bottom if the page content is taller than the screen and if you scroll down

See the [open issues](https://gitlab.42mulhouse.fr/Link/bde-website/-/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing 🤝

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Same goes if you find a bug, please open an issue with the tag "bug".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact 👤

42born2code Slack and 42Intra:

-   Link - [Link](https://profile.intra.42.fr/users/Link)
-   iCARUS - [iCARUS](https://profile.intra.42.fr/users/iCARUS)

Mail:

-   Link@student.42mulhouse.fr
-   iCARUS@student.42mulhouse.fr

<p align="right">(<a href="#top">back to top</a>)</p>
