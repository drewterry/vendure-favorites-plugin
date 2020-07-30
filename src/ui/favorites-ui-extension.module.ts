import { NgModule } from '@angular/core';
import { registerCustomFieldComponent } from '@vendure/admin-ui/core';

import { FavoritesSharedModule } from './favorites-shared.module';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';

@NgModule({
    imports: [FavoritesSharedModule],
    declarations: [],
    providers: [
        registerCustomFieldComponent('Customer', 'favorites', FavoritesListComponent),
    ],
    exports: [],
})
export class FavoritesUiExtensionModule {}
