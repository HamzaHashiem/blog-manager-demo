import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services';
import { IBar } from 'src/app/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public errorMsg: string = null;
  public single: IBar[] = [];
  public loading = false;

  title = 'Angular Charts';

  // options for the chart
  barPadding = 8;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Users';
  showYAxisLabel = true;
  yAxisLabel = 'Posts Count';
  timeline = true;

  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB'],
  };

  //pie
  showLabels = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.dashboardService.getUsersPostsCount().subscribe(
      (posts) => {
        this.single = posts;
        this.loading = false;
      },
      (err) => {
        this.errorMsg = err;
        this.loading = false;
      }
    );
  }
}
