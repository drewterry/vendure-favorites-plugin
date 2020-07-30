import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import { map, startWith, distinctUntilChanged, debounceTime, tap, takeUntil, switchMap } from 'rxjs/operators';


import { FormControl } from '@angular/forms';
import { CustomFieldConfigType, CustomFieldControl } from '@vendure/admin-ui/core';
import { FavoritesService } from 'src/plugins/favorites-plugin/favorites.service';

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

    customerId: string | null = null;

    favorites$!: Observable<GetCollectionFavorites.Items[]>;
    favoritesTotalItems$!: Observable<number>;
    favoritesItemsPerPage$!: Observable<number>;
    favoritesCurrentPage$!: Observable<number>;
    filterTermControl = new FormControl('');
    private collectionIdChange$ = new BehaviorSubject<string>('');
    private refresh$ = new BehaviorSubject<boolean>(true);
    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private router: Router, private favoritesService: FavoritesService) {}

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap) => {
            this.customerId = paramMap.get("id");
      
            if (this.customerId) {
                console.log(this.customerId)
            }
        })

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
            this.collectionIdChange$,
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
                        .mapSingle(data => data.collection);
                } else {
                    return of(null);
                }
            }),
        );

        this.favorites$ = collection$.pipe(map(result => (result ? result.productVariants.items : [])));
        this.favoritesTotalItems$ = collection$.pipe(
            map(result => (result ? result.productVariants.totalItems : 0)),
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

    private setParam(key: string, value: any) {
        this.router.navigate(['./', { ...this.route.snapshot.params, [key]: value }], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}

