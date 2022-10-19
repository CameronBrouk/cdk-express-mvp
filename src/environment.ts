import { z, ZodError } from 'zod'
import * as dotenv from 'dotenv'
import chalk from 'chalk'

const getMissingErrors = (variableName: string) => {
  const message = `You are missing the '${variableName}' environment variable.`
  return {
    description: message,
    required_error: message,
    invalid_type_error: message,
  }
}

const errorText = (name: string) => {
  const line = chalk.bgRed('===============================')
  const title = `${line} ${chalk.red(name)} ${line}`
  const end = `${line}=${name
    .split('')
    .map((_) => '=')
    .join('')}=${line}`
  return [title, chalk.bgRed(end)]
}
const [title, end] = errorText('Environment Variables Missing')

export const getZodError = (zodError: ZodError) =>
  [
    '\n',
    title,
    ...zodError.issues.map((issue) =>
      chalk.redBright(
        `- You are missing an environment variable: ${chalk.blue(
          issue.path[0] || 'unknown',
        )}`,
      ),
    ),
    'SOLUTIONS:',
    chalk.green(`- LOCAL DEV: add these variables to the .env file`),
    chalk.green(`- DOCKER:  add these these variables to the Dockerfile`),
    chalk.green(`- GITHUB ACTIONS:  ?`),
    end,
  ].join('\n')

const environment = z.object({
  PORT: z.string().transform((port) => Number(port)),
})

const check = () => {
  const check = environment.safeParse(dotenv.config().parsed)
  if (!check.success) {
    throw new Error(getZodError(check.error))
  }
  return check.data
}

export const env = check()
