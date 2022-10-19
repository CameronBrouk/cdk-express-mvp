const fs = require('fs')

const injectBashEnvironment = (env) => {
  const variablesList = Object.entries(env).map(
    ([key, value]) => `${key}=${value}`,
  )
  const stream = fs.createWriteStream('./.env', { flags: 'a' })
  variablesList.forEach((variable) => {
    stream.write(variable + '\n')
  })
  stream.end()
}
injectBashEnvironment(process.env)
