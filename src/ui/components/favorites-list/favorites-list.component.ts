import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import { map, startWith, distinctUntilChanged, debounceTime, tap, takeUntil, switchMap } from 'rxjs/operators';


import { FormControl } from '@angular/forms';
import { CustomFieldConfigType, CustomFieldControl } from '@vendure/admin-ui/core';
import { FavoritesService } from '../../providers/favorites.service';
import { GetCustomerFavorites } from '../../generated-types';

type StarType = 'empty' | 'full' | 'half';

@Component({
    selector: 'ex-favorites-list',
    templateUrl: './favorites-list.component.html',
    styleUrls: ['./favorites-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class FavoritesListComponent implements CustomFieldControl, OnInit, OnDestroy {
    customFieldConfig!: CustomFieldConfigType;
    formControl!: FormControl;
    
    showList = false
    customerId$!: Observable<string | null>;
    favorites$!: Observable<GetCustomerFavorites.Items[]>;
    favoritesTotalItems$!: Observable<number>;
    favoritesItemsPerPage$!: Observable<number>;
    favoritesCurrentPage$!: Observable<number>;
    filterTermControl = new FormControl('');
    private refresh$ = new BehaviorSubject<boolean>(true);
    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private router: Router, private favoritesService: FavoritesService) {}

    ngOnInit() {
        this.customerId$ = this.route.paramMap.pipe(
            map(paramMap => paramMap.get("id"))
        );

        this.favoritesCurrentPage$ = this.route.paramMap.pipe(
            map(qpm => qpm.get('favoritesPage')),
            map(page => (!page ? 1 : +page)),
            startWith(1),
            distinctUntilChanged(),
        );

        this.favoritesItemsPerPage$ = this.route.paramMap.pipe(
            map(qpm => qpm.get('favoritesPerPage')),
            map(perPage => (!perPage ? 10 : +perPage)),
            startWith(10),
            distinctUntilChanged(),
        );

        const filterTerm$ = this.filterTermControl.valueChanges.pipe(
            debounceTime(250),
            tap(() => this.setFavoritesPageNumber(1)),
            startWith(''),
        );

        const collection$ = combineLatest(
            this.customerId$,
            this.favoritesCurrentPage$,
            this.favoritesItemsPerPage$,
            filterTerm$,
            this.refresh$,
        ).pipe(
            takeUntil(this.destroy$),
            switchMap(([id, currentPage, itemsPerPage, filterTerm]) => {
                const take = itemsPerPage;
                const skip = (currentPage - 1) * itemsPerPage;
                if (id) {
                    return this.favoritesService
                        .getFavoritesList(id, take, skip, filterTerm)
                        .mapSingle(data => data.customer?.favorites);
                } else {
                    return of(null);
                }
            }),
        );

        this.favorites$ = collection$.pipe(map(result => (result ? result.items : [])));
        this.favoritesTotalItems$ = collection$.pipe(
            map(result => (result ? result.totalItems : 0)),
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setFavoritesPageNumber(page: number) {
        this.setParam('favoritesPage', page);
    }

    setFavoritesItemsPerPage(perPage: number) {
        this.setParam('favoritesPerPage', perPage);
    }

    refresh() {
        this.refresh$.next(true);
    }

    toggleList() {
        this.showList = !this.showList
    }

    private setParam(key: string, value: any) {
        this.router.navigate(['./', { ...this.route.snapshot.params, [key]: value }], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}

