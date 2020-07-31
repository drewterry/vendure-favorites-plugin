import { NgModule } from '@angular/core';
import { registerCustomFieldComponent } from '@vendure/admin-ui/core';

import { FavoritesSharedModule } from './favorites-shared.module';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';
import { FavoritesService } from './providers/favorites.service';

@NgModule({
    imports: [FavoritesSharedModule],
    declarations: [],
    providers: [
        FavoritesService,
        registerCustomFieldComponent('Customer', 'favorites', FavoritesListComponent),
    ],
    exports: [],
})
export class FavoritesUiExtensionModule {}
