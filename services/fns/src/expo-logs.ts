// functions/src/logForwarder.ts
import { glog, type LogLevel } from '@repo/core';
import * as functions from 'firebase-functions';

type ExpoLogRequest = {
  level: LogLevel;
  message: string;
  [key: string]: unknown
}

const LOG_LEVEL_MAP: Record<LogLevel, keyof typeof glog> = {
  debug: 'debug',
  info: 'info',
  notice: 'notice',
  warning: 'warning',
  warn: 'warn',
  error: 'error',
  alert: 'alert',
  emerg: 'emerg',
  crit: 'crit',
} as const

export const expo_logs = functions.https.onRequest((req, res) => {
  try {
    const { level, message, ...fields } = req.body as ExpoLogRequest
    
    glog[LOG_LEVEL_MAP[level]](message, fields)
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing log request:', error)
    res.status(400).json({ error: 'Invalid log request' })
  }
})
