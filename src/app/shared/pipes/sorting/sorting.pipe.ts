import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortPipe', pure: false })
export class SortingPipe implements PipeTransform {
    transform(value, args?): Array<any> {
        let searchText = new RegExp(args, 'ig');
        if (value) {
            return  value.sort((a, b) =>
                a.rect.y2 -  b.rect.y2
            );
        }
    }
}
