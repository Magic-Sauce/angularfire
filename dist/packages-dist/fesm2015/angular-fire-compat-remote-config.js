import * as i0 from '@angular/core';
import { InjectionToken, PLATFORM_ID, Injectable, Inject, Optional, NgModule } from '@angular/core';
import { pipe, of, EMPTY, concat, Observable } from 'rxjs';
import { map, distinctUntilChanged, filter, withLatestFrom, scan, observeOn, switchMap, startWith, shareReplay, groupBy, mergeMap, debounceTime } from 'rxjs/operators';
import * as i1 from '@angular/fire';
import { keepUnstableUntilFirst, VERSION } from '@angular/fire';
import { ɵfirebaseAppFactory, ɵcacheInstance, ɵlazySDKProxy, FIREBASE_OPTIONS, FIREBASE_APP_NAME, ɵapplyMixins } from '@angular/fire/compat';
import { isSupported } from 'firebase/remote-config';
import firebase from 'firebase/compat/app';

// DO NOT MODIFY, this file is autogenerated by tools/build.ts
// Export a null object with the same keys as firebase/compat/remote-config, so Proxy can work with proxy-polyfill in Internet Explorer
const proxyPolyfillCompat = {
    app: null,
    settings: null,
    defaultConfig: null,
    fetchTimeMillis: null,
    lastFetchStatus: null,
    activate: null,
    ensureInitialized: null,
    fetch: null,
    fetchAndActivate: null,
    getAll: null,
    getBoolean: null,
    getNumber: null,
    getString: null,
    getValue: null,
    setLogLevel: null,
};

const SETTINGS = new InjectionToken('angularfire2.remoteConfig.settings');
const DEFAULTS = new InjectionToken('angularfire2.remoteConfig.defaultConfig');
const AS_TO_FN = { strings: 'asString', numbers: 'asNumber', booleans: 'asBoolean' };
const STATIC_VALUES = { numbers: 0, booleans: false, strings: undefined };
// TODO look into the types here, I don't like the anys
const proxyAll = (observable, as) => new Proxy(observable.pipe(mapToObject(as)), {
    get: (self, name) => self[name] || observable.pipe(map(all => all.find(p => p.key === name)), map(param => param ? param[AS_TO_FN[as]]() : STATIC_VALUES[as]), distinctUntilChanged())
});
// TODO export as implements Partial<...> so minor doesn't break us
class Value {
    // tslint:disable-next-line:variable-name
    constructor(_source, _value) {
        this._source = _source;
        this._value = _value;
    }
    asBoolean() {
        return ['1', 'true', 't', 'y', 'yes', 'on'].indexOf(this._value.toLowerCase()) > -1;
    }
    asString() {
        return this._value;
    }
    asNumber() {
        return Number(this._value) || 0;
    }
    getSource() {
        return this._source;
    }
}
// SEMVER use ConstructorParameters when we can support Typescript 3.6
class Parameter extends Value {
    constructor(key, fetchTimeMillis, source, value) {
        super(source, value);
        this.key = key;
        this.fetchTimeMillis = fetchTimeMillis;
    }
}
// If it's a Parameter array, test any, else test the individual Parameter
const filterTest = (fn) => filter(it => Array.isArray(it) ? it.some(fn) : fn(it));
// Allow the user to bypass the default values and wait till they get something from the server, even if it's a cached copy;
// if used in conjuntion with first() it will only fetch RC values from the server if they aren't cached locally
const filterRemote = () => filterTest(p => p.getSource() === 'remote');
// filterFresh allows the developer to effectively set up a maximum cache time
const filterFresh = (howRecentInMillis) => filterTest(p => p.fetchTimeMillis + howRecentInMillis >= new Date().getTime());
// I ditched loading the defaults into RC and a simple map for scan since we already have our own defaults implementation.
// The idea here being that if they have a default that never loads from the server, they will be able to tell via fetchTimeMillis
// on the Parameter. Also if it doesn't come from the server it won't emit again in .changes, due to the distinctUntilChanged,
// which we can simplify to === rather than deep comparison
const scanToParametersArray = (remoteConfig) => pipe(withLatestFrom(remoteConfig), scan((existing, [all, rc]) => {
    // SEMVER use "new Set" to unique once we're only targeting es6
    // at the scale we expect remote config to be at, we probably won't see a performance hit from this unoptimized uniqueness
    // implementation.
    // const allKeys = [...new Set([...existing.map(p => p.key), ...Object.keys(all)])];
    const allKeys = [...existing.map(p => p.key), ...Object.keys(all)].filter((v, i, a) => a.indexOf(v) === i);
    return allKeys.map(key => {
        const updatedValue = all[key];
        return updatedValue ? new Parameter(key, rc ? rc.fetchTimeMillis : -1, updatedValue.getSource(), updatedValue.asString())
            : existing.find(p => p.key === key);
    });
}, []));
class AngularFireRemoteConfig {
    constructor(options, name, settings, defaultConfig, zone, schedulers, 
    // tslint:disable-next-line:ban-types
    platformId) {
        this.zone = zone;
        const remoteConfig$ = of(undefined).pipe(observeOn(schedulers.outsideAngular), switchMap(() => isSupported()), switchMap(isSupported => isSupported ? import('firebase/compat/remote-config') : EMPTY), map(() => ɵfirebaseAppFactory(options, zone, name)), map(app => ɵcacheInstance(`${app.name}.remote-config`, 'AngularFireRemoteConfig', app.name, () => {
            const rc = app.remoteConfig();
            if (settings) {
                rc.settings = settings;
            }
            if (defaultConfig) {
                rc.defaultConfig = defaultConfig;
            }
            return rc;
        }, [settings, defaultConfig])), startWith(undefined), shareReplay({ bufferSize: 1, refCount: false }));
        const loadedRemoteConfig$ = remoteConfig$.pipe(filter(rc => !!rc));
        const default$ = of(Object.keys(defaultConfig || {}).reduce((c, k) => (Object.assign(Object.assign({}, c), { [k]: new Value('default', defaultConfig[k].toString()) })), {}));
        // we should filter out the defaults we provided to RC, since we have our own implementation
        // that gives us a -1 for fetchTimeMillis (so filterFresh can filter them out)
        const filterOutDefaults = map(all => Object.keys(all)
            .filter(key => all[key].getSource() !== 'default')
            .reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: all[key] })), {}));
        const existing$ = loadedRemoteConfig$.pipe(switchMap(rc => rc.activate()
            .then(() => rc.ensureInitialized())
            .then(() => rc.getAll())), filterOutDefaults);
        const fresh$ = loadedRemoteConfig$.pipe(switchMap(rc => zone.runOutsideAngular(() => rc.fetchAndActivate()
            .then(() => rc.ensureInitialized())
            .then(() => rc.getAll()))), filterOutDefaults);
        this.parameters = concat(default$, existing$, fresh$).pipe(scanToParametersArray(remoteConfig$), keepUnstableUntilFirst, shareReplay({ bufferSize: 1, refCount: true }));
        this.changes = this.parameters.pipe(switchMap(params => of(...params)), groupBy(param => param.key), mergeMap(group => group.pipe(distinctUntilChanged())));
        this.strings = proxyAll(this.parameters, 'strings');
        this.booleans = proxyAll(this.parameters, 'booleans');
        this.numbers = proxyAll(this.parameters, 'numbers');
        return ɵlazySDKProxy(this, loadedRemoteConfig$, zone);
    }
}
AngularFireRemoteConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: AngularFireRemoteConfig, deps: [{ token: FIREBASE_OPTIONS }, { token: FIREBASE_APP_NAME, optional: true }, { token: SETTINGS, optional: true }, { token: DEFAULTS, optional: true }, { token: i0.NgZone }, { token: i1.ɵAngularFireSchedulers }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
AngularFireRemoteConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: AngularFireRemoteConfig, providedIn: 'any' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: AngularFireRemoteConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'any'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [FIREBASE_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [FIREBASE_APP_NAME]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [SETTINGS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DEFAULTS]
                }] }, { type: i0.NgZone }, { type: i1.ɵAngularFireSchedulers }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
