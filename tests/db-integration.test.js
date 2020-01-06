const UserTest = require('../src/models/user-test.model');
const mongoose = require('mongoose');
const db = require('../db');

describe('User DB connection', () => {
    beforeAll(()=>{
        return db.connect();
    });

    it('Inserts a new user in the db', (done) => {
        const user = new UserTest({
            id: "5df9cfb41c9d44000047b020",
            name: "Nombre test",
            username: "usernametest",
            twitterUsername: "twitterTest",
            email: "email@mail.com",
            location: "Sevilla",
            birthdate: "1996-11-06T23:00:00.000+00:00",
            bio: "Bio",
            presentationVideo: "https://www.youtube.com/watch?v=u9WgtlgGAgs",
            profilePic: "https://estaticos.elperiodico.com/resources/jpg/6/8/ciencia-del-universo-1530540262286.jpg",
            rating: 0,
            joined_meetings:[],
            ratings:[]
        });
        user.save((err, user) => {
            expect(err).toBeNull();
            UserTest.find({}, (err, users) => {
                expect(users.length).toEqual(1);
                done();
            })
        })
    });

    it('updates an user in the db', (done) => {
        const userId = {id: "5df9cfb41c9d44000047b020"};
        const updatedUser = {name: "Updated name", username: 'Updated username'};
        UserTest.findOneAndUpdate(userId, updatedUser, function () {
            UserTest.find({}, (err, users) => {
                expect(users.length).toEqual(1);
                expect(users[0].name).toEqual("Updated name");
                expect(users[0].username).toEqual('Updated username');
                done();
          });
        });
    });

    it('Deletes an user in db', (done) => {
        const user = {id: "5df9cfb41c9d44000047b020"};
        UserTest.findOneAndRemove(user, (err) => {
            expect(err).toBeNull();
            UserTest.find({}, (err, users) => {
                expect(users.length).toEqual(0);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropCollection('userTest', () => {
            mongoose.connection.close(done);
        });
    });
})