/* tslint:disable */
import {
  Interest
} from '../index';

declare var Object: any;
export interface LikerInterface {
  "id"?: any;
  interests?: Interest[];
}

export class Liker implements LikerInterface {
  "id": any;
  interests: Interest[];
  constructor(data?: LikerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Liker`.
   */
  public static getModelName() {
    return "Liker";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Liker for dynamic purposes.
  **/
  public static factory(data: LikerInterface): Liker{
    return new Liker(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Liker',
      plural: 'Likers',
      path: 'Likers',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        interests: {
          name: 'interests',
          type: 'Interest[]',
          model: 'Interest',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'likerId'
        },
      }
    }
  }
}
