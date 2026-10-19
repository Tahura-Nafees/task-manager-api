import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  findAll(userId: number, status?: TaskStatus) {
    return this.taskModel.findAll({
      where: { userId, ...(status && { status }) },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(userId: number, id: number) {
    const task = await this.taskModel.findOne({ where: { id, userId } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  create(userId: number, dto: CreateTaskDto) {
    return this.taskModel.create({ ...dto, userId });
  }

  async update(userId: number, id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(userId, id);
    return task.update(dto);
  }

  async remove(userId: number, id: number) {
    const task = await this.findOne(userId, id);
    await task.destroy();
    return { deleted: true };
  }
}
