const test = require("node:test");
const assert = require("node:assert/strict");

const clubModulePath = require.resolve("../models/Club");
const clubControllerPath = require.resolve("../controllers/clubController");

function loadControllerWithMock(mockClub) {
  require.cache[clubModulePath] = {
    id: clubModulePath,
    filename: clubModulePath,
    loaded: true,
    exports: mockClub,
  };
  delete require.cache[clubControllerPath];
  return require(clubControllerPath);
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("creator leave request returns 403 and does not change members", async () => {
  const creatorId = "creator-user-id";
  const club = {
    createdBy: { toString: () => creatorId },
    members: [
      { toString: () => creatorId },
      { toString: () => "regular-user-id" },
    ],
    saveCalls: 0,
    async save() {
      this.saveCalls += 1;
    },
  };
  const controller = loadControllerWithMock({
    findById: async () => club,
  });
  const res = createResponse();

  await controller.leaveClub(
    { params: { id: "club-id" }, user: { _id: { toString: () => creatorId } } },
    res
  );

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, "Club creators cannot leave their own club");
  assert.equal(club.members.length, 2);
  assert.equal(club.saveCalls, 0);
});

test("regular member leave removes only that member and preserves member count", async () => {
  const creatorId = "creator-user-id";
  const memberId = "regular-user-id";
  const club = {
    createdBy: { toString: () => creatorId },
    members: [
      { toString: () => creatorId },
      { toString: () => memberId },
    ],
    saveCalls: 0,
    async save() {
      this.saveCalls += 1;
    },
  };
  const controller = loadControllerWithMock({
    findById: async () => club,
  });
  const res = createResponse();

  await controller.leaveClub(
    { params: { id: "club-id" }, user: { _id: { toString: () => memberId } } },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.message, "Left club successfully");
  assert.equal(club.members.length, 1);
  assert.equal(club.members[0].toString(), creatorId);
  assert.equal(club.saveCalls, 1);
});
