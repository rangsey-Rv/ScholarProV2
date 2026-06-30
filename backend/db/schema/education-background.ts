import { pgTable, integer, varchar, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { applications } from './application';
import { attachments } from './attachment';

export const gradeEnum = pgEnum("grade", ["A", "B", "C", "D", "E", "F"]);
export const educationLevelEnum = pgEnum("education_level", ["high_school", "associate_degree", "bachelor_degree", "master_degree", "other"]);
export const englishCertificateEnum = pgEnum("english_certificate", [
    "yes",
    "no",
    "other"
]);


export const educationBackground = pgTable('education_background', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    appId: integer('app_id')
        .notNull()
        .references((): any => applications.id), // Foreign key referencing student.id
    educationLevel: educationLevelEnum('education_level').notNull(),
    major: varchar('major', { length: 255 }),
    institutionName: varchar('institution_name', { length: 255 }).notNull(),
    currentYear: integer('current_year'),
    academicYear: varchar('academic_year', { length: 255 }).notNull(),
    highSchoolName: varchar('high_school_name', { length: 255 }).notNull(),
    schoolLocation: varchar('school_location', { length: 255 }).notNull(),
    overallGrade: gradeEnum('overall_grade').notNull(),
    mathGrade: gradeEnum('math_grade').notNull(),
    englishGrade: gradeEnum('english_grade').notNull(),
    grade12CertificateId: integer('grade12_certificate_id')
        .notNull()
        .references((): any => attachments.id),
    hasEnglishCertificate: englishCertificateEnum('has_english_certificate').notNull(),
    englishCertificateId: integer('english_certificate_id')
        .notNull()
        .references((): any => attachments.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
