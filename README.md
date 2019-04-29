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
POST /admin/movies | Creates a new movie record - admin access
GET /admin/users | Gets all users
PUT /admin/movies/:id | Updates the specified movie record - admin access
PUT /admin/movies/:id/showings | Updates showing number and times of the specified movie record - admin/staff access
DELETE /admin/movies/:id | Deletes the specified movies record - admin access
DELETE /admin/movies?category=:category | Deletes movies by category -admin access
GET /admin/movies | Gets all movies including those that are no longer showing
POST /user | Creates a new user
GET /movies/:id | Gets single movie record
GET /movies/actors/:actor | Gets a list of movies in the db where the actor has been featured in.
