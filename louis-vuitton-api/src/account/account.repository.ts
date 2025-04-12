import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/auth/entities/account.entity';
import { Repository } from 'typeorm';
import { GetAccountDTO } from './DTO/getAccountDTO';

@Injectable()
export class CustomAccountRepository {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  async getAccountWithCondition(
    queries: GetAccountDTO,
  ): Promise<{ data: Account[]; total: number; page: number; limit: number }> {
    const { username, role, status, page, limit } = queries;
    const query = this.accountRepo.createQueryBuilder('account');

    if (username) {
      query.andWhere('LOWER(account.username) LIKE LOWER(:username)', {
        username: `%${username}%`,
      });
    }

    if (
      role?.toLowerCase() === 'admin' ||
      role?.toLowerCase() === 'customer' ||
      role?.toLowerCase() === 'seller'
    ) {
      query.andWhere('LOWER(account.role) = LOWER(:role)', {
        role: role,
      });
    }

    if (status === 'true' || status === 'false') {
      query.andWhere('account.status = :status', {
        status: status,
      });
    }

    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    // const accounts = await query.getMany();
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
    };
  }
}
