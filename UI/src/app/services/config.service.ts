import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";


export interface Configuration{
    auth:AuthConfiguration
}
interface AuthConfiguration{
    client_id: string
    tenant_id: string
    subscription_id: string
    redirectUri: string
    cacheLocation: string
    storeAuthStateInCookie: boolean
    scopes: string[]
  }
  

@Injectable({
    providedIn:'root'
})
export class ConfigService{
    config: Configuration = {} as Configuration;
    configUrl = "./assets/config.json"
    constructor(private http:HttpClient){

    }

    loadConfig(handler: HttpBackend) {
        console.log("loading Config")
        var http = new HttpClient(handler)
        
        let result = http.get(this.configUrl)
        return firstValueFrom(result).then((config:any)=>
          {
            console.log("Got configuration", config)
            this.config = config
          }
    
        ).catch((error)=>{
          console.error("Error getting Configuration", error)
        })
          
          
      }
    




}