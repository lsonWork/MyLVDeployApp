import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private wareRepo: Repository<Warehouse>,
  ) {}

  async changeQuantity(idProduct: number, newQuantity: number): Promise<void> {
    const warehouse = await this.wareRepo.findOneBy({
      product: { id: idProduct, isDeleted: false },
    });
    if (!warehouse) {
      throw new NotFoundException(`No product with id ${idProduct}`);
    }
    warehouse.quantity = newQuantity;
    await this.wareRepo.save(warehouse);
    return;
  }
}
