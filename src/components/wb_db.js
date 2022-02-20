
import { initializeApp as fbInit } from "firebase/app";
import { getAnalytics as fbGetAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
import { getDatabase, get, set, ref, child } from "firebase/database";



export class wbDb {
  constructor(fbConfig, ){
    // Private Members
    this._fbApp = fbInit(fbConfig);
    this._fbAnalytics = fbGetAnalytics(this._fbApp);
    this._auth = getAuth();
    this._db = getDatabase(this._fbApp);
    this._userProfile = null;
    this._user = null;

    // Public Members

    this._init();
  }

  // Private methods

  _init(){
    // Register auth state changed callback
    onAuthStateChanged(this._auth, (user) => {
      this.onAuth(user);
    });
  }

  _userPath(){
    return `users/${this._user?.uid}`
  }

  _setLastLogin(){
    return set(ref(this._db, `${this._userPath()}/last_login`), Date.now());
  }

  _initUserProfile(){
    get(child(ref(this._db), this._userPath())).then((snapshot) => {
      if(snapshot.exists()){
        this._userProfile = snapshot.val();
      } else {
        // default profile for new user
        this._userProfile = {
          games:{}
        }
      }
    });
  }


  // Public methods
  getUserProfile(){
    //TODO: should return a deep copy or something here to prevent mutation
    return this._userProfile;
  }

  setName(name){
    if(typeof name !== 'string'){
      throw new Error('Name is not a string');
    }
    return set(ref(this._db, `${this._userPath()}/name`), name);
  }


  // returns a promise after signin attempt or null if the parameters are invalid
  signIn(method = 'anon', data = null){
    if(method !== 'anon'){
      return;
    }

    // only Anon is supported right now
    return signInAnonymously(this._auth)

      // .then(() => {
      // })
      // .catch((error) => {
      //   // const errorCode = error.code;
      //   // const errorMessage = error.message;
      //   // ...
      // });
  }

  logGame(st){
    const day = st.gameIndex;
    // add the game to the profile only if it doesn't exist
    if(!this._userProfile.games?.[day]){
      //TODO: update streak as well
      set(ref(this._db, `users/${this._user.uid}/games/${day}`), st)
        .then( () => {
          //add it locally as well
          if(!this._userProfile.games){
            this._userProfile.games = {}
          }
          this._userProfile.games[day] = st;
        });
    }
  }

  onAuth(user){
  // Triggers on firebase auth change
    if (user) {
      if(!this._user){
        // User is signed in for the first time
        console.log('Successfully Authed');
        console.log(user.uid);

        this._user = user;

        // Set last login time This will also create the user if necessary
        this._setLastLogin();

        // Get profile if it exists
        this._initUserProfile();
      }
    } else {
      // User is signed out
    }
  }

}
