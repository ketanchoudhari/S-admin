import { Directive, Input, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Sort } from './sort';

@Directive({
  selector: '[appSort]'
})
export class SortDirective {

  @Input() appSort: Array<any>;
  constructor(private renderer: Renderer2, private targetElem: ElementRef) { }

  @HostListener("click")
  sortData() {
    // Create Object of Sort Class
    const sort = new Sort();
    // Get Reference Of Current Clicked Element
    const elem = this.targetElem.nativeElement;
    // Get In WHich Order list should be sorted by default it should be set to desc on element attribute
    const order = elem.getAttribute("data-order");
    // Get The Property Type specially set [data-type=date] if it is date field
    const type = elem.getAttribute("data-type");
    // Get The Property Name from Element Attribute
    const property = elem.getAttribute("data-name");
    const cls = elem.getAttribute("class");

    if (order === "desc") {
      this.appSort.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "asc");
      if (cls === "sort_desc") {
        elem.setAttribute("class", "sort_asc");
      }
      else if(cls === "border-l sort_desc"){
        elem.setAttribute("class", "border-l sort_asc");
      }
      else if(cls==="header align-L sort_desc"){
        elem.setAttribute("class", "header align-L sort_asc");
      }
      else{
        elem.setAttribute("class", "align-L sort_asc");
      }
    }
    else {
      this.appSort.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "desc");
      if (cls === "sort_asc") {
        elem.setAttribute("class", "sort_desc");
      }
      else if(cls === "border-l sort_asc"){
        elem.setAttribute("class", "border-l sort_desc");
      }
      else if(cls==="header align-L sort_asc"){
        elem.setAttribute("class", "header align-L sort_desc");
      }
      else {
        elem.setAttribute("class", "align-L sort_desc");
      }
    }
  }
}