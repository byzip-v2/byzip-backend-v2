import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BugReportStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum BugReportSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum BugReportErrorType {
  UNKNOWN = 'unknown',
  CLIENT_ERROR = 'client_error', // 4xx 에러
  SERVER_ERROR = 'server_error', // 5xx 에러
  NETWORK_ERROR = 'network_error',
  RUNTIME_ERROR = 'runtime_error',
  VALIDATION_ERROR = 'validation_error',
  SYNTAX_ERROR = 'syntax_error',
  REFERENCE_ERROR = 'reference_error',
  TYPE_ERROR = 'type_error',
}

@Entity('bug_reports')
export class BugReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  errorStack?: string;

  @Column({
    type: 'enum',
    enum: Object.values(BugReportErrorType),
    default: BugReportErrorType.UNKNOWN,
  })
  errorType: BugReportErrorType;

  @Column({ nullable: true })
  errorCode?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({
    type: 'enum',
    enum: Object.values(BugReportStatus),
    default: BugReportStatus.OPEN,
  })
  status: BugReportStatus;

  @Column({
    type: 'enum',
    enum: Object.values(BugReportSeverity),
    default: BugReportSeverity.MEDIUM,
  })
  severity: BugReportSeverity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  assigneeId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
