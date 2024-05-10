import fs from "fs";
import mustache from "mustache";

const renderTemplate = (path, view) => {
  let template = fs.readFileSync(process.cwd() + path, "utf-8");

  template = mustache.render(template, view);
  return template;
};

export const templateHelper = {
  renderTemplate,
};
