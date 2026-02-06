const TEMPLATE_MAP = {
  ritro_welcome: {
    header: "Welcome To Ritro Ai",
    body: [
      "Hi {{1}}, welcome to Ritro AI",
      "We’re happy to have you with us."
    ]
  }
};

const renderTemplateMessage = (template) => {
  if (!template?.name) return null;

  const def = TEMPLATE_MAP[template.name];
  if (!def) return `[Template: ${template.name}]`;

  let bodyText = def.body.join("\n");

  const bodyComponent = template.components?.find(
    (c) => c.type === "body"
  );

  const parameters = bodyComponent?.parameters || [];

  parameters.forEach((param, index) => {
    if (param?.text) {
      const regex = new RegExp(
        `\\{\\{${index + 1}\\}\\}`,
        "g"
      );

      bodyText = bodyText.replace(regex, param.text);
    }
  });

  return def.header
    ? `${def.header}\n${bodyText}`
    : bodyText;
};

module.exports = { renderTemplateMessage };
