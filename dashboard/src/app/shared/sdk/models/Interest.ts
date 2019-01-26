/* tslint:disable */
import {
  Liker,
  Tagger
} from '../index';

declare var Object: any;
export interface InterestInterface {
  "id"?: any;
  "likerId"?: any;
  "taggerId"?: any;
  liker?: Liker;
  tagger?: Tagger;
}

export class Interest implements InterestInterface {
  "id": any;
  "likerId": any;
  "taggerId": any;
  liker: Liker;
  tagger: Tagger;
  constructor(data?: InterestInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Interest`.
   */
  public static getModelName() {
    return "Interest";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Interest for dynamic purposes.
  **/
  public static factory(data: InterestInterface): Interest{
    return new Interest(data);
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
      name: 'Interest',
      plural: 'Interests',
      path: 'Interests',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "likerId": {
          name: 'likerId',
          type: 'any'
        },
        "taggerId": {
          name: 'taggerId',
          type: 'any'
        },
      },
      relations: {
        liker: {
          name: 'liker',
          type: 'Liker',
          model: 'Liker',
          relationType: 'belongsTo',
                  keyFrom: 'likerId',
          keyTo: 'id'
        },
        tagger: {
          name: 'tagger',
          type: 'Tagger',
          model: 'Tagger',
          relationType: 'belongsTo',
                  keyFrom: 'taggerId',
          keyTo: 'id'
        },
      }
    }
  }
}
