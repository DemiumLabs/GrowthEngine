/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Tagger } from '../../models/Tagger';
import { Liker } from '../../models/Liker';
import { Interest } from '../../models/Interest';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Tagger: Tagger,
    Liker: Liker,
    Interest: Interest,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
