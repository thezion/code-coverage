const fs = require("fs");

const report = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json'));

const description = `lines:${report.total.lines.pct}% statements:${report.total.statements.pct}% functions:${report.total.functions.pct}% branches:${report.total.branches.pct}%`;

const https = require('https')

const data = new TextEncoder().encode(
  JSON.stringify({
      "state":"success",
      "context": "Test Coverage",
      "description": description
  })
)

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: `/repos/thezion/code-coverage/statuses${process.env.CIRCLE_SHA1}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Basic ' + new Buffer(process.env.GITHUB_USER_AND_TOKEN).toString('base64')
  }
}

console.log(`Requesting ${options.path}`)
console.log(`Psw = ${process.env.GITHUB_USER_AND_TOKEN.substr(0,10)}`)

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()