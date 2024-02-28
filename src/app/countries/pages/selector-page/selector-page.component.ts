import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {Region, SmallCountry} from "../../interfaces/country.interfaces";
import {filter, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public borders: SmallCountry[] = [];
  public countriesByRegion: SmallCountry[] = [];
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {
  }

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange() {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.reset('')),
        tap(() => this.borders = []),
        switchMap(region => this.countriesService.getCountriesByRegion(region)),
      )
      .subscribe(countries => {
        this.countriesByRegion = countries;
      });
  }

  onCountryChange() {
    this.myForm.get('country')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.reset('')),
        filter(value => value.length > 0),
        switchMap(alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap(country => this.countriesService.getCountriesBordersByCode(country.borders)),
      )
      .subscribe(countries => {
        this.borders = countries;
      });
  }


}
