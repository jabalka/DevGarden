import { Injectable } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history: string[] = [];
  private currentPage: number = 1;

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.history.push(event.url);
      }
    });
   }

   public getPreviousUrl(): string {
    return this.history.length > 1 ? this.history[this.history.length - 2] : '/';
  }

  public setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  public getCurrentPage(): number {
    return this.currentPage;
  }

  public clearCurrentPage() {
    this.currentPage = 1;
  }

  public clearHistory(): void {
    this.history = [];
  }
}
