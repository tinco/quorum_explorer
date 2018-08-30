# Quorum Explorer

Find me at [http://www.quorumexplorer.com](http://www.quorumexplorer.com)

Contact me on [keybase](https://keybase.io/tinco)

Contributions welcome!

## TODO / Design

### Frontpage

The frontpage should introduce the functionality of the app, enable users to
easily navigate to the section they like and give a quick glance at the health
of the network and the status of the crawler.

1. Add last crawled date
2. Add history graphs for node counts
3. Maybe there's more single value health indicators we could put on the frontpage.

### Organization page

1. The organization page should have aggregated versions of almost all data that
can be seen on its node pages.
2. The organization page should motivate visitors that are organization administrators
to make their data more complete.

### Node page

1. The validator page should be renamed to be the node page, as not every node
is a validator.
2. There should be graphs for history of various properties of nodes.
3. The trust network of the node should be visualized. (also further removed)
4. There could be some calculations for the network impact of the node as per
nodestar.
5. Number it fails/agrees with network
6. View cascading effects if a specific validator were to go offline

### Health page

There should be concrete information about the status of the network. It should
be immediate technical status information as well as general trust information.

I've collected suggestions from the community as well as SDF members, an incomplete list below:

1. SCP protocol statistics
    1. Amount of messages per second
    2. Amount of dissenters/disagreements
2. Overlay characteristics
    1. Connection capacity
    2. Network weak points
    3. How often nodes see "missing" nodes
    4. Network resiliency (i.e. how many servers can go offline before the network halts)
    5. Node uptime percentage and current status
3. Network client statistics
    1. Geographical distribution
    2. Protocol versions
    3. Client strings
4. Trust characteristics
    1. The interdependencies between nodes (Quorum Intersection?)
