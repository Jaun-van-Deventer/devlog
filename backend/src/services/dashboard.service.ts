import { getCollection } from "../lib/mongodb.js";
import type { IssueDocument, ProjectDocument, CodingSessionDocument } from "../lib/mongoModels.js";

export const dashboardService = {
  async summary() {
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const projects = await getCollection<ProjectDocument>("projects");
    const issues = await getCollection<IssueDocument>("issues");
    const sessions = await getCollection<CodingSessionDocument>("sessions");

    const [totalProjects, openIssues, resolvedIssues, hoursAggregate, recentSessions, issuesBySeverity] = await Promise.all([
      projects.countDocuments(),
      issues.countDocuments({ status: { $in: ["OPEN", "IN_PROGRESS"] } }),
      issues.countDocuments({ status: "RESOLVED" }),
      sessions.aggregate([{ $match: { date: { $gte: weekStart } } }, { $group: { _id: null, totalHours: { $sum: "$hours" } } }]).toArray(),
      sessions.find({}).sort({ date: 1 }).limit(8).toArray(),
      issues.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }]).toArray(),
    ]);

    const recentSessionsWithProjects = await Promise.all(
      recentSessions.map(async (session) => {
        const project = await projects.findOne({ id: session.projectId });
        return {
          ...session,
          date: session.date.toISOString(),
          project: project ? { ...project, createdAt: project.createdAt.toISOString() } : undefined,
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
