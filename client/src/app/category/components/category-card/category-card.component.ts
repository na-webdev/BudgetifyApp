import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

import { CategoryInterface } from '../../types/category.interface';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent {
  faTrash = faTrash;
  faPen = faPen;

  @Input() category!: CategoryInterface;
  @Output() deleteCategoryClicked: EventEmitter<any> = new EventEmitter();
  @Output() editCategoryClicked: EventEmitter<any> = new EventEmitter();
  constructor() {}

  deleteClick(category: CategoryInterface): void {
    this.deleteCategoryClicked.emit(category);
  }

  editClick(category: CategoryInterface): void {
    this.editCategoryClicked.emit(category);
  }
}
