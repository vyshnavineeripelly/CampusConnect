const test = require("node:test");
const assert = require("node:assert/strict");

const resourceModulePath = require.resolve("../models/Resource");
const cloudinaryModulePath = require.resolve("../config/cloudinary");
const controllerPath = require.resolve("../controllers/resourceController");

function loadController(mockResource, mockCloudinary) {
  require.cache[resourceModulePath] = {
    id: resourceModulePath,
    filename: resourceModulePath,
    loaded: true,
    exports: mockResource,
  };
  require.cache[cloudinaryModulePath] = {
    id: cloudinaryModulePath,
    filename: cloudinaryModulePath,
    loaded: true,
    exports: mockCloudinary,
  };
  delete require.cache[controllerPath];
  return require(controllerPath);
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

test("non-owner cannot update a resource", async () => {
  const resource = {
    uploadedBy: { toString: () => "owner-id" },
  };
  const controller = loadController(
    { findById: async () => resource },
    { uploader: { destroy: async () => {} } }
  );
  const res = createResponse();

  await controller.updateResource(
    {
      params: { id: "507f1f77bcf86cd799439011" },
      user: { _id: { toString: () => "other-id" } },
      body: { title: "Changed" },
    },
    res
  );

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.message, "You are not allowed to edit this resource");
});

test("non-owner cannot delete a resource", async () => {
  const resource = {
    uploadedBy: { toString: () => "owner-id" },
  };
  const controller = loadController(
    { findById: async () => resource },
    { uploader: { destroy: async () => {} } }
  );
  const res = createResponse();

  await controller.deleteResource(
    {
      params: { id: "507f1f77bcf86cd799439011" },
      user: { _id: { toString: () => "other-id" } },
    },
    res
  );

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.message, "You are not allowed to delete this resource");
});
