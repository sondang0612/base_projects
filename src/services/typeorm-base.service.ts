import {
  DeepPartial,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  SaveOptions,
} from "typeorm";
import { EDefaultEmail } from "../constants/default-email.enum";
import { MssqlService } from "./mssql.service";
import { AppError } from "../utils/appError";
import { BaseEntity } from "../database/entities/mssql/base.entity";

type CreateEntityOpts = Partial<{
  userEmail?: string;
  saveOptions: SaveOptions;
}>;

class TypeOrmBaseService<TEntity extends BaseEntity> {
  private _repository: Repository<TEntity> | null = null;
  constructor(public readonly target: EntityTarget<TEntity>) {}

  public get repository(): Repository<TEntity> {
    if (!this._repository) {
      const ds = MssqlService.getDataSource();
      this._repository = ds.getRepository(this.target);
    }
    return this._repository;
  }

  async _create<TCreateDto extends DeepPartial<TEntity>>(
    createDto: TCreateDto,
    opts: CreateEntityOpts = {}
  ): Promise<TEntity> {
    const { saveOptions, userEmail } = opts;

    const entity = this.repository.create(createDto);
    entity.createdBy = userEmail || EDefaultEmail.SYSTEM_GENERATED;

    const newDoc = await this.repository.save(entity, saveOptions);
    return newDoc;
  }

  async _createMany<TCreateDto extends DeepPartial<TEntity>>(
    createDtos: TCreateDto[],
    opts: CreateEntityOpts = {}
  ): Promise<TEntity[]> {
    const { saveOptions } = opts;
    const entities = await this.repository.create(createDtos);

    return await this.repository.save(entities, saveOptions);
  }

  public async _findOneOrFail(
    options: FindOneOptions<TEntity>
  ): Promise<TEntity> {
    const entity = await this._findOne(options);
    if (!entity) {
      throw new AppError(`${this.repository.metadata.name} not found`, 404);
    }
    return entity;
  }

  async _findByIdsOrFail(ids: number[]): Promise<TEntity[]> {
    const entities = await this.repository.findBy({
      id: In(ids),
      isDeleted: false,
    } as FindOptionsWhere<TEntity>);
    if (entities.length === 0) {
      throw new AppError(
        `[${this.repository.metadata.name}] No records found for given IDs`,
        404
      );
    }
    return entities;
  }

  async _findOrCreate<TCreateDto extends DeepPartial<TEntity>>(
    findOptions: FindOneOptions<TEntity>,
    createDto: TCreateDto,
    opts: CreateEntityOpts = {}
  ): Promise<TEntity> {
    let entity = await this._findOne(findOptions);

    if (!entity) {
      entity = await this._create(createDto, opts);
    }

    return entity;
  }

  public async _findOne(
    options: FindOneOptions<TEntity>
  ): Promise<TEntity | null> {
    const entity = await this.repository.findOne({
      ...options,
      where: { ...options.where, isDeleted: false as any },
    });
    return entity;
  }

  async _softDelete(id: number | number[], userEmail?: string): Promise<void> {
    const ids = Array.isArray(id) ? id : [id];

    if (ids.length === 0) {
      return;
    }

    const updateData = {
      isDeleted: true,
      updatedAt: new Date(),
      createdBy: userEmail || EDefaultEmail.SYSTEM_GENERATED,
    };

    await this.repository
      .createQueryBuilder()
      .update(this.repository.metadata.name)
      .set(updateData as any)
      .where("id IN (:...ids)", { ids })
      .execute();
  }
}

export default TypeOrmBaseService;
