const fs = require("fs");

const report = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json'));

const summary = `lines:${report.total.lines.pct}% statements:${report.total.statements.pct}% functions:${report.total.functions.pct}% branches:${report.total.branches.pct}%`;

console.log(summary);