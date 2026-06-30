// import express from 'express';
// import { db } from '@db';
// import { examSessions } from '@db/schema/exam-session';
// import { examSessionCommittees } from '@db/schema/exam-session-committee';
// import { committees } from '@db/schema/committee';
// import { exams } from '@db/schema/exam';
// import { applications } from '@db/schema/application';
// import { students } from '@db/schema/student';
// import { subjects } from '@db/schema/subject';
// // import { batches } from '@db/schema/batch';
// import { eq } from 'drizzle-orm';
// import { interviewSelection } from '@db/schema/Interview-selection';

// const router = express.Router();

// // GET /exam-sessions?batchId=&date=
// router.get('/exam-sessions', async (req, res) => {
//     try {
//         const { batchId, date } = req.query;
//         let q = db.select().from(examSessions) as any;
//         if (batchId) q = q.where(eq(examSessions.batchId, Number(batchId)));
//         if (date) q = q.where(eq(examSessions.examDate, new Date(String(date))));
//         const rows = await q;
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ error: 'failed to fetch sessions', detail: String(err) });
//     }
// });

// // GET /exam-sessions/:id  -> session + committees
// router.get('/exam-sessions/:id', async (req, res) => {
//     try {
//         const id = Number(req.params.id);
//         const session = await db.select().from(examSessions).where(eq(examSessions.id, id)).limit(1);
//         if (!session.length) return res.status(404).json({ error: 'session not found' });

//         const committeesRows = await db
//             .select({
//                 id: committees.id,
//                 name: committees.name,
//             })
//             .from(examSessionCommittees)
//             .where(eq(examSessionCommittees.examSessionId, id))
//             .leftJoin(committees, eq(committees.id, examSessionCommittees.committeeId));

//         res.json({ session: session[0], committees: committeesRows });
//     } catch (err) {
//         res.status(500).json({ error: 'failed to fetch session', detail: String(err) });
//     }
// });


// // GET /exams?studentId=&sessionId=

// router.get('/exams', async (req, res) => {
//     try {
//         const { studentId, sessionId } = req.query;

//         // Get exams with student, application, session, subject, and interview slot details
//         let query = db
//             .select({
//                 examId: exams.id,
//                 examSessionId: exams.examSessionId,
//                 examStatus: exams.status,
//                 totalScore: exams.totalScore,
//                 // Application details
//                 applicationId: applications.id,
//                 applicationStatus: applications.status,
//                 // Student details
//                 studentId: students.id,
//                 studentNameEn: students.nameEn,
//                 studentNameKh: students.nameKh,
//                 studentEmail: students.email,
//                 studentPhone: students.phoneNumber,
//                 // Exam session details
//                 examDate: examSessions.examDate,
//                 startTime: examSessions.startTime,
//                 endTime: examSessions.endTime,
//                 sessionStatus: examSessions.status,
//                 // Subject details
//                 subjectId: subjects.id,
//                 subjectName: subjects.subjectName,
//                 // Interview slot details
//                 slotStart: interviewSelection.slotStart,
//                 slotEnd: interviewSelection.slotEnd,
//             })
//             .from(exams)
//             .leftJoin(applications, eq(applications.id, exams.appId))
//             .leftJoin(students, eq(students.id, applications.studentId))
//             .leftJoin(examSessions, eq(examSessions.id, exams.examSessionId))
//             .leftJoin(subjects, eq(subjects.id, examSessions.subjectId))
//             .leftJoin(interviewSelection, eq(interviewSelection.appId, applications.id));

//         if (studentId) {
//             query = query.where(eq(students.id, Number(studentId))) as any;
//         }
//         if (sessionId) {
//             query = query.where(eq(exams.examSessionId, Number(sessionId))) as any;
//         }

//         const rows = await query;

//         // Group exams by student and application
//         const grouped = rows.reduce((acc: any, row: any) => {
//             const key = `${row.studentId}-${row.applicationId}`;

//             if (!acc[key]) {
//                 acc[key] = {
//                     student: {
//                         id: row.studentId,
//                         nameEn: row.studentNameEn,
//                         nameKh: row.studentNameKh,
//                         email: row.studentEmail,
//                         phoneNumber: row.studentPhone,
//                     },
//                     application: {
//                         id: row.applicationId,
//                         status: row.applicationStatus,
//                     },
//                     exams: []
//                 };
//             }

//             const examData: any = {
//                 id: row.examId,
//                 examSessionId: row.examSessionId,
//                 status: row.examStatus,
//                 totalScore: row.totalScore,
//                 subject: {
//                     id: row.subjectId,
//                     name: row.subjectName,
//                 },
//                 examDate: row.examDate,
//                 sessionStatus: row.sessionStatus,
//             };

