import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taggerCount'
})
export class TaggerCountPipe implements PipeTransform {

  transform(taggerCounts: any[], interest: string): any {

    let tagger = taggerCounts.find((x:any)=> x.passporterInterest == interest);
    return tagger ? tagger.count:  'undefined';
  }

}
