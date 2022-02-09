import { snapshotChanges } from './snapshot-changes';
import { stateChanges } from './state-changes';
import { auditTrail } from './audit-trail';
import { createDataOperationMethod } from './data-operation';
import { createRemoveMethod } from './remove';
import { map } from 'rxjs/operators';
import { keepUnstableUntilFirst } from '@angular/fire';
export function createListReference(query, afDatabase) {
    const outsideAngularScheduler = afDatabase.schedulers.outsideAngular;
    const refInZone = afDatabase.schedulers.ngZone.run(() => query.ref);
    return {
        query,
        update: createDataOperationMethod(refInZone, 'update'),
        set: createDataOperationMethod(refInZone, 'set'),
        push: (data) => refInZone.push(data),
        remove: createRemoveMethod(refInZone),
        snapshotChanges(events) {
            return snapshotChanges(query, events, outsideAngularScheduler).pipe(keepUnstableUntilFirst);
        },
        stateChanges(events) {
            return stateChanges(query, events, outsideAngularScheduler).pipe(keepUnstableUntilFirst);
        },
        auditTrail(events) {
            return auditTrail(query, events, outsideAngularScheduler).pipe(keepUnstableUntilFirst);
        },
        valueChanges(events, options) {
            const snapshotChanges$ = snapshotChanges(query, events, outsideAngularScheduler);
            return snapshotChanges$.pipe(map(actions => actions.map(a => {
                if (options && options.idField) {
                    return Object.assign(Object.assign({}, a.payload.val()), {
                        [options.idField]: a.key
                    });
                }
                else {
                    return a.payload.val();
                }
            })), keepUnstableUntilFirst);
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXJlZmVyZW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb21wYXQvZGF0YWJhc2UvbGlzdC9jcmVhdGUtcmVmZXJlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RCxNQUFNLFVBQVUsbUJBQW1CLENBQVMsS0FBb0IsRUFBRSxVQUErQjtJQUMvRixNQUFNLHVCQUF1QixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQ3JFLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEUsT0FBTztRQUNMLEtBQUs7UUFDTCxNQUFNLEVBQUUseUJBQXlCLENBQWEsU0FBUyxFQUFFLFFBQVEsQ0FBQztRQUNsRSxHQUFHLEVBQUUseUJBQXlCLENBQUksU0FBUyxFQUFFLEtBQUssQ0FBQztRQUNuRCxJQUFJLEVBQUUsQ0FBQyxJQUFPLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7UUFDckMsZUFBZSxDQUFDLE1BQXFCO1lBQ25DLE9BQU8sZUFBZSxDQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNqRyxDQUFDO1FBQ0QsWUFBWSxDQUFDLE1BQXFCO1lBQ2hDLE9BQU8sWUFBWSxDQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM5RixDQUFDO1FBQ0QsVUFBVSxDQUFDLE1BQXFCO1lBQzlCLE9BQU8sVUFBVSxDQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM1RixDQUFDO1FBQ0QsWUFBWSxDQUFtQixNQUFxQixFQUFFLE9BQXVCO1lBQzNFLE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUNwRixPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FDMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtvQkFDOUIsdUNBQ0ssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQU8sR0FDcEI7d0JBQ0QsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUc7cUJBQ3pCLEVBQ0Q7aUJBQ0g7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBTyxDQUFDO2lCQUM3QjtZQUNILENBQUMsQ0FBQyxDQUFDLEVBQ0gsc0JBQXNCLENBQ3ZCLENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmd1bGFyRmlyZUxpc3QsIENoaWxkRXZlbnQsIERhdGFiYXNlUXVlcnkgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHNuYXBzaG90Q2hhbmdlcyB9IGZyb20gJy4vc25hcHNob3QtY2hhbmdlcyc7XG5pbXBvcnQgeyBzdGF0ZUNoYW5nZXMgfSBmcm9tICcuL3N0YXRlLWNoYW5nZXMnO1xuaW1wb3J0IHsgYXVkaXRUcmFpbCB9IGZyb20gJy4vYXVkaXQtdHJhaWwnO1xuaW1wb3J0IHsgY3JlYXRlRGF0YU9wZXJhdGlvbk1ldGhvZCB9IGZyb20gJy4vZGF0YS1vcGVyYXRpb24nO1xuaW1wb3J0IHsgY3JlYXRlUmVtb3ZlTWV0aG9kIH0gZnJvbSAnLi9yZW1vdmUnO1xuaW1wb3J0IHsgQW5ndWxhckZpcmVEYXRhYmFzZSB9IGZyb20gJy4uL2RhdGFiYXNlJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGtlZXBVbnN0YWJsZVVudGlsRmlyc3QgfSBmcm9tICdAYW5ndWxhci9maXJlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxpc3RSZWZlcmVuY2U8VD0gYW55PihxdWVyeTogRGF0YWJhc2VRdWVyeSwgYWZEYXRhYmFzZTogQW5ndWxhckZpcmVEYXRhYmFzZSk6IEFuZ3VsYXJGaXJlTGlzdDxUPiB7XG4gIGNvbnN0IG91dHNpZGVBbmd1bGFyU2NoZWR1bGVyID0gYWZEYXRhYmFzZS5zY2hlZHVsZXJzLm91dHNpZGVBbmd1bGFyO1xuICBjb25zdCByZWZJblpvbmUgPSBhZkRhdGFiYXNlLnNjaGVkdWxlcnMubmdab25lLnJ1bigoKSA9PiBxdWVyeS5yZWYpO1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5LFxuICAgIHVwZGF0ZTogY3JlYXRlRGF0YU9wZXJhdGlvbk1ldGhvZDxQYXJ0aWFsPFQ+PihyZWZJblpvbmUsICd1cGRhdGUnKSxcbiAgICBzZXQ6IGNyZWF0ZURhdGFPcGVyYXRpb25NZXRob2Q8VD4ocmVmSW5ab25lLCAnc2V0JyksXG4gICAgcHVzaDogKGRhdGE6IFQpID0+IHJlZkluWm9uZS5wdXNoKGRhdGEpLFxuICAgIHJlbW92ZTogY3JlYXRlUmVtb3ZlTWV0aG9kKHJlZkluWm9uZSksXG4gICAgc25hcHNob3RDaGFuZ2VzKGV2ZW50cz86IENoaWxkRXZlbnRbXSkge1xuICAgICAgcmV0dXJuIHNuYXBzaG90Q2hhbmdlczxUPihxdWVyeSwgZXZlbnRzLCBvdXRzaWRlQW5ndWxhclNjaGVkdWxlcikucGlwZShrZWVwVW5zdGFibGVVbnRpbEZpcnN0KTtcbiAgICB9LFxuICAgIHN0YXRlQ2hhbmdlcyhldmVudHM/OiBDaGlsZEV2ZW50W10pIHtcbiAgICAgIHJldHVybiBzdGF0ZUNoYW5nZXM8VD4ocXVlcnksIGV2ZW50cywgb3V0c2lkZUFuZ3VsYXJTY2hlZHVsZXIpLnBpcGUoa2VlcFVuc3RhYmxlVW50aWxGaXJzdCk7XG4gICAgfSxcbiAgICBhdWRpdFRyYWlsKGV2ZW50cz86IENoaWxkRXZlbnRbXSkge1xuICAgICAgcmV0dXJuIGF1ZGl0VHJhaWw8VD4ocXVlcnksIGV2ZW50cywgb3V0c2lkZUFuZ3VsYXJTY2hlZHVsZXIpLnBpcGUoa2VlcFVuc3RhYmxlVW50aWxGaXJzdCk7XG4gICAgfSxcbiAgICB2YWx1ZUNoYW5nZXM8SyBleHRlbmRzIHN0cmluZz4oZXZlbnRzPzogQ2hpbGRFdmVudFtdLCBvcHRpb25zPzoge2lkRmllbGQ/OiBLfSkge1xuICAgICAgY29uc3Qgc25hcHNob3RDaGFuZ2VzJCA9IHNuYXBzaG90Q2hhbmdlczxUPihxdWVyeSwgZXZlbnRzLCBvdXRzaWRlQW5ndWxhclNjaGVkdWxlcik7XG4gICAgICByZXR1cm4gc25hcHNob3RDaGFuZ2VzJC5waXBlKFxuICAgICAgICBtYXAoYWN0aW9ucyA9PiBhY3Rpb25zLm1hcChhID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmlkRmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmEucGF5bG9hZC52YWwoKSBhcyBULFxuICAgICAgICAgICAgICAuLi57XG4gICAgICAgICAgICAgICAgW29wdGlvbnMuaWRGaWVsZF06IGEua2V5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhLnBheWxvYWQudmFsKCkgYXMgVDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKSxcbiAgICAgICAga2VlcFVuc3RhYmxlVW50aWxGaXJzdFxuICAgICAgKTtcbiAgICB9XG4gIH07XG59XG4iXX0=