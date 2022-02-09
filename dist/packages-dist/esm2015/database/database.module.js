import { NgModule, Optional, NgZone, InjectionToken, Injector } from '@angular/core';
import { AuthInstances } from '@angular/fire/auth';
import { ɵgetDefaultInstanceOf, ɵAngularFireSchedulers, VERSION } from '@angular/fire';
import { Database, DatabaseInstances, DATABASE_PROVIDER_NAME } from './database';
import { FirebaseApps, FirebaseApp } from '@angular/fire/app';
import { registerVersion } from 'firebase/app';
import { AppCheckInstances } from '@angular/fire/app-check';
import * as i0 from "@angular/core";
export const PROVIDED_DATABASE_INSTANCES = new InjectionToken('angularfire2.database-instances');
export function defaultDatabaseInstanceFactory(provided, defaultApp) {
    const defaultDatabase = ɵgetDefaultInstanceOf(DATABASE_PROVIDER_NAME, provided, defaultApp);
    return defaultDatabase && new Database(defaultDatabase);
}
export function databaseInstanceFactory(fn) {
    return (zone, injector) => {
        const database = zone.runOutsideAngular(() => fn(injector));
        return new Database(database);
    };
}
const DATABASE_INSTANCES_PROVIDER = {
    provide: DatabaseInstances,
    deps: [
        [new Optional(), PROVIDED_DATABASE_INSTANCES],
    ]
};
const DEFAULT_DATABASE_INSTANCE_PROVIDER = {
    provide: Database,
    useFactory: defaultDatabaseInstanceFactory,
    deps: [
        [new Optional(), PROVIDED_DATABASE_INSTANCES],
        FirebaseApp,
    ]
};
export class DatabaseModule {
    constructor() {
        registerVersion('angularfire', VERSION.full, 'rtdb');
    }
}
DatabaseModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: DatabaseModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DatabaseModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: DatabaseModule });
DatabaseModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: DatabaseModule, providers: [
        DEFAULT_DATABASE_INSTANCE_PROVIDER,
        DATABASE_INSTANCES_PROVIDER,
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: DatabaseModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [
                        DEFAULT_DATABASE_INSTANCE_PROVIDER,
                        DATABASE_INSTANCES_PROVIDER,
                    ]
                }]
        }], ctorParameters: function () { return []; } });
