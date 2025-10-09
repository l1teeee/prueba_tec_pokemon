import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrls: ['./loading.scss']
})
export class Loading implements OnChanges, OnDestroy {
  @Input() show = false;
  @Output() loadingComplete = new EventEmitter<void>();

  isVisible = false;
  private timeoutId: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue === true) {
      this.startLoading();
    }
  }

  startLoading() {
    this.isVisible = true;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.isVisible = false;
      setTimeout(() => {
        this.loadingComplete.emit();
      }, 300);
    }, 4000);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