//             // For interviews (subjectId = 3), use individual slot times from interviewSelection
//             if (row.subjectId === 3 && row.slotStart && row.slotEnd) {
//                 examData.interview = {
//                     startTime: row.slotStart,
//                     endTime: row.slotEnd,
//                 };
//             } else {
//                 // For written exams, use session times
//                 examData.startTime = row.startTime;
//                 examData.endTime = row.endTime;
//             }

//             acc[key].exams.push(examData);

//             return acc;
//         }, {});

//         // Convert to array
//         const result = Object.values(grouped);

//         res.json(result);
//     } catch (err) {
//         res.status(500).json({ error: 'failed to fetch exams', detail: String(err) });
//     }
// });

// // GET /exam-sessions/:id/details -> detailed session info with students, committees, subject
// router.get('/exam-sessions/:id/details', async (req, res) => {
//     try {
//         const examSessionId = Number(req.params.id);

//         // Get exam session with subject details
//         const sessionData = await db
//             .select({
//                 sessionId: examSessions.id,
//                 batchId: examSessions.batchId,
//                 examDate: examSessions.examDate,
//                 startTime: examSessions.startTime,
//                 endTime: examSessions.endTime,
//                 sessionStatus: examSessions.status,
//                 subjectId: subjects.id,
//                 subjectName: subjects.subjectName,
//             })
//             .from(examSessions)
//             .leftJoin(subjects, eq(subjects.id, examSessions.subjectId))
//             .where(eq(examSessions.id, examSessionId))
//             .limit(1);

//         if (!sessionData.length) {
//             return res.status(404).json({ error: 'exam session not found' });
//         }

//         const session = sessionData[0];

//         // Get committees assigned to this session
//         const committeesData = await db
//             .select({
//                 id: committees.id,
//                 name: committees.name,
//             })
//             .from(examSessionCommittees)
//             .leftJoin(committees, eq(committees.id, examSessionCommittees.committeeId))
//             .where(eq(examSessionCommittees.examSessionId, examSessionId));

//         // Get students enrolled in this session with their interview slots
//         const studentsData = await db
//             .select({
//                 studentId: students.id,
//                 studentNameEn: students.nameEn,
//                 studentNameKh: students.nameKh,
//                 studentEmail: students.email,
//                 examId: exams.id,
//                 examStatus: exams.status,
//                 totalScore: exams.totalScore,
//                 applicationId: applications.id,
//                 // Interview slot times from interviewSelection table
//                 slotStart: interviewSelection.slotStart,
//                 slotEnd: interviewSelection.slotEnd,
//             })
//             .from(exams)
//             .leftJoin(applications, eq(applications.id, exams.appId))
//             .leftJoin(students, eq(students.id, applications.studentId))
//             .leftJoin(interviewSelection, eq(interviewSelection.appId, applications.id))
//             .where(eq(exams.examSessionId, examSessionId))
//             .orderBy(interviewSelection.slotStart); // Order by interview slot time

//         const isInterview = session.subjectId === 3;

//         // Build response
//         const response: any = {
//             session: {
//                 id: session.sessionId,
//                 batchId: session.batchId,
//                 examDate: session.examDate,
//                 status: session.sessionStatus,
//                 subject: {
//                     id: session.subjectId,
//                     name: session.subjectName,
//                 },
//             },
//             committees: committeesData.map(c => ({
//                 id: c.id,
//                 name: c.name,
//             })),
//             students: studentsData.map(s => {
//                 const studentData: any = {
//                     id: s.studentId,
//                     nameEn: s.studentNameEn,
//                     nameKh: s.studentNameKh,
//                     email: s.studentEmail,
//                     exam: {
//                         id: s.examId,
//                         status: s.examStatus,
//                         totalScore: s.totalScore,
//                     },
//                     applicationId: s.applicationId,
//                 };

//                 // Add interview slot if it exists
//                 if (isInterview && s.slotStart && s.slotEnd) {
//                     studentData.interviewSlot = {
//                         startTime: s.slotStart,
//                         endTime: s.slotEnd,
//                     };
//                 }

//                 return studentData;
//             }),
//         };

//         // Add overall session timing
//         if (isInterview) {
//             response.session.sessionTiming = {
//                 startTime: session.startTime,
//                 endTime: session.endTime,
//             };
//         } else {
//             response.session.startTime = session.startTime;
//             response.session.endTime = session.endTime;
//         }

//         res.json(response);
//     } catch (err) {
//         res.status(500).json({ error: 'failed to fetch session details', detail: String(err) });
//     }
// });

// export default router;