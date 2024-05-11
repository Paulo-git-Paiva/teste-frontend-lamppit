import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { MyApiService } from '../../service/conect.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface ApiResponse {
  snapshotByPortfolio: {
    equity: number;
    valueApplied: number;
    equityProfit: number;
    percentageProfit: number;
    indexerValue: number;
    percentageOverIndexer: number;
  };
  dailyEquityByPortfolioChartData: {
    correctedQuota: number;
    dailyReferenceDate: number;
    movementTypeId: number;
    portfolioProductId: number;
    productName: string;
    value: number;
  }[];
  snapshotByProduct: {
    due: {
      date: string;
      daysUntilExpiration: number;
    };
    fixedIncome: {
      bondType: string;
      name: string;
      portfolioProductId: number;
    };
    hasBalance: number;
    position: {
      equity: number;
      indexerLabel: string;
      indexerValue: number;
      percentageOverIndexer: number;
      portfolioPercentage: number;
      profitability: number;
      valueApplied: number;
    };
    productHasQuotation: number;
  }[];
}

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule, FormsModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BodyComponent implements OnInit {
  dataFromAPI: ApiResponse | undefined;
  pageSize: number = 5;
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  searchTerm$ = new Subject<string>();

  constructor(private myApiService: MyApiService) {}

  ngOnInit(): void {
    this.getApiData();

    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.searchTerm = searchTerm;
        this.applyFilter();
      });
  }

  getApiData(): void {
    this.myApiService.getFixedIncomeClassData().subscribe((data) => {
      this.dataFromAPI = data.data;
      console.log(this.dataFromAPI);
      console.log('acesso', this.dataFromAPI?.snapshotByPortfolio);
      this.totalItems = this.dataFromAPI?.snapshotByProduct.length || 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }

  getPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
    return (
      this.dataFromAPI?.snapshotByProduct.slice(startIndex, endIndex) || []
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  applyFilter(): void {
    if (!this.dataFromAPI || !this.dataFromAPI.snapshotByProduct) {
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();

    if (!searchTermLower) {
      this.totalItems = this.dataFromAPI.snapshotByProduct.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      return;
    }

    const filteredItems = this.dataFromAPI.snapshotByProduct.filter((product) =>
      product.fixedIncome.name.toLowerCase().includes(searchTermLower)
    );

    this.totalItems = filteredItems.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  filterByBondType(bondType: string): void {
    if (!this.dataFromAPI || !this.dataFromAPI.snapshotByProduct) {
      return;
    }

    const filteredItems = this.dataFromAPI.snapshotByProduct.filter(
      (product) => product.fixedIncome.bondType === bondType
    );

    this.totalItems = filteredItems.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  clearFilter(): void {
    this.totalItems = this.dataFromAPI?.snapshotByProduct.length || 0;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
