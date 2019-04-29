process.env.NODE_ENV = 'test';

const User = require('../src/models/userModel');
const Movie = require('../src/models/movieModel');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const should = chai.should();

describe('Movies', () => {
    const adminEmail = "admin@gmail.com";
    const staffEmail = "staff@gmai.com"
    const customerEmail = "customer@gmai.com"
    var date = new Date();
    const testMovie = {
        title: "infinity war",
        description: "Hmm, epic",
        mainActors: ["Thanos", "Thor"],
        category: "fiction",
        startDate: "4/15/2018",
        endDate: date.setDate(date.getDate() + 1),
        showingNo: 6,
        poster: 'poster.png',
        showingTime: ["09:30", "12:00", "13:00"],
    }
    before((done) => {
        const testAdmin = {
            firstName: "admin",
            lastName: "admin",
            email: adminEmail,
            permissions: "admin"
        }
        const testCustomer = {
            firstName: "admin",
            lastName: "admin",
            email: customerEmail,
            permissions: "customer"
        }
        const testStaff = {
            firstName: "admin",
            lastName: "admin",
            email: staffEmail,
            permissions: "staff"
        }
        const admin = new User(testAdmin);
        admin.save();
        const staff = new User(testStaff);
        staff.save();
        const customer = new User(testCustomer);
        customer.save(err => {
            done();
        });
    });

    afterEach((done) => {
        Movie.deleteMany({}, err => {
            done();
        });
    });

    after((done) => {
        User.deleteMany({}, err => {
            done();
        });
    });
    describe('/POST Movie', () => {
        it('It should not add new movie without providing admin email', done => {
            chai.request(app)
                .post('/api/v1/admin/movies')
                .send(testMovie)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                })
        });
    });

    describe('/POST Movie', () => {
        it('It should not add new movie with staff permission', done => {
            chai.request(app)
                .post('/api/v1/admin/movies')
                .send({ ...testMovie, email: staffEmail})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        });
    });

    describe('/POST Movie', () => {
        it('It should not add new movie with customer permission', done => {
            chai.request(app)
                .post('/api/v1/admin/movies')
                .send({ ...testMovie, email: customerEmail })
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        });
    });

    describe('/POST Movie', () => {
        it('It should add new movie with admin permissions', done => {
            chai.request(app)
                .post('/api/v1/admin/movies')
                .send({...testMovie, email: adminEmail})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.movies.should.have.property('startDate');
                    res.body.movies.should.have.property('title');
                    res.body.movies.should.have.property('endDate');
                    done();
                })
        });
    });

    describe('/GET Movies', () => {
        it('It should get all movies - returns an empty array since there are not movies added yet', done => {
            chai.request(app)
            .get('/api/v1//admin/movies')
            .send({email: staffEmail })
            .end((err, res) =>{
                res.should.have.status(200);
                res.body.movies.should.be.a('array');
                res.body.movies.length.should.be.eql(0);
                done();
            })
        });
    });


    describe('/GET Movies', () => {
        it('It should get all movies - staff permissions', (done) => {
            const movie = new Movie(testMovie);
            movie.save((err, movie) => {
                chai.request(app)
                .get('/api/v1/admin/movies')
                .send({...movie, email: staffEmail})
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.movies.should.be.a('array');
                    res.body.movies.length.should.be.eql(1);
                    done();
                });
            });
        });
    });

    describe('/GET Movies', () => {
        it('It should get all movies - admin permissions', (done) => {
            const movie = new Movie(testMovie);
            movie.save((err, movie) => {
                chai.request(app)
                    .get('/api/v1/admin/movies')
                    .send({ ...movie, email: adminEmail })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.movies.should.be.a('array');
                        res.body.movies.length.should.be.eql(1);
                        done();
                });
            });
        });
    });

    describe('/GET Movies', () => {
        it('It should not get all movies(unathorized user) - customer permissions', (done) => {
            const movie = new Movie(testMovie);
            movie.save((err, movie) => {
                chai.request(app)
                    .get('/api/v1/admin/movies')
                    .send({ ...movie, email: customerEmail })
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });
    });

    describe('/GET Movies', () => {
        it('It should get all active movies(endDate is not in the past) - customer permissions', (done) => {
            const movie = new Movie(testMovie);
            movie.save((err, movie) => {
                chai.request(app)
                    .get('/api/v1/movies')
                    .send({ ...movie, email: customerEmail })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.movies.should.be.a('array');
                        res.body.movies.length.should.be.eql(1);
                        done();
                    });
            });
        });
    });

    describe('/GET/:id movie', () => {
        it('It should get one movie', (done) => {
            const movie = new Movie(testMovie);
            movie.save((err, movie) => {
                chai.request(app)
                    .get('/api/v1/movies/' + movie.id)
                    .send({ ...movie, email: staffEmail })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.movie.should.be.a('object');
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id movie', () => {
        it('It should no delete if endDate if greater than now', (done) => {
            const movie = new Movie(testMovie);
            movie.save((err, movie) => {
                chai.request(app)
                    .delete('/api/v1/admin/movies/' + movie.id)
                    .send({ ...movie, email: adminEmail })
                    .end((err, res) => {
                        res.should.have.status(500);
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id movie', () => {
        it('It should delete a movie - admin permission', (done) => {
            // set endDate to yesterday
            const movie = new Movie({
                title: "infinity war",
                description: "Hmm, epic",
                mainActors: ["Thanos", "Thor"],
                category: "fiction",
                startDate: "4/15/2018",
                endDate: date.setDate(date.getDate() - 1),
                showingNo: 6,
                poster: 'poster.png',
                showingTime: ["09:30", "12:00", "13:00"],
            });
            movie.save((err, movie) => {
                chai.request(app)
                    .delete('/api/v1/admin/movies/' + movie.id)
                    .send({ ...movie, email: adminEmail })
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
        });
    });


    describe('/DELETE/:id movie', () => {
        it('It should not delete a movie - staff permission', (done) => {
            // set endDate to yesterday
            const movie = new Movie({
                title: "infinity war",
                description: "Hmm, epic",
                mainActors: ["Thanos", "Thor"],
                category: "fiction",
                startDate: "4/15/2018",
                endDate: date.setDate(date.getDate() - 1),
                showingNo: 6,
                poster: 'poster.png',
                showingTime: ["09:30", "12:00", "13:00"],
            });
            movie.save((err, movie) => {
                chai.request(app)
                    .delete('/api/v1/admin/movies/' + movie.id)
                    .send({ ...movie, email: staffEmail })
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id movie', () => {
        it('It should not delete a movie - customer permission', (done) => {
            // set endDate to yesterday
            const movie = new Movie({
                title: "infinity war",
                description: "Hmm, epic",
                mainActors: ["Thanos", "Thor"],
                category: "fiction",
                startDate: "4/15/2018",
                endDate: date.setDate(date.getDate() - 1),
                showingNo: 6,
                poster: 'poster.png',
                showingTime: ["09:30", "12:00", "13:00"],
            });
            movie.save((err, movie) => {
                chai.request(app)
                    .delete('/api/v1/admin/movies/' + movie.id)
                    .send({ ...movie, email: customerEmail })
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });
    });

});