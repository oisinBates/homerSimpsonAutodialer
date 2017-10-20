# homerSimpsonAutodialer

As a big fan of *The Simpsons*, one of my first thoughts upon working with Twilio's API was the potential to re-create [Homer Simpon's auto-dialer](https://www.youtube.com/watch?v=uGnZMLf5QOI), and bring a smile to the faces of a small handful of my friends who share a love for the cartoon.* 
Above all else though, it stood as a good excuse to work on a project utilising a Node.js Express app with Twilio's API. 

The Homer Simpsons soundbite was added to an AWS S3 bucket and made publicly accesible via url. 
All other aspects of a call's lifecycle were managed from an Express.js app hosted on an AWS EC2 Ubuntu instance.

*<i>With great power, of course, comes great responsibility. I obviously refrained from spamming and only tested the code, for repetitive synchronous calls, on my own phone</i>
