import type { Context } from 'hono'
import { seedFirestore } from '@repo/core';
import { getErrorMessage } from '@repo/common';

export const getHandler = async (c: Context) => 
   seedFirestore()
  .then(() => 
    c.json(
    {
      message: 'Database seeded successfully',
    },
    200
  ))
  .catch((e) => c.json({ 
    message: getErrorMessage(e)
  }, 500))
