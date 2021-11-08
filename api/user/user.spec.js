const req = require("supertest");
const should = require("should");
const app = require("../../index");
const models = require("../../models/models.js");
const syncDB = require("../../bin/syncDB");

describe("GET/users는 ", () => {
  const users = [{ name: "elice" }, { name: "chris" }, { name: "bak" }];
  before(() => syncDB());
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    it("유저 객체를 담은 배열로 응답한다.", (done) => {
      req(app)
        .get("/users")
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
    it("최대 limit 개수만큼 응답한다.", (done) => {
      req(app)
        .get("/users?limit=2")
        .end((err, res) => {
          res.body.should.have.lengthOf(2);
          done();
        });
    });
  });
  describe("실패시", () => {
    it("limit이 숫자형이 아니면 400을 응답한다.", (done) => {
      req(app)
        .get("/users?limit=two")
        .expect(400)
        .end(() => done());
    });
  });
});

describe("GET/users/1는", () => {
  describe("성공시", () => {
    it("아이디 1 인 유저개체를 반환한다.", (done) => {
      req(app)
        .get("/users/1")
        .end((err, res) => {
          res.body.should.have.property("id", 1);
          done();
        });
    });
  });
  describe("실패시", () => {
    it("아이디가 숫자가 아닐경우 400으로 응답한다.", (done) => {
      req(app).get("/users/one").expect(400).end(done);
    });
    it("아이디로 유저를 찾을 수 없는 경우 404로 응답한다.", (done) => {
      req(app).get("/users/5").expect(404).end(done);
    });
  });
});

describe("DELETE/users/1", () => {
  describe("성공시", () => {
    it("204를 응답한다.", (done) => {
      req(app).delete("/users/1").expect(204).end(done);
    });
  });
  describe("실패시", () => {
    it("아이디가 숫자가 아닐경우 400를 응답한다.", (done) => {
      req(app).delete("/users/one").expect(400).end(done);
    });
  });
});

describe.only("POST/users", () => {
  const users = [{ name: "elice" }, { name: "chris" }, { name: "bak" }];
  before(() => syncDB());
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    let body;
    let name = "daniel";
    before((done) => {
      req(app)
        .post("/users")
        .send({ name })
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it("생성된 유저객체를 반환한다.", (done) => {
      body.should.have.property("id");
      done();
    });

    it("입력한 name을 반환한다.", (done) => {
      body.should.have.property("name", name);
      done();
    });
  });

  describe("실패시", () => {
    it("name 파라메터 누락시 400을 반환한다.", (done) => {
      req(app).post("/users").send({}).expect(400).end(done);
    });
  });
  it("name이 중복일 경우 409를 반환한다.", (done) => {
    req(app).post("/users").send({ name: "alice" }).expect(409).end(done);
  });
});

describe("PUT/users/:id", () => {
  const name = "din";
  describe("성공시", () => {
    it("변경된 이름을 응답한다.", (done) => {
      req(app)
        .put("/users/3")
        .send({ name })
        .end((err, res) => {
          res.body.should.have.property("name", name);
          done();
        });
    });
  });
  describe("실패시", () => {
    it("id가 정수가 아닌 경우 400을 반환한다.", (done) => {
      req(app).put("/users/1").expect(400).end(done);
    });

    it("name이 없는 경우 400을 반환한다.", (done) => {
      req(app).put("/users/3").send({ name }).expect(400).end(done);
    });

    it("없는 유저인 경우 400을 반환한다.", (done) => {
      req(app).put("/users/999").send({ name }).expect(400).end(done);
    });

    it("이름이 중복인 경우 400을 반환한다.", (done) => {
      req(app).put("/users/1").send({ name: "elice123" }).expect(400).end(done);
    });
  });
});
