import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { CronExpressionParser } from 'cron-parser';

const prisma = new PrismaClient();

interface AppwriteContext {
  res: {
    send: (body: string, statusCode?: number) => any;
  };
  log: (message: any) => void;
  error: (message: any) => void;
}

// Appwrite function entry point
export default async ({ res, log, error }: AppwriteContext) => {
  try {
    const monitors = await prisma.monitor.findMany({
      where: { isActive: true },
    });

    if (monitors.length === 0) {
      log('No active monitors to check.');
      return res.send('No active monitors to check.', 200);
    }

    log(`Found ${monitors.length} active monitors to check.`);

    for (const monitor of monitors) {
      try {
        const now = new Date();
        if (monitor.lastChecked) {
          const interval = CronExpressionParser.parse(monitor.interval, {
            currentDate: monitor.lastChecked,
          });
          const nextRun = interval.next().toDate();
          if (now < nextRun) {
            log(`Skipping check for ${monitor.name}, not due yet.`);
            continue;
          }
        }

        const start = Date.now();
        const response = await fetch(monitor.url);
        const duration = Date.now() - start;
        const code = response.status;

        await prisma.check.create({
          data: {
            monitorId: monitor.id,
            statusCode: code,
            responseTime: duration,
          },
        });

        await prisma.monitor.update({
          where: { id: monitor.id },
          data: {
            status: code >= 200 && code < 300 ? 'UP' : 'DOWN',
            lastChecked: new Date(),
          },
        });
        log(`Checked ${monitor.name} (${monitor.url}): Status ${code}`);
      } catch (err: any) {
        error(`Error checking monitor ${monitor.name}: ${err.message}`);
        await prisma.check.create({
          data: { monitorId: monitor.id, statusCode: 0, responseTime: 0 },
        });

        await prisma.monitor.update({
          where: { id: monitor.id },
          data: { status: 'DOWN', lastChecked: new Date() },
        });
      }
    }
    return res.send('All monitors checked successfully.', 200);
  } catch (err: any) {
    error(`A critical error occurred: ${err.message}`);
    return res.send('An error occurred during execution.', 500);
  }
};
