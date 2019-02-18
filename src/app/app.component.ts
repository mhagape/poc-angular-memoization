import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    {{ getComputedValue(name) }} <input [(ngModel)]="value" />
    <button (click)="changeName()">Change the Name</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public name = 'Bob';
  public value: string;

  @Memoize
  public getComputedValue(name: string): string {
    console.log(`Computing value for input ${name}`);
    return btoa(name);
  }

  public changeName(): void {
    this.name = this.value;
  }
}

// simplified from https://blog.angularindepth.com/how-to-improve-angular-performance-by-just-adding-just-8-characters-877bde708ddd
export function Memoize(target, key, descriptor) {
  const oldFunction = descriptor.value;
  const newFunction = memoizeOne(oldFunction);
  descriptor.value = function() {
    return newFunction.apply(this, arguments);
  };
}

// or just use https://www.npmjs.com/package/memoize-one
function memoizeOne(f) {
  let lastInput, lastOutput;
  let firstTime = true;

  return v => {
    if (firstTime || lastInput !== v) {
      firstTime = false;
      lastInput = v;
      lastOutput = f(v);
    }

    return lastOutput;
  };
}
