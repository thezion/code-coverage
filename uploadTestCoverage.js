/*
https://docs.github.com/en/rest/reference/repos#statuses
*/

const fs = require("fs");
const https = require("https");

const report = JSON.parse(fs.readFileSync("./coverage/coverage-summary.json"));

const description = `Lines:${report.total.lines.pct}% Statements:${report.total.statements.pct}% Functions:${report.total.functions.pct}% Branches:${report.total.branches.pct}%`;

const data = new TextEncoder().encode(
  JSON.stringify({
    state: report.total.lines.pct < 80 ? "error" : "success",
    context: "Test Coverage",
    description: description,
  })
);

const options = {
  hostname: "api.github.com",
  port: 443,
  path: `/repos/thezion/code-coverage/statuses/${process.env.CIRCLE_SHA1}`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
    "User-Agent": "NodeJS",
    Authorization:
      "Basic " +
      new Buffer(process.env.GITHUB_USER_AND_TOKEN).toString("base64"),
  },
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();
