import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.hidden]="!isVisible">
      <div class="loading-container">
        <img src="/loading.gif" alt="Cargando..." class="loading-gif">
        <p class="loading-text">Guardando tu información...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
      transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
    }

    .loading-overlay:not(.hidden) {
      opacity: 1;
      pointer-events: all;
      visibility: visible;
      animation: fadeIn 0.3s ease-in;
    }

    .loading-overlay.hidden {
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .loading-container {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
      max-width: 300px;
    }

    .loading-gif {
      width: 120px;
      height: 120px;
      object-fit: contain;
      margin-bottom: 20px;
    }

    .loading-text {
      font-size: 16px;
      color: #333;
      margin: 0;
      font-weight: 500;
    }
  `]
})
export class Loading implements OnChanges {
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
