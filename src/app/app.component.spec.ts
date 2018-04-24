import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthComponent } from './auth/auth.component';
import { AppComponent } from './app.component';
import { CreditsComponent } from './credits/credits.component';
import { VoteComponent } from './vote/vote.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedbackComponent } from './vote/feedback/feedback.component';

import { routes } from './app-routing.module';
import { PollComponent } from './vote/poll/poll.component';
import { ResultComponent } from './vote/result/result.component';
import { UserPollsComponent } from './vote/user-polls/user-polls.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthComponent,
        AppComponent,
        CreditsComponent,
        VoteComponent,
        DashboardComponent,
        NavigationComponent,
        FeedbackComponent,
        PollComponent,
        ResultComponent,
        UserPollsComponent
      ],
      imports: [ RouterTestingModule .withRoutes(routes) ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
});
