# d2-assessment-1

Setup The project locally
- Ensure you have Node and Mongo installed in your local machine
* Clone the application:

      $ git clone https://github.com/daisyndungu/d2-assessment-1.git

* install requirements:

      $ npm install
      
* Run the application:

      $ npm start
    
The building blocks are:
  * Node JS
  * MongoDB

EndPoint | Functionality
------------ | -------------
POST /movies | Creates a new movie record
GET /movies | Gets all movies
GET /movies/:id | Gets single movie record
PUT /movies/:id | Updates the specified movie record
DELETE /movies/:id | Deletes the specified movies record
DELETE /movies?category=:category | Deletes movies by category
GET /movies/actors/:actor | Gets a list of movies in the db where the actor has been featured in.
