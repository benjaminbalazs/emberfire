// @ts-ignore export for Node problem
import _firebase from 'firebase/app';
import "firebase/performance";
import FirebaseAppService from '../services/firebase-app';
import RealtimeListenerService from '../services/realtime-listener';
import FirestoreAdapter from '../adapters/firestore';
import FirestoreSerializer from '../serializers/firestore';
import RealtimeDatabaseAdapater from '../adapters/realtime-database';
import RealtimeDatabaseSerializer from '../serializers/realtime-database';
const firebase = _firebase;
const initialize = (application) => {
    const environment = application.resolveRegistration('config:environment');
    if (!environment || typeof environment.firebase !== 'object') {
        throw new Error('Please set the `firebase` property in your environment config.');
    }
    if (typeof environment.firebase.length === 'undefined') {
        loadEnvironment(application, environment.firebase);
    }
    else {
        environment.firebase.forEach((config) => loadEnvironment(application, config));
    }
    application.register("service:realtime-listener", RealtimeListenerService.extend({}), { instantiate: true });
    application.register('adapter:-firestore', FirestoreAdapter);
    application.register('serializer:-firestore', FirestoreSerializer);
    application.register('adapter:-realtime-database', RealtimeDatabaseAdapater);
    application.register('serializer:-realtime-database', RealtimeDatabaseSerializer);
};
const loadEnvironment = (application, environment) => {
    const config = Object.assign({}, environment);
    delete config.options;
    delete config.name;
    const options = Object.assign({}, config.options);
    options.name = options.name || environment.name;
    firebase.initializeApp(config, options);
    firebase.performance();
    const serviceName = options.name === '[DEFAULT]' && `firebase-app` || `firebase-${options.name}`;
    application.register(`service:${serviceName}`, FirebaseAppService.extend({ name: options.name }), { instantiate: true });
};
export default {
    name: 'emberfire',
    initialize: initialize
};
