import { getCollection } from "../lib/mongodb.js";
import { ownedFilter } from "../lib/ownership.js";
import type { IssueDocument, ProjectDocument, CodingSessionDocument } from "../lib/mongoModels.js";

export const dashboardService = {
  async summary(ownerId: string) {
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const projects = await getCollection<ProjectDocument>("projects");
    const issues = await getCollection<IssueDocument>("issues");
    const sessions = await getCollection<CodingSessionDocument>("sessions");

    const [totalProjects, openIssues, resolvedIssues, hoursAggregate, recentSessions, issuesBySeverity] = await Promise.all([
      projects.countDocuments(ownedFilter(ownerId)),
      issues.countDocuments(ownedFilter(ownerId, { status: { $in: ["OPEN", "IN_PROGRESS"] as const } })),
      issues.countDocuments(ownedFilter(ownerId, { status: "RESOLVED" as const })),
      sessions.aggregate([
        { $match: ownedFilter(ownerId, { date: { $gte: weekStart } }) },
        { $group: { _id: null, totalHours: { $sum: "$hours" } } },
      ]).toArray(),
      sessions.find(ownedFilter(ownerId)).sort({ date: -1 }).limit(8).toArray(),
      issues.aggregate([
        { $match: ownedFilter(ownerId) },
        { $group: { _id: "$severity", count: { $sum: 1 } } },
      ]).toArray(),
    ]);

    const recentSessionsWithProjects = await Promise.all(
      recentSessions.map(async (session) => {
        const project = await projects.findOne(ownedFilter(ownerId, { id: session.projectId }));
        const { _id: _sessionObjectId, ownerId: _sessionOwnerId, ...sessionData } = session;
        return {
          ...sessionData,
          date: session.date.toISOString(),
          project: project
            ? {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                createdAt: project.createdAt.toISOString(),
              }
            : undefined,
        };
      }),
    );

    return {
      totalProjects,
      openIssues,
      resolvedIssues,
      hoursLoggedThisWeek: hoursAggregate[0]?.totalHours ?? 0,
      recentSessions: recentSessionsWithProjects,
      issuesBySeverity: issuesBySeverity.map((item) => ({ severity: item._id, count: item.count })),
    };
  },
};
