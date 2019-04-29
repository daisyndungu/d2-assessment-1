process.env.NODE_ENV = 'test';

const User = require('../src/models/userModel');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const should = chai.should();

chai.use(chaiHTTP);

describe('Users', () => {
    const adminEmail = "admin@gmail.com";
    const testAdmin = {
        firstName: "admin",
        lastName: "admin",
        email: adminEmail,
        permissions: "admin"
    }
    beforeEach((done) => {
        const user = new User(testAdmin);
        user.save(err => {
            done();
        });

    });

    afterEach(function (done) {
        User.deleteMany({}, err => {
            done();
        });
    });

    describe('/POST User', () => {
        it('Add new user', done => {
            let testUser = {
                firstName: "Daisy",
                lastName: "Daisy",
                email: "testdaisy2@gmail.com",
                permissions: "customer"
            }
            chai.request(app)
                .post('/api/v1/admin/users')
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.user.should.have.property('permissions');
                    res.body.user.should.have.property('email');
                    done();
                })
        });
    });

    describe('/POST User', () => {
        it('It should not add same user twice', done => {
            chai.request(app)
                .post('/api/v1/admin/users')
                .send(testAdmin)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        });
    });

    describe('/GET Users', () => {
        it('it should get all users', (done) => {
            chai.request(app)
                .get('/api/v1/admin/users')
                .send({ email: 'admin@gmail.com' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.users.length.should.be.eql(1);
                    res.body.users.should.be.a('array');
                    done();
                });
        });
    });
});