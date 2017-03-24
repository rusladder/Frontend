<p align="center">
  <img src="https://raw.githubusercontent.com/GolosChain/tolstoy/gh-pages/images/golosdev.png" alt="Golos API Portal" width="226">
  <br>
  <br>
  
</p>

<p align="center">Welcome to the <a href="https://golos.io" target="_blank">Golos</a> API and Developer Docs.</p>

<p align="center"><img src="https://raw.githubusercontent.com/GolosChain/tolstoy/gh-pages/images/preview.png" width=700 alt="\"></p>

<p align="center">The Live Golos API Developer docs can be viewed at<a href="https://goloschain.github.io/docs-api" target="_blank"> golos.io API docs</a></p>
------------------------------

Golos is the social media platform where everyone gets paid for creating and curating content.

The following API documents provide details on how to interact with the Steem blockchain database API which can get information on accounts, content, blocks and much more!

### Installing Locally
------------------------------

Golos docs are built with the great [slate](https://github.com/lord/slate) framework.  Slate supports markdown for editing our API documentation. 

1. Clone this repository to your hard drive with `git clone https://github.com/GolosChain/docs-api.git`
2. `cd docs-api`
3. Initialize and start Slate. You can either do this locally, or with Vagrant:

```shell
# either run this to run locally
bundle install
bundle exec middleman server

# OR run this to run with vagrant
vagrant up
```

4. The docs should now be viewable at `http://localhost:4567/`

### Contributing and Publishing New Updates
------------------------------

1.  Commit your changes locally
2.  Make sure your origin remote is set to `https://github.com/GolosChain/docs-api`
3.  Git push origin master
4.  Run ./deploy.sh