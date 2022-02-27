import { wbDb } from '../src/components/wb_db.js'
import { status, wordle_answers, state} from '../src/constants.js'
import dotenv from 'dotenv'
dotenv.config()


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_APIKEY,
  authDomain: process.env.REACT_APP_FB_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECTID,
  storageBucket: process.env.REACT_APP_FB_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FB_APPID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENTID,
  databaseURL: process.env.REACT_APP_FB_DB
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function onAuth(){
  console.log('got auth');
  createTestUsers();
}

function createTestUsers(){
  const baseUserId = 'gzNAQ9DncAPqtgmVc5aNunuXCnh1';
  const games = {}

  for(let i=227; i<= 237; i++){
    games[i] = {
      gameIndex: i,
      date:null,
      answer: wordle_answers[i],
      gameState: state.lost,
      board: [
        ['T', 'O', 'K', 'E', 'N'],
        ['T', 'A', 'K', 'E', 'N'],
        ['T', 'B', 'K', 'E', 'N'],
        ['T', 'C', 'K', 'E', 'N'],
        ['T', 'D', 'K', 'E', 'N'],
        ['T', 'E', 'K', 'E', 'N'],
      ],
      cellStatuses: Array(6).fill(Array(5).fill(status.unguessed)),
      letterStatuses: null,
      timestamp: Date.now()

    }
  }

  for(let i=0; i< 1; i++){
    createUser({friendOf:baseUserId, games:games});
  }
}

async function createUser(data){
  const id = `test${getRandomInt(10000000000)}`
  const db = new wbDb(firebaseConfig, { authCallBack: onAuth });
  db._user = {uid:id};
  await db._setLastLogin(); //initializes the profile
  await db._initUserProfile();
  console.log(`Created user ${id}`);
  Object.values(data.games).forEach( g => {
    db.logGame(g);
    console.log(`Logged game ${g.gameIndex}`);
  });

  //set the user to the main id, and add a follow for this user
  db._user.uid = data.friendOf
  db.addFriendWithId(id);
  console.log(`Added friend ${data.friendOf}`);
}

console.log('Running');

console.log(firebaseConfig);

// const db = new wbDb(firebaseConfig, { authCallBack: onAuth });
// db.signIn();

createTestUsers();
