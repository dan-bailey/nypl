# nypl
Initially I was going to do something with the NYPL Digital Collection API.  I didn't find anything inspiring in it -- odd, given my love of books.  Anyway, I then had an interesting idea for stuff to do with the weather.gov API, which was far more interesting.

# where I went wrong/what to fix
* I don't know why, but I should have declared a class of City...
* I should have uncoupled the "find the observation station" from "get the observations"...
* I should have written logic to better handle international cities
* For the purposes of making this more streamlined, I should have delivered it with more-generic background imagery

# sticky spots
* Each observation station seems to report conditions differently, which makes adding the icon a little more difficult; I kludged a solution for this by repeating the icon SVG over and over with different names

# future updates
* Getting the city-specific imagery updated.
