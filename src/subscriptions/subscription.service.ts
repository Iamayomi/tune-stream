import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionDto } from './dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  public async createSubcription(data: SubscriptionDto): Promise<Subscription> {
    const planExists = await this.subscriptionRepository.findOne({
      where: { plan: data.plan },
    });

    if (planExists) throw new ConflictException('plan has already exist');

    const subscription = this.subscriptionRepository.create(data);

    return this.subscriptionRepository.save(subscription);
  }

  public async getAllPlan(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }

  public async delPan(planId: number): Promise<DeleteResult> {
    const plan = await this.subscriptionRepository.findOne({
      where: { id: planId },
    });
    if (!plan)
      throw new NotFoundException(`Plan with this ID ${planId} not found`);

    return await this.subscriptionRepository.delete(planId);
  }

  public async getAPlan(planId: number): Promise<Subscription> {
    const plan = await this.subscriptionRepository.findOne({
      where: { id: planId },
    });
    if (!plan)
      throw new NotFoundException(`Plan with this ID ${planId} not found`);

    return plan;
  }
}
