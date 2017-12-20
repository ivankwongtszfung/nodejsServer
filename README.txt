
we have make multiple pages
the homepage
the redeem
the adminpanel
the product page 

only admin can see all datas and  to crud to the data 

How to run the web application:

  1.  Start mongoDB with an empty data file
    eg. mongod ¡Xdbpath mongoDBdata (where mongoDBdata directory is empty)
  
  2.  Import data by
    mongorestore -d 272Proj ¡§dbData¡¨

  2.   Start web server by
    node server.js