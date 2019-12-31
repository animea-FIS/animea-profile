const app = require('../server.js');
const request = require('supertest'); //Esta libreria nos permite hacer las peticiones
const db = require('../db.js');
const service = require('../src/services/user.service.js');
const userModel = require('../src/models/user.model.js');

describe("Hello world tests", () => {
    
    it("should do stupid test", () => {
        const a= 5;
        const b= 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });
});



describe("Profile API", () => {
    describe("GET /users", () => {
        beforeAll(()=>{
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
                    ],
                    "rating": "4",
                    "joined_meetings": [
                    ]
                }
            ];
            dbFind = jest.spyOn(userModel, "find");
            /*dbFind.mockImplementation((query, callback) => {
                callback(null, profiles);
            });*/
            dbFind.mockImplementation((query)).then(profiles);

        });

        it("Should return all profiles", () =>{
            return request(app).get("/api/users").then((response)=>{
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    });
});