import { prisma } from "../lib/prisma.js";

export const dashboardService = {
  async summary() {
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [totalProjects, openIssues, resolvedIssues, hoursAggregate, recentSessions, issuesBySeverity] =
      await Promise.all([
        prisma.project.count(),
        prisma.issue.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
        prisma.issue.count({ where: { status: "RESOLVED" } }),
        prisma.codingSession.aggregate({ where: { date: { gte: weekStart } }, _sum: { hours: true } }),
        prisma.codingSession.findMany({
          orderBy: { date: "asc" },
          take: 8,
          include: { project: true },
        }),
        prisma.issue.groupBy({ by: ["severity"], _count: true }),
      ]);

    return {
      totalProjects,
      openIssues,
      resolvedIssues,
      hoursLoggedThisWeek: hoursAggregate._sum.hours ?? 0,
      recentSessions,
      issuesBySeverity: issuesBySeverity.map((item) => ({ severity: item.severity, count: item._count })),
    };
  },
};
