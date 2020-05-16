import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';
import { mergeAll, map, toArray } from 'rxjs/operators';
import {  FormControlName, FormGroup, } from '@angular/forms';


@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
})

export class CountrySelectComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() formControlName: FormControlName;
  control: any;
  countries: any;
  countriesSelect: any;

  constructor() { }

  ngOnInit(): void {
    if (!this.countries) {
      this._getCountries();
    }
  }

  private async _getCountries(): Promise<any> {
    await fetch('assets/countryCodes.json')
      .then(response => response.json())
      .then(data => this.countries = data.codes)
      .catch(error => console.log(error));

    this._buildDropdown();
  }

  private _buildDropdown(): void {
    of(this.countries)
      .pipe(
        mergeAll(),
        map((country: any) => {
          return {
            value: {
              name: Object.values(country)[0],
              code: Object.keys(country)[0],
            },
            viewValue: Object.values(country)[0],
          };
        }),
        toArray(),
      )
      .subscribe((countries: any) => this.countriesSelect = countries);
  }


}
