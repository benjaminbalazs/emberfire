// @ts-ignore Node.js issues
import _firebase from 'firebase/app';
import { auth } from 'firebase';
import Service from '@ember/service';
const firebase = _firebase;
export default class FirebaseService extends Service {
    constructor() {
        super(...arguments);
        this.app = (name) => firebase.app(name);
        this.apps = firebase.apps;
        this.OAuthProvider = auth.OAuthProvider;
        this.initializeApp = (options, nameOrConfig) => firebase.initializeApp(options, nameOrConfig);
    }
}
