import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taxName'
})
export class TaxNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
        var taxes = [

          {code:'1a', option: 'Photography Landscape'},
          {code:'1b', option: 'Photography IG'},
          {code:'2a', option: 'Sport Mountain'},
          {code:'2c', option: 'Sport Snow'},
          {code:'2b', option: 'Sport Water'},
          {code:'2c', option: 'Sport Relax'},
          {code:'2d', option: 'Sport Extreme'},
          {code:'3a', option: 'Food Random'},
          {code:'3b', option: 'Food Vegan'},
          {code:'4a', option: 'Culture Asia'},
          {code:'4b', option: 'Culture Europe'},
          {code:'4c', option: 'Culture South America'},
          {code:'4d', option: 'Culture North America'},
          {code:'4e', option: 'Culture Africa'},
          {code:'4f', option: 'Culture Polar'},
          {code:'5a', option: 'Fashion'},
          {code:'6a', option: 'Eco Traveling'}

      ];

      let tax = taxes.find(tax=>tax.code == value);


      return tax ? tax.option : 'undefined';
  }

}
