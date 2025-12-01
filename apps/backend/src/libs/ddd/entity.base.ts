import { Guard } from '@libs/guards/primitive.guard';

import {
  ArgumentNotProvidedException,
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '../exceptions';

import { DateValueObject } from './date.value-object';
import { UUID } from './uuid.value-object';

export type AggregateID = UUID;

export interface BaseEntityProps {
  id: AggregateID;
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}

export interface CreateEntityProps<T> {
  id: AggregateID;
  props: T;
  createdAt: DateValueObject;
  updatedAt?: DateValueObject;
}

export abstract class Entity<EntityProps> {
  constructor({ id, createdAt, updatedAt, props }: CreateEntityProps<EntityProps>) {
    this.setId(id);
    this.validateProps(props);
    const now = DateValueObject.fromDate(new Date());
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this.props = props;
    this.validate();
  }

  protected readonly props: EntityProps;

  /**
   * ID is set in the concrete entity implementation to support
   * different ID types depending on your needs.
   * For example it could be a UUID for aggregate root,
   * and shortid / nanoid for child entities.
   */
  protected abstract _id: AggregateID;

  private readonly _createdAt: DateValueObject;

  private _updatedAt: DateValueObject;

  get id(): AggregateID {
    return this._id;
  }

  private setId(id: AggregateID): void {
    this._id = id;
  }

  get createdAt(): DateValueObject {
    return this._createdAt;
  }

  get updatedAt(): DateValueObject {
    return this._updatedAt;
  }

  static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  /**
   *  Checks if two entities are the same Entity by comparing ID field.
   * @param object Entity
   */
  public equals(object?: Entity<EntityProps>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }

    return this.id ? this.id === object.id : false;
  }

  /**
   * Returns entity properties.
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  /**
   * There are certain rules that always have to be true (invariants)
   * for each entity. Validate method is called every time before
   * saving an entity to the database to make sure those rules are respected.
   */
  public abstract validate(): void;

  private validateProps(props: EntityProps): void {
    const MAX_PROPS = 50;

    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Entity props should not be empty');
    }
    if (typeof props !== 'object') {
      throw new ArgumentInvalidException('Entity props should be an object');
    }
    if (Object.keys(props ?? {}).length > MAX_PROPS) {
      throw new ArgumentOutOfRangeException(
        `Entity props should not have more than ${MAX_PROPS} properties`,
      );
    }
  }
}
