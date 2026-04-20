
const parseMembers = (members) => {
  if (!members) throw new Error("Members is required");

  if (Array.isArray(members)) return members;

  if (typeof members === "string") {
    try {
      return JSON.parse(members);
    } catch (err) {
      throw new Error("Members must be a valid JSON array string");
    }
  }

  throw new Error("Members must be an array");
};

module.exports = {
    parseMembers
}
