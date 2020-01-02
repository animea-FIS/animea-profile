const app = require('../server.js');
const request = require('supertest'); //Esta libreria nos permite hacer las peticiones
const db = require('../db.js');
const service = require('../src/services/user.service.js');
const UserModel = require('../src/models/user.model.js');

describe("Testing Jest configuration", () => {
    it("Stupid test to check that jest configuration is OK", () => {
        const a= 5;
        const b= 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });
});



describe("Profile API", () => {
    beforeEach(()=>{
        const profiles = [
            {
                "id": "5df9cfb41c9d44000047b034",
                "name": "Antonio",
                "username": "Antrodart19",
                "email": "antrodart@mail.com",
                "location": "Sevilla",
                "birthdate": "1996-11-07",
                "bio": "Me encanta ir al mangafest",
                "presentationVideo": "https://www.youtube.com/watch?v=OYlzcXA3LxI",
                "profilePic": "https://www.art-madrid.com/image/cPsf44XRNuGPskHnm/0/luz-imagen-sonido-festival-mira-son.jpg",
                "ratings": [
                    {
                        "value": "1",
                        "rater_user_id": "5df9cfb41c9d44000047b035"
                    }
                ],
                "rating": "1",
                "joined_meetings": [
                    "5e07be8b1c9d4400001ced56", 
                    "5e07b8e31c9d4400001ced4e",
                    "5e07bc821c9d4400001ced52"
                ]
            },
            {
                "id": "5df9cfb41c9d44000047b035",
                "name": "Pepe Gotera",
                "username": "pepegot",
                "email": "pepegot@gmail.com",
                "location": "Madrid",
                "birthdate": "1962-05-03",
                "bio": "Me gusta mucho el manga y el anime",
                "presentationVideo": "https://www.youtube.com/watch?v=LUO5qhpD2pA",
                "profilePic": "https://static1.eldiariomontanes.es/www/multimedia/201905/11/media/cortadas/pepegoteras1-kKQH-U80177317922D7D-624x585@Diario%20Montanes.png",
                "ratings": [
                ],
                "rating": "0",
                "joined_meetings": [
                    "5e07be8b1c9d4400001ced56", 
                    "5e07b8e31c9d4400001ced4e",
                    "5e07bc821c9d4400001ced52"
                ]
            }
        ];
        dbFind = jest.spyOn(UserModel, "find");
        dbFind.mockImplementation((query, callback) => {
            callback(null, profiles);
        });
        
        dbFindOne = jest.spyOn(UserModel, "findOne");
        dbFindOne.mockImplementation((query, callback) => {
            callback(null, profiles[0]);
        });
    });

    describe("GET /users", () => {
        it("Should return all profiles", () =>{
            return request(app).get("/api/users").then((response)=>{
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
            });
        });
    });

    describe("GET /profile/:id", () => {
        it("Should return profile with id 5df9cfb41c9d44000047b034", () =>{
            return request(app).get("/api/profile/5df9cfb41c9d44000047b034").then((response)=>{
                expect(response.status).toBe(200);
                expect(response.body.id).toBe("5df9cfb41c9d44000047b034");
                expect(response.body.name).toBe("Antonio");
            });
        });
    });

    describe("PUT /profile", () => {
        const oldUser = {
            "id": "5df9cfb41c9d44000047b034",
            "name": "Homer Simpson",
            "username": "homerjsimpson",
            "email": "homer@springfield.com",
            "location": "Springfield",
            "birthdate": "1960-05-05",
            "bio": "Me gusta la pizza, la panceta y, sobre todo, la cerveza.",
            "presentationVideo": "https://www.youtube.com/watch?v=uMyuSHewmks",
            "profilePic": "https://cadena100-cdnmed.agilecontent.com/resources/jpg/6/8/1546649423386.jpg",
            "ratings": [
                {
                    "value": "1",
                    "rater_user_id": "5df9cfb41c9d44000047b034"
                }
            ],
            "rating": "1",
            "joined_meetings": [
                "5e07ad761c9d4400001ced4a",
                "5e07bd431c9d4400001ced53"
            ]
        };
        const newUser = {
            "id": "5df9cfb41c9d44000047b034",
            "name": "Marge Simpson",
            "location": "Paris"
        }
        let dbUpdateOne;

        beforeEach(() => {
            dbUpdateOne = jest.spyOn(UserModel, "updateOne");
            dbUpdateOne.mockImplementation((query, parameters, callback) => {
                callback(true);
            });
            dbFindOne2 = jest.spyOn(UserModel, "findOne");
            dbFindOne2.mockImplementation((query, callback) => {
                callback(null, oldUser);
            });
        });

        it("Modifies user profile", () =>{
            return request(app).put("/api/profile/").send(newUser).then((response)=>{
                expect(response.status).toBe(200);
            });
        });
    });

    describe("POST /newProfile", () => {
        const user = {
            "id": "5df9cfb41c9d44000047b036",
            "name": "Homer Simpson",
            "username": "homerjsimpson",
            "email": "homer@springfield.com",
            "location": "Springfield",
            "birthdate": "1960-05-05",
            "bio": "Me gusta la pizza, la panceta y, sobre todo, la cerveza.",
            "presentationVideo": "https://www.youtube.com/watch?v=uMyuSHewmks",
            "profilePic": "https://cadena100-cdnmed.agilecontent.com/resources/jpg/6/8/1546649423386.jpg",
            "ratings": [
                {
                    "value": "1",
                    "rater_user_id": "5df9cfb41c9d44000047b034"
                }
            ],
            "rating": "1",
            "joined_meetings": [
                "5e07ad761c9d4400001ced4a",
                "5e07bd431c9d4400001ced53"
            ]
        };
        let dbInsert;
        let dbFindOne3;
        beforeEach(() => {
            dbInsert = jest.spyOn(UserModel, "create");        
            dbFindOne3 = jest.spyOn(UserModel, "findOne");
            dbFindOne3.mockImplementation((query, callback) => {
                callback(null, null);
            });
        });
        it("Should add a new profile if everything is fine", () =>{
            dbInsert.mockImplementation((p, callback) => {
                callback(false, null);
            });

            return request(app).post('/api/newProfile').send(user).then((response) => {
                expect(response.statusCode).toBe(201);
            });
        });

        it("Should return error if there is a problem", () =>{
            dbInsert.mockImplementation((p, callback) => {
                callback(true, null);
            });
            return request(app).post('/api/newProfile').send(user).then((response) => {
                expect(response.statusCode).toBe(406);
            });
        });

        it("Should return error if an user with that id already exists", () =>{
            dbInsert.mockImplementation((p, callback) => {
                callback(false, null);
            
            });
            dbFindOne2.mockImplementation((query, callback) => {
                callback(null, user);
            });
            return request(app).post('/api/newProfile').send(user).then((response) => {
                expect(response.statusCode).toBe(406);
            });
        });
    });

    describe("GET /rating/profile/:id", () => {
        it("Should return rating of profile with id 5df9cfb41c9d44000047b034", () =>{
            return request(app).get("/api/rating/profile/5df9cfb41c9d44000047b034").then((response)=>{
                expect(response.status).toBe(200);
                expect(response.body.rating).toBe("1.0");
            });
        });
    });

    describe("GET /user/:id/joinedMeetings", () => {
        it("Should return joined meetings of user with id 5df9cfb41c9d44000047b034", () =>{
            return request(app).get("/api/user/5df9cfb41c9d44000047b034/joinedMeetings").then((response)=>{
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(response.body[0]).toBe("5e07be8b1c9d4400001ced56");
                expect(response.body[1]).toBe("5e07b8e31c9d4400001ced4e");
                expect(response.body[2]).toBe("5e07bc821c9d4400001ced52");
            });
        });
    });

    describe("PUT /rating/profile/:id", () => {
        const user = {
            "id": "5df9cfb41c9d44000047b036",
            "name": "Homer Simpson",
            "username": "homerjsimpson",
            "email": "homer@springfield.com",
            "location": "Springfield",
            "birthdate": "1960-05-05",
            "bio": "Me gusta la pizza, la panceta y, sobre todo, la cerveza.",
            "presentationVideo": "https://www.youtube.com/watch?v=uMyuSHewmks",
            "profilePic": "https://cadena100-cdnmed.agilecontent.com/resources/jpg/6/8/1546649423386.jpg",
            "ratings": [
                {
                    "value": "1",
                    "rater_user_id": "5df9cfb41c9d44000047b034"
                }
            ],
            "rating": "1",
            "joined_meetings": [
                "5e07ad761c9d4400001ced4a",
                "5e07bd431c9d4400001ced53"
            ]
        };
        const newRating = {
                "my_id": "5df9cfb41c9d44000047b035",
                "rating_value": "5"
            }
        
        let dbUpdateOne2;

        beforeEach(() => {
            dbUpdateOne2 = jest.spyOn(UserModel, "updateOne");
            dbUpdateOne2.mockImplementation((query, parameters, callback) => {
                callback(null, true);
            });
            dbFindOne4 = jest.spyOn(UserModel, "findOne");
            dbFindOne4.mockImplementation((query, callback) => {
                callback(null, user);
            });
        });

        it("Add a rating to the user", () =>{
            return request(app).put("/api/rating/profile/5df9cfb41c9d44000047b036").send(newRating).then((response)=>{
                expect(response.status).toBe(201);
            });
        });
    });

    describe("PUT /user/:id/joinsMeeting/:meetingId", () => {
        const user = {
            "id": "5df9cfb41c9d44000047b036",
            "name": "Homer Simpson",
            "username": "homerjsimpson",
            "email": "homer@springfield.com",
            "location": "Springfield",
            "birthdate": "1960-05-05",
            "bio": "Me gusta la pizza, la panceta y, sobre todo, la cerveza.",
            "presentationVideo": "https://www.youtube.com/watch?v=uMyuSHewmks",
            "profilePic": "https://cadena100-cdnmed.agilecontent.com/resources/jpg/6/8/1546649423386.jpg",
            "ratings": [
                {
                    "value": "1",
                    "rater_user_id": "5df9cfb41c9d44000047b034"
                }
            ],
            "rating": "1",
            "joined_meetings": [
                "5e07ad761c9d4400001ced4a",
                "5e07bd431c9d4400001ced53"
            ]
        };
        
        let dbUpdateOne3;

        beforeEach(() => {
            dbUpdateOne3 = jest.spyOn(UserModel, "updateOne");
            dbUpdateOne3.mockImplementation((query, parameters, callback) => {
                callback(null, true);
            });
            dbFindOne5 = jest.spyOn(UserModel, "findOne");
            dbFindOne5.mockImplementation((query, callback) => {
                callback(null, user);
            });
        });

        it("Add a meeting to the user", () =>{
            return request(app).put("/api/user/5df9cfb41c9d44000047b036/joinsMeeting/5e07bd431c9d4400001ced98").then((response)=>{
                expect(response.status).toBe(200);
            });
        });
        it("Add a meeting to a user that already joined that meeting", () =>{
            return request(app).put("/api/user/5df9cfb41c9d44000047b036/joinsMeeting/5e07ad761c9d4400001ced4a").then((response)=>{
                expect(response.status).toBe(400);
            });
        });
    });

    describe("PUT /user/:id/joinsMeeting/:meetingId", () => {
        const user = {
            "id": "5df9cfb41c9d44000047b036",
            "name": "Homer Simpson",
            "username": "homerjsimpson",
            "email": "homer@springfield.com",
            "location": "Springfield",
            "birthdate": "1960-05-05",
            "bio": "Me gusta la pizza, la panceta y, sobre todo, la cerveza.",
            "presentationVideo": "https://www.youtube.com/watch?v=uMyuSHewmks",
            "profilePic": "https://cadena100-cdnmed.agilecontent.com/resources/jpg/6/8/1546649423386.jpg",
            "ratings": [
                {
                    "value": "1",
                    "rater_user_id": "5df9cfb41c9d44000047b034"
                }
            ],
            "rating": "1",
            "joined_meetings": [
                "5e07ad761c9d4400001ced4a",
                "5e07bd431c9d4400001ced53"
            ]
        };
        
        let dbUpdateOne4;

        beforeEach(() => {
            dbUpdateOne4 = jest.spyOn(UserModel, "updateOne");
            dbUpdateOne4.mockImplementation((query, parameters, callback) => {
                callback(null, true);
            });
            dbFindOne6 = jest.spyOn(UserModel, "findOne");
            dbFindOne6.mockImplementation((query, callback) => {
                callback(null, user);
            });
        });

        it("Remove a meeting from the user", () =>{
            return request(app).put("/api/user/5df9cfb41c9d44000047b036/leavesMeeting/5e07ad761c9d4400001ced4a").then((response)=>{
                expect(response.status).toBe(200);
            });
        });
        it("Remove a meeting from a user that has not joined that meeting", () =>{
            return request(app).put("/api/user/5df9cfb41c9d44000047b036/leavesMeeting/5e07ad761c9d4400001ced98").then((response)=>{
                expect(response.status).toBe(400);
            });
        });
    });
});