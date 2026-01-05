const groupRepo = require("../repositories/whatsappGroup.repository");
const responseHandler = require("../utils/response.handler");
const { encrypt } = require("../config/crypto.util");

const createGroup = async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    const logoFile = req.file;
    let logoUrl = null;
    const members = normalizeArray(req.body.members);

    if (logoFile) {
      logoUrl = `/uploads/groups/${logoFile.filename}`;
    }

    const group = await groupRepo.createGroup({
      name,
      encryptedMemberIds: members,
      encryptedCreatorId: createdBy,
      logo: logoUrl,
    });

    return responseHandler.Ok(
      {
        success: true,
        data: {
          groupId: encrypt(group._id.toString()),
          name: group.name,
          membersCount: group.members.length,
          logo: group.logo,
        },
      },
      res,
    );
  } catch (err) {
    console.error("Create group error:", err.message);
    return responseHandler.badRequest(res, err.message);
  }
};

const listAllGroups = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await groupRepo.listAllGroups({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    const groups = result.groups.map((group) => ({
      groupId: encrypt(group._id.toString()),
      name: group.name,
      membersCount: group.members.length,
      createdAt: group.createdAt,
    }));

    return responseHandler.Ok(
      {
        groups,
        pagination: result.pagination,
      },
      res,
    );
  } catch (err) {
    console.error("List all groups error:", err);
    return responseHandler.internalServerError(res, "Failed to fetch groups");
  }
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
  }

  throw new Error("Members must be an array");
};

module.exports = { createGroup, listAllGroups };
