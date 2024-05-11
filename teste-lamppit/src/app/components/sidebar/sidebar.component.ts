import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  dropdownStates: boolean[] = [];

  constructor() {
    for (let i = 0; i < 8; i++) {
      this.dropdownStates.push(false);
    }
  }

  toggleDropdown(index: number): void {
    this.dropdownStates[index - 1] = !this.dropdownStates[index - 1];
  }

  isDropdownOpen(index: number): boolean {
    return this.dropdownStates[index - 1];
  }
}
