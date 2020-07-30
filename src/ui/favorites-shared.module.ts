import { NgModule } from '@angular/core';
import { SharedModule } from '@vendure/admin-ui/core';

import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';

@NgModule({
    imports: [SharedModule],
    declarations: [FavoritesListComponent],
    exports: [FavoritesListComponent, SharedModule],
})
export class FavoritesSharedModule {}
