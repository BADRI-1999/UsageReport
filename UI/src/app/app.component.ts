import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MSAL_INSTANCE, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PublicClientApplication } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubscriptionService } from './services/subscription.service';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
 data: any;
  
  
  isInteractionInProgress: boolean | undefined;
  constructor(
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
    private subscriptionService: SubscriptionService
  ) {}


  

  ngOnInit(): void {
    
    console.log("init")
    // Track interaction status using MsalBroadcastService
    this.msalBroadcastService.inProgress$
      .pipe(
        takeUntil(this._destroying$)
      )
      .subscribe((status: InteractionStatus) => {
        this.isInteractionInProgress = status !== InteractionStatus.None;
        console.log("Is interaction in progress:", this.isInteractionInProgress);
      });

     
  }



  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  



}



