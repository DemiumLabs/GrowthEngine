import { Component } from '@angular/core';
import { InterestApi, Interest, TaggerApi, Tagger } from './shared/sdk';
import { LoopBackConfig } from './shared/sdk/index';
import { environment } from 'src/environments/environment.prod';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  fields = {"fields":["passporterInterest"]};
  filter = {"offset":0,"limit": 2500, "include":{"relation":"tagger","scope":{"fields":["passporterInterest"]}}};
  itemsPerPage = 2500;
  data :any[];
  taggerCounts: any[];
  interests:Interest[] = [];
  pageSeek = 0;
  pages = 0;


  constructor(
    private interestApi:InterestApi,
    private taggersApi:TaggerApi
  ){
    LoopBackConfig.setBaseURL(environment.route);


  }

  nextPage(){
    this.filter.offset = this.pageSeek * this.itemsPerPage;
    this.interestApi  
    .find(this.filter)
    .subscribe((interests:Interest[])=>{
      
      this.interests = this.interests.concat(interests);
      this.dataProcess(this.interests);
      if(interests.length == this.itemsPerPage){
        this.pageSeek++;
        this.nextPage();
      }
    })
    
  }

  ngOnInit(){
    this.interestApi
      .count()
        .subscribe((data:{count:number})=>{
            this.pages = Math.floor(data.count / this.itemsPerPage);
            this.nextPage();
        })
      
  
    this.taggersApi
      .find(this.fields)
      .subscribe((taggers:Tagger[])=>{
        this.taggerCounts = taggers.reduce((l:any[],x:Tagger)=>{
          var el = l.find(e=>e.passporterInterest == x.passporterInterest);
          if(el) el.count++;
          else l.push({passporterInterest:x.passporterInterest,count:1});
          return l;
        },[]);
      })
  
  }


    dataProcess(interests:Interest[]){
      this.data = interests
      .reduce((last,x:Interest)=>{  
            var el = last.find(e=>e.passporterInterest == x.tagger.passporterInterest); 
            if(el) {
                var li = el.likers.find((e=>e.liker == x.likerId));
                if(li) li.count++;
                else el.likers.push({liker:x.likerId,count:1});
            } 
            else last.push({passporterInterest:x.tagger.passporterInterest,likers:[{liker:x.likerId,count:1}]}); 
            return last  
      },[])
      .map((x)=>{
            x.tops = x.likers.reduce((l,x)=>{
                var el = l.find(e=>e.count == x.count);
                if(el) el.quantity++;
                else l.push({count:x.count,quantity:1});
                return l;
            },[])
            .sort((a,b) => b.count - a.count)
            return x;
      })
    }
}
