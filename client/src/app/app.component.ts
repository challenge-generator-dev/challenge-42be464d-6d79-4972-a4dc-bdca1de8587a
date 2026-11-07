import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button aria-label="Menú principal">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="app-title">Sistema de Estado de Pedidos</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="Notificaciones">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button aria-label="Configuración">
        <mat-icon>settings</mat-icon>
      </button>
    </mat-toolbar>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-title {
      margin-left: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .app-content {
      margin-top: 64px;
      padding: 24px;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'order-status-client';

  constructor() {
    console.log('Aplicación de estado de pedidos iniciada');
  }
}