const groupRepo = require("../repositories/whatsappGroup.repository");
const responseHandler = require("../utils/response.handler");
const { encrypt } = require("../crypto/crypto.util");
const  { parseMembers } = require("../common/common");




const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const logoFile = req.file;
    const allowedSources = ["WHATSAPP", "TELEGRAM", "SLACK"];

    let members;

    try {
      members = parseMembers(req.body.members);
    } catch (err) {
      return responseHandler.badRequest(res, err.message);
    }

    if (!Array.isArray(members) || members.length === 0) {
      return responseHandler.badRequest(res, "At least one member is required");
    }

    

    members = members.map((m, index) => {
      if (!m.userId && !m.externalUserId) {
        throw new Error(`members[${index}].userId is required`);
      }

      if (!m.name) {
        throw new Error(`members[${index}].name is required`);
      }

      const source = String(m.source || "").toUpperCase();

      if (!allowedSources.includes(source)) {
        throw new Error(
          `members[${index}].source must be WHATSAPP, TELEGRAM, or SLACK`
        );
      }

      return {
        ...m,
        source,
        externalUserId: m.externalUserId || m.userId,
      };
    });

    const encryptedCreatorId = encrypt(req.user.nameid);

    const logoUrl = logoFile
      ? `${process.env.BASE_URL}/uploads/${logoFile.filename}`
      : null;

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
    console.error("Create group error:", err);
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
