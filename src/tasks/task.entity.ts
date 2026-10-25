import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { TaskStatus } from './task-status.enum';

@Table({ tableName: 'tasks', underscored: true })
export class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'task_id' })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.TODO,
  })
  declare status: TaskStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare dueDate: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}
