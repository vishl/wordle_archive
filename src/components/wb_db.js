
import { initializeApp as fbInit } from "firebase/app";
import { getAnalytics as fbGetAnalytics, isSupported as fbAnalyticsIsSupported } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
import { getDatabase,
  connectDatabaseEmulator,
  get as fbGet,
  set as fbSet,
  update as fbUpdate,
  ref as fbRef,
  child as fbChild
} from "firebase/database";
import { getFirestore } from "firebase/firestore"
import { collection, getDocs, query, where } from "firebase/firestore";





export class wbDb {
  constructor(fbConfig, options){
    // Private Members
    this._fbApp = fbInit(fbConfig);
    this._auth = getAuth();
    this._db = getDatabase(this._fbApp);

    if (options.local) {
      // Point to the RTDB emulator running on localhost.
      connectAuthEmulator(this._auth, "http://localhost:9099");
      connectDatabaseEmulator(this._db, "localhost", 9000);
    }


    this._dbs = getFirestore();
    this._userProfile = null;
    this._user = null;
    this._authCallback = options.authCallBack;
    this._friendsData = {};

    // Public Members

    // Initialization
    this._init();
  }

  // Private methods
  async _test(){
    console.log('xx start');
    let s = await getDocs(collection(this._dbs, 'users'));
    console.log(`xx Got ${s.length} users`);
    console.log(s);
    s.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });

    s = await getDocs(query(collection(this._dbs, 'users'), where('friendsOf', 'array-contains', '185WhOC8UjQT6WkgmLbF')));
    console.log('Got friends of 185WhOC8UjQT6WkgmLbF');
    s.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
  }

  _init(){
    // Register auth state changed callback
    onAuthStateChanged(this._auth, (user) => {
      this._onAuth(user);
    });

    fbAnalyticsIsSupported().then( (r) => {
      if(r){
        this._fbAnalytics = fbGetAnalytics(this._fbApp);
      }
    });
  }

  _userPath(id = this._user?.uid){
    return `users/${id}`
  }

  _userFollowsPath(id){
    return `userFollows/${this._user.uid}/${id || ''}`
  }

  _followsUserPath(id){
    return `followsUser/${id}/${this._user.uid}`
  }


  _gamesPath(day){
    return `${this._userPath()}/games/${day}`;
  }

  _setLastLogin(){
    return this._updateUserProfile({
      last_login: Date.now(),
      id: this._user.uid
    });
    // return fbSet(fbRef(this._db, `${this._userPath()}/last_login`), Date.now());
  }

  async _dbFetch(path){
    const snapshot = await fbGet(fbChild(fbRef(this._db), path))

    if(snapshot.exists()){
      return snapshot.val();
    } else {
      return null;
    }
  }

  async _getUserProfile(id = this._user?.uid){
    return await this._dbFetch(this._userPath(id));
  }

  async _getUserFollows(){
    return await this._dbFetch(this._userFollowsPath());
  }

  async _initUserProfile(){
    const data = await this._getUserProfile();
    this._userFollows = await this._getUserFollows();
    if(data){
      this._userProfile = data;
    } else {
      // default profile for new user
      this._userProfile = {
        games:{}
      }
    }

    return this._userProfile;
  }

  _updateUserProfile(data){
    return fbUpdate(fbRef(this._db, this._userPath()), data);
  }


  // This assumes the proper error checking has already been done
  // And the friend does not already exist or it will be overwritten
  _addFriend(id){
    const friendData = { timestamp: Date.now() };;
    const updates = {};
    updates[`${this._userFollowsPath(id)}`] = friendData;
    updates[`${this._followsUserPath(id)}`] = friendData;
    //NB: This appears to call Set on each path here, not update...?? Why
    return fbUpdate(fbRef(this._db), updates);
  }

  async _onAuth(user){
  // Triggers on firebase auth change
    if (user) {
      if(!this._user){
        // User is signed in for the first time
        console.log('Successfully Authed');
        console.log(user.uid);

        // this._test();

        this._user = user;

        // Set last login time This will also create the user if necessary
        await this._setLastLogin();

        // Get profile (which should exist after the above)
        await this._initUserProfile()
        await this.fetchFriends();    //default friend fetch after we get the follows

        this._authCallback?.(this._userProfile);
        return this._userProfile;
      }
    } else {
      // User is signed out
    }
  }

  // Returns a cached sorted array of friends (most recent first)
  // Does not fetch anything just uses already fetched data
  _getFriendIdArray(){
    if(!this._userFollows){
      return [];
    }

    if(this._friendIdArray){
      return this._friendIdArray;
    }

    this._friendIdArray = Object.keys(this._userFollows)
      .sort( (a, b) => this._userFollows[a].timestamp > this._userFollows[b].timestamp );

    return this._friendIdArray;
  }

  // Public methods
  getUserProfile(){
    //TODO: should return a deep copy or something here to prevent mutation
    return this._userProfile;
  }

  getUserId(){
    return this._user?.uid;
  }

  getGame(id){
    return this._userProfile?.games?.[id];
  }

  setName(name){
    if(typeof name !== 'string'){
      throw new Error('Name is not a string');
    }
    this._userProfile.name = name;  // this is ugly, but not sure how to avoid without unecessary fetches
    return fbSet(fbRef(this._db, `${this._userPath()}/name`), name);
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
      fbSet(fbRef(this._db, this._gamesPath(day)), st)
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

  async addFriendWithId(id){
    if(!this._userProfile){
      return { error: 'User is not initialized' };
    }

    // Look up friend
    try {
      const friendData = await this._getUserProfile(id)
      console.log(`Got data for user ${id}`);
      console.log(friendData);
      if(!friendData){
        return { error: 'Could not find friend' }
      }

      if(this._userFollows?.[id]){
        return friendData; //Already friends
      }

      // If exists add follow to current user
      await this._addFriend(id);

      return friendData;

    } catch(e) {
      console.log(e);
      return { error: e };
    };
  }

  // Offset is for pagination
  // Fetches friends in timestamp order from most recent
  async fetchFriends(offset = 0, limit = 100){
    const friendIdArray = this._getFriendIdArray().slice(offset, offset + limit);
    if(friendIdArray.length === 0){
      return null;
    }

    const data = await Promise.all(friendIdArray.map( (d) => this._getUserProfile(d)));

    if(!this._friendsData){
      this._friendsData = {};
    }

    data.forEach( d => this._friendsData[d.id]=d)

    console.log(`Got friends detail for ${data.length} friends`);

    return this.getFriendsData();
  }

  getFriendsData(){
    return this._getFriendIdArray().map(d => this._friendsData[d]);
  }
}
