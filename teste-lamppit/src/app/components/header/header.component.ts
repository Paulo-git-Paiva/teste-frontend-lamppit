import { Component, OnInit } from '@angular/core';
import { MyApiService } from '../../service/conect.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

interface ApiResponse {
  snapshotByPortfolio: {
    equity: number;
    valueApplied: number;
    equityProfit: number;
    percentageProfit: number;
    indexerValue: number;
    percentageOverIndexer: number;
  };
  dailyEquityByPortfolioChartData: any[];
  snapshotByProduct: any[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  dataFromAPI: ApiResponse | undefined;

  constructor(private myApiService: MyApiService) {}

  ngOnInit(): void {
    this.getApiData();
  }

  getApiData(): void {
    this.myApiService.getFixedIncomeClassData().subscribe((data) => {
      this.dataFromAPI = data.data;
      console.log(this.dataFromAPI);
      console.log('acesso', this.dataFromAPI?.snapshotByPortfolio);
    });
  }
}
