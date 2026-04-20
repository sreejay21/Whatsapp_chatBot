const groupRepo = require("../repositories/whatsappGroup.repository");
const responseHandler = require("../utils/response.handler");
const { encrypt } = require("../crypto/crypto.util");

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    let { members } = req.body;
    const logoFile = req.file;

    try {
      members = JSON.parse(members);
      if (!Array.isArray(members)) {
        throw new Error("Members must be an array");
      }
    } catch (err) {
      return responseHandler.badRequest(res, "Members must be valid JSON array");
    }

    const encryptedCreatorId = encrypt(req.user.nameid);

    let logoUrl = null;
    if (logoFile) {
      logoUrl = `${process.env.BASE_URL}/uploads/${logoFile.filename}`;
    }

    const group = await groupRepo.createGroup({
      name,
      members, 
      createdBy: encryptedCreatorId,
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
      res
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
      groupName: group?.name,
      logo: group?.logo,
      membersCount: group?.members?.length || 0,

      members: group.members.map((member) => {
        const isWhatsapp = member.source === "WHATSAPP";

        return {
          userId: isWhatsapp
            ? encrypt(member.userRefId?.toString())
            : member.userId, 

          name: member?.name || "",
          role: member?.role || "",
          source: member?.source || "",

          // optional extra info for WhatsApp only
          encryptedPhone: isWhatsapp
            ? member?.userRefId?.encryptedPhone || ""
            : "",
        };
      }),

      createdAt: group.createdAt,
    }));

    return responseHandler.Ok(
      {
        groups,
        pagination: result.pagination,
      },
      res
    );
  } catch (err) {
    console.error("List all groups error:", err);
    return responseHandler.internalServerError(
      res,
      "Failed to fetch groups"
    );
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
