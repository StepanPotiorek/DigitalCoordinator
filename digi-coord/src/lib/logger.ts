import pino from "pino"

const isDev = process.env.NODE_ENV === "development"

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "HH:MM:ss" },
    },
  }),
})

export function createRequestLogger(req: { method: string; url: string }) {
  const start = Date.now()
  const requestId = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)

  return {
    requestId,
    info(msg: string, ...args: unknown[]) {
      logger.info({ requestId, method: req.method, url: req.url }, msg, ...args)
    },
    warn(msg: string, ...args: unknown[]) {
      logger.warn({ requestId, method: req.method, url: req.url }, msg, ...args)
    },
    error(msg: string, ...args: unknown[]) {
      logger.error({ requestId, method: req.method, url: req.url }, msg, ...args)
    },
    done(status: number) {
      const duration = Date.now() - start
      logger.info({ requestId, method: req.method, url: req.url, status, duration }, "request completed")
    },
  }
}
