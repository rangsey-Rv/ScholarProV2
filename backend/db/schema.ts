import { students } from "./schema/student";
import { applications } from "./schema/application";
import { admins } from "./schema/admin";
import { appliedPrograms } from "./schema/applied-program";
import { attachmentTypeEnum, attachments } from "./schema/attachment";
import { batchStatusEnum, batches } from "./schema/batch";
import { committees } from "./schema/committee";
import { department } from "./schema/department";
import { users } from "./schema/user";
import { settings } from "./schema/settings";
import {
  emailBatchJobStatusEnum,
  emailBatchJobs,
} from "./schema/email-batch-jobs";
import { transactions, transactionStatusEnum, currencyEnum } from "./schema/transaction";


export {
  students,
  applications,
  admins,
  appliedPrograms,
  attachmentTypeEnum,
  attachments,
  batchStatusEnum,
  batches,
  committees,
  department,
  users,
  settings,
  emailBatchJobStatusEnum,
  emailBatchJobs,
  transactions,
  transactionStatusEnum,
  currencyEnum,
};

export type Schema = {
  students: typeof students;
  applications: typeof applications;
  admins: typeof admins;
  appliedPrograms: typeof appliedPrograms;
  attachments: typeof attachments;
  batches: typeof batches;
  committees: typeof committees;
  department: typeof department;
  users: typeof users;
  attachmentTypeEnum: typeof attachmentTypeEnum;
  batchStatusEnum: typeof batchStatusEnum;
  settings: typeof settings;
  emailBatchJobStatusEnum: typeof emailBatchJobStatusEnum;
  emailBatchJobs: typeof emailBatchJobs;
  transactions: typeof transactions;
  transactionStatusEnum: typeof transactionStatusEnum;
  currencyEnum: typeof currencyEnum;
};