const budget = (interval) => (source) => new Observable(observer => {
    let timedOut = false;
    // TODO use scheduler task rather than settimeout
    const timeout = setTimeout(() => {
        observer.complete();
        timedOut = true;
    }, interval);
    return source.subscribe({
        next(val) {
            if (!timedOut) {
                observer.next(val);
            }
        },
        error(err) {
            if (!timedOut) {
                clearTimeout(timeout);
                observer.error(err);
            }
        },
        complete() {
            if (!timedOut) {
                clearTimeout(timeout);
                observer.complete();
            }
        }
    });
});
const typedMethod = (it) => {
    switch (typeof it) {
        case 'string':
            return 'asString';
        case 'boolean':
            return 'asBoolean';
        case 'number':
            return 'asNumber';
        default:
            return 'asString';
    }
};
function scanToObject(to = 'strings') {
    return pipe(
    // TODO cleanup
    scan((c, p) => (Object.assign(Object.assign({}, c), { [p.key]: typeof to === 'object' ?
            p[typedMethod(to[p.key])]() :
            p[AS_TO_FN[to]]() })), typeof to === 'object' ?
        to :
        {}), debounceTime(1), budget(10), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
}
function mapToObject(to = 'strings') {
    return pipe(
    // TODO this is getting a little long, cleanup
    map((params) => params.reduce((c, p) => (Object.assign(Object.assign({}, c), { [p.key]: typeof to === 'object' ?
            p[typedMethod(to[p.key])]() :
            p[AS_TO_FN[to]]() })), typeof to === 'object' ?
        to :
        {})), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
}
ɵapplyMixins(AngularFireRemoteConfig, [proxyPolyfillCompat]);

class AngularFireRemoteConfigModule {
    constructor() {
        firebase.registerVersion('angularfire', VERSION.full, 'rc-compat');
    }
}
AngularFireRemoteConfigModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: AngularFireRemoteConfigModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AngularFireRemoteConfigModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: AngularFireRemoteConfigModule });
AngularFireRemoteConfigModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: AngularFireRemoteConfigModule, providers: [AngularFireRemoteConfig] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: AngularFireRemoteConfigModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [AngularFireRemoteConfig]
                }]
        }], ctorParameters: function () { return []; } });

/**
 * Generated bundle index. Do not edit.
 */

export { AngularFireRemoteConfig, AngularFireRemoteConfigModule, DEFAULTS, Parameter, SETTINGS, Value, budget, filterFresh, filterRemote, mapToObject, scanToObject };
//# sourceMappingURL=angular-fire-compat-remote-config.js.map
