import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
const { isArray } = Array;
let FilterPipe = class FilterPipe {
    transform(posts, find) {
        if (!posts)
            return [];
        if (!find)
            return posts;
        find = find.toLowerCase();
        return search(posts, find);
    }
};
FilterPipe = tslib_1.__decorate([
    Pipe({
        name: 'filter'
    })
], FilterPipe);
export { FilterPipe };
function search(entries, search) {
    search = search.toLowerCase();
    return entries.filter(function (obj) {
        const keys = Object.keys(obj);
        return keys.some(function (key) {
            const value = obj[key];
            if (isArray(value)) {
                return value.some(v => {
                    return v.toLowerCase().includes(search);
                });
            }
            else if (!isArray(value)) {
                return value.toLowerCase().includes(search);
            }
        });
    });
}
//# sourceMappingURL=filter.pipe.js.map