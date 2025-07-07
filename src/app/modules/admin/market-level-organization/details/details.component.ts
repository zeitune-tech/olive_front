import { Component, Input } from "@angular/core";

@Component({
    selector: "app-market-level-organization-details",
    templateUrl: "./details.component.html",
})
export class MarketLevelOrganizationDetailsComponent {

    @Input() data: any;

    
    constructor() {
        // Initialization logic can go here if needed
    }
}