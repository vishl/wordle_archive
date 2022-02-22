
import { initializeApp as fbInit } from "firebase/app";
import { getAnalytics as fbGetAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
import { getDatabase, get, set, ref, child } from "firebase/database";



export class wbDb {
  constructor(fbConfig, options){
    // Private Members
    this._fbApp = fbInit(fbConfig);
    this._fbAnalytics = fbGetAnalytics(this._fbApp);
    this._auth = getAuth();
    this._db = getDatabase(this._fbApp);
    this._userProfile = null;
    this._user = null;
    this._authCallback = options.authCallBack;

    // Public Members

    this._init();
  }

  // Private methods

  _init(){
    // Register auth state changed callback
    onAuthStateChanged(this._auth, (user) => {
      this._onAuth(user);
    });
  }

  _userPath(id = this._user?.uid){
    return `users/${id}`
  }

  _gamesPath(day){
    return `${this._userPath()}/games/${day}`;
  }

  _setLastLogin(){
    return set(ref(this._db, `${this._userPath()}/last_login`), Date.now());
  }

  _getUser(id = this._user?.uid){
    return get(child(ref(this._db), this._userPath(id)))
      .then( snapshot => {
        if(snapshot.exists()){
          return snapshot.val();
        } else {
          return null;
        }
      });
  }

  _initUserProfile(){
    return this._getUser().then(data => {
      if(data){
        this._userProfile = data;
      } else {
        // default profile for new user
        this._userProfile = {
          games:{}
        }
      }

      return this._userProfile;
    });
  }

  _updateUserProfile(element, data){
    let path = `${this._userPath()}/${element}`
    return set(ref(this._db, path), data);
  }

  _onAuth(user){
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
        return this._initUserProfile()
          .then(() => {
            this._authCallback?.(this._userProfile);
            return this._userProfile;
          });
      }
    } else {
      // User is signed out
    }
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
    this._userProfile.name = name;  // this is ugly, but not sure how to avoid without unecessary fetches
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
      console.log(`Logging game ${day}`);
      console.log(st);
      //TODO: update streak as well
      set(ref(this._db, this._gamesPath(day)), st)
        .then( () => {

          //add it locally as well
          if(!this._userProfile.games){
            this._userProfile.games = {}
          }
          this._userProfile.games[day] = st;
        });
    }else{
      console.log(`Not logging game ${day} because it exists`);
    }
  }

  addFriendWithId(id){
    if(!this._userProfile) return Promise.resolve({ error: 'User is not initialized' });
    // Look up friend
    return this._getUser(id)
      .then( data => {
        console.log(`Got data for user ${id}`);
        console.log(data);
        // If exists add id to current user
        // Yield data
        if(!data){
          return { error: 'Could not find friend' }
        }
        return data;
      }).then( data => {
        if(data.error) return data;
        if(this._userProfile.friends?.[id]) return data; //Already friends
        return this._updateUserProfile(`friends/${id}`, Date.now())
          .then( d => {
            return data;
          })
          .catch( e => {
            return { error: e }
          });
      })
      .catch( e => {
        console.log(e);
        return { error: e };
      });

  }

}
