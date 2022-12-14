import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private intervalSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    // this.intervalSubscription = interval(1000).subscribe((count: number) => {
    //   console.log({count});
    // });
    const customIntervalObservable = Observable.create(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(count);

        if (count === 2) {
          observer.complete();
        }

        if (count > 3) {
          observer.error(new Error('Count is greater than 3'));
        }
        count++;
      }, 1000);
    });

    this.intervalSubscription = customIntervalObservable
      .pipe(
        filter((data: number) => {
          return data > 0;
        }),
        map((data: number) => {
          return `Round: ${data + 1}`;
        })
      )
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.error(error);
          alert(error.message);
        },
        () => {
          console.log('Completed!');
        }
      );
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }
}
