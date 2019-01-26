/* tslint:disable */

declare var Object: any;
export interface TaggerInterface {
  "link": string;
  "passporterInterest": string;
  "id"?: any;
}

export class Tagger implements TaggerInterface {
  "link": string;
  "passporterInterest": string;
  "id": any;
  constructor(data?: TaggerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Tagger`.
   */
  public static getModelName() {
    return "Tagger";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Tagger for dynamic purposes.
  **/
  public static factory(data: TaggerInterface): Tagger{
    return new Tagger(data);
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
      name: 'Tagger',
      plural: 'Taggers',
      path: 'Taggers',
      idName: 'id',
      properties: {
        "link": {
          name: 'link',
          type: 'string'
        },
        "passporterInterest": {
          name: 'passporterInterest',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
