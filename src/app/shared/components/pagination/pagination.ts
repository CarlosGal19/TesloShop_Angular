import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  currentPage = input<number>(1);
  pagesAmount = input<number>(3);

  internalPage = linkedSignal(this.currentPage)

  pagesCounter = computed(() => {
    return Array.from({ length: this.pagesAmount() }, (_, i) => i + 1)
  })
}