export function provideDatabase(fn, ...deps) {
    return {
        ngModule: DatabaseModule,
        providers: [{
                provide: PROVIDED_DATABASE_INSTANCES,
                useFactory: databaseInstanceFactory(fn),
                multi: true,
                deps: [
                    NgZone,
                    Injector,
                    ɵAngularFireSchedulers,
                    FirebaseApps,
                    // Database+Auth work better if Auth is loaded first
                    [new Optional(), AuthInstances],
                    [new Optional(), AppCheckInstances],
                    ...deps,
                ]
            }]
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGFiYXNlL2RhdGFiYXNlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNqRixPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7O0FBRTVELE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHLElBQUksY0FBYyxDQUFhLGlDQUFpQyxDQUFDLENBQUM7QUFFN0csTUFBTSxVQUFVLDhCQUE4QixDQUFDLFFBQXNDLEVBQUUsVUFBdUI7SUFDNUcsTUFBTSxlQUFlLEdBQUcscUJBQXFCLENBQW1CLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM5RyxPQUFPLGVBQWUsSUFBSSxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxVQUFVLHVCQUF1QixDQUFDLEVBQTRDO0lBQ2xGLE9BQU8sQ0FBQyxJQUFZLEVBQUUsUUFBa0IsRUFBRSxFQUFFO1FBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM1RCxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLDJCQUEyQixHQUFHO0lBQ2xDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsSUFBSSxFQUFFO1FBQ0osQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLDJCQUEyQixDQUFFO0tBQy9DO0NBQ0YsQ0FBQztBQUVGLE1BQU0sa0NBQWtDLEdBQUc7SUFDekMsT0FBTyxFQUFFLFFBQVE7SUFDakIsVUFBVSxFQUFFLDhCQUE4QjtJQUMxQyxJQUFJLEVBQUU7UUFDSixDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsMkJBQTJCLENBQUU7UUFDOUMsV0FBVztLQUNaO0NBQ0YsQ0FBQztBQVFGLE1BQU0sT0FBTyxjQUFjO0lBQ3pCO1FBQ0UsZUFBZSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7OzRHQUhVLGNBQWM7NkdBQWQsY0FBYzs2R0FBZCxjQUFjLGFBTGQ7UUFDVCxrQ0FBa0M7UUFDbEMsMkJBQTJCO0tBQzVCOzRGQUVVLGNBQWM7a0JBTjFCLFFBQVE7bUJBQUM7b0JBQ1IsU0FBUyxFQUFFO3dCQUNULGtDQUFrQzt3QkFDbEMsMkJBQTJCO3FCQUM1QjtpQkFDRjs7QUFPRCxNQUFNLFVBQVUsZUFBZSxDQUFDLEVBQTBCLEVBQUUsR0FBRyxJQUFXO0lBQ3hFLE9BQU87UUFDTCxRQUFRLEVBQUUsY0FBYztRQUN4QixTQUFTLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsMkJBQTJCO2dCQUNwQyxVQUFVLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxDQUFDO2dCQUN2QyxLQUFLLEVBQUUsSUFBSTtnQkFDWCxJQUFJLEVBQUU7b0JBQ0osTUFBTTtvQkFDTixRQUFRO29CQUNSLHNCQUFzQjtvQkFDdEIsWUFBWTtvQkFDWixvREFBb0Q7b0JBQ3BELENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxhQUFhLENBQUU7b0JBQ2hDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxpQkFBaUIsQ0FBRTtvQkFDcEMsR0FBRyxJQUFJO2lCQUNSO2FBQ0YsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE9wdGlvbmFsLCBOZ1pvbmUsIEluamVjdGlvblRva2VuLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YWJhc2UgYXMgRmlyZWJhc2VEYXRhYmFzZSB9IGZyb20gJ2ZpcmViYXNlL2RhdGFiYXNlJztcbmltcG9ydCB7IEF1dGhJbnN0YW5jZXMgfSBmcm9tICdAYW5ndWxhci9maXJlL2F1dGgnO1xuaW1wb3J0IHsgybVnZXREZWZhdWx0SW5zdGFuY2VPZiwgybVBbmd1bGFyRmlyZVNjaGVkdWxlcnMsIFZFUlNJT04gfSBmcm9tICdAYW5ndWxhci9maXJlJztcbmltcG9ydCB7IERhdGFiYXNlLCBEYXRhYmFzZUluc3RhbmNlcywgREFUQUJBU0VfUFJPVklERVJfTkFNRSB9IGZyb20gJy4vZGF0YWJhc2UnO1xuaW1wb3J0IHsgRmlyZWJhc2VBcHBzLCBGaXJlYmFzZUFwcCB9IGZyb20gJ0Bhbmd1bGFyL2ZpcmUvYXBwJztcbmltcG9ydCB7IHJlZ2lzdGVyVmVyc2lvbiB9IGZyb20gJ2ZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBBcHBDaGVja0luc3RhbmNlcyB9IGZyb20gJ0Bhbmd1bGFyL2ZpcmUvYXBwLWNoZWNrJztcblxuZXhwb3J0IGNvbnN0IFBST1ZJREVEX0RBVEFCQVNFX0lOU1RBTkNFUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxEYXRhYmFzZVtdPignYW5ndWxhcmZpcmUyLmRhdGFiYXNlLWluc3RhbmNlcycpO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdERhdGFiYXNlSW5zdGFuY2VGYWN0b3J5KHByb3ZpZGVkOiBGaXJlYmFzZURhdGFiYXNlW118dW5kZWZpbmVkLCBkZWZhdWx0QXBwOiBGaXJlYmFzZUFwcCkge1xuICBjb25zdCBkZWZhdWx0RGF0YWJhc2UgPSDJtWdldERlZmF1bHRJbnN0YW5jZU9mPEZpcmViYXNlRGF0YWJhc2U+KERBVEFCQVNFX1BST1ZJREVSX05BTUUsIHByb3ZpZGVkLCBkZWZhdWx0QXBwKTtcbiAgcmV0dXJuIGRlZmF1bHREYXRhYmFzZSAmJiBuZXcgRGF0YWJhc2UoZGVmYXVsdERhdGFiYXNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGFiYXNlSW5zdGFuY2VGYWN0b3J5KGZuOiAoaW5qZWN0b3I6IEluamVjdG9yKSA9PiBGaXJlYmFzZURhdGFiYXNlKSB7XG4gIHJldHVybiAoem9uZTogTmdab25lLCBpbmplY3RvcjogSW5qZWN0b3IpID0+IHtcbiAgICBjb25zdCBkYXRhYmFzZSA9IHpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gZm4oaW5qZWN0b3IpKTtcbiAgICByZXR1cm4gbmV3IERhdGFiYXNlKGRhdGFiYXNlKTtcbiAgfTtcbn1cblxuY29uc3QgREFUQUJBU0VfSU5TVEFOQ0VTX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBEYXRhYmFzZUluc3RhbmNlcyxcbiAgZGVwczogW1xuICAgIFtuZXcgT3B0aW9uYWwoKSwgUFJPVklERURfREFUQUJBU0VfSU5TVEFOQ0VTIF0sXG4gIF1cbn07XG5cbmNvbnN0IERFRkFVTFRfREFUQUJBU0VfSU5TVEFOQ0VfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IERhdGFiYXNlLFxuICB1c2VGYWN0b3J5OiBkZWZhdWx0RGF0YWJhc2VJbnN0YW5jZUZhY3RvcnksXG4gIGRlcHM6IFtcbiAgICBbbmV3IE9wdGlvbmFsKCksIFBST1ZJREVEX0RBVEFCQVNFX0lOU1RBTkNFUyBdLFxuICAgIEZpcmViYXNlQXBwLFxuICBdXG59O1xuXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtcbiAgICBERUZBVUxUX0RBVEFCQVNFX0lOU1RBTkNFX1BST1ZJREVSLFxuICAgIERBVEFCQVNFX0lOU1RBTkNFU19QUk9WSURFUixcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRhYmFzZU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHJlZ2lzdGVyVmVyc2lvbignYW5ndWxhcmZpcmUnLCBWRVJTSU9OLmZ1bGwsICdydGRiJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVEYXRhYmFzZShmbjogKCkgPT4gRmlyZWJhc2VEYXRhYmFzZSwgLi4uZGVwczogYW55W10pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPERhdGFiYXNlTW9kdWxlPiB7XG4gIHJldHVybiB7XG4gICAgbmdNb2R1bGU6IERhdGFiYXNlTW9kdWxlLFxuICAgIHByb3ZpZGVyczogW3tcbiAgICAgIHByb3ZpZGU6IFBST1ZJREVEX0RBVEFCQVNFX0lOU1RBTkNFUyxcbiAgICAgIHVzZUZhY3Rvcnk6IGRhdGFiYXNlSW5zdGFuY2VGYWN0b3J5KGZuKSxcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgZGVwczogW1xuICAgICAgICBOZ1pvbmUsXG4gICAgICAgIEluamVjdG9yLFxuICAgICAgICDJtUFuZ3VsYXJGaXJlU2NoZWR1bGVycyxcbiAgICAgICAgRmlyZWJhc2VBcHBzLFxuICAgICAgICAvLyBEYXRhYmFzZStBdXRoIHdvcmsgYmV0dGVyIGlmIEF1dGggaXMgbG9hZGVkIGZpcnN0XG4gICAgICAgIFtuZXcgT3B0aW9uYWwoKSwgQXV0aEluc3RhbmNlcyBdLFxuICAgICAgICBbbmV3IE9wdGlvbmFsKCksIEFwcENoZWNrSW5zdGFuY2VzIF0sXG4gICAgICAgIC4uLmRlcHMsXG4gICAgICBdXG4gICAgfV1cbiAgfTtcbn1cbiJdfQ==