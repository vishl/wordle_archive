import { useEffect, useState, useRef } from 'react'
import { letters, status, wordle_answers, state} from './constants'
import { Keyboard } from './components/Keyboard'
import words from './data/words'

import { useLocalStorage } from './hooks/useLocalStorage'
import { EndGameModal } from './components/EndGameModal'
import { Header } from './components/Header'
import { Nav } from './components/Nav'

// import { Transition } from '@headlessui/react'

import { modalStyles, modalStylesDark } from './styles'

// Import the functions you need from the SDKs you need
import { initializeApp as fbInit } from "firebase/app";
import { getAnalytics as fbGetAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
import { getDatabase, get, set, ref, child } from "firebase/database";


const getDayAnswer = (day_) => {
  return wordle_answers[day_-1].toUpperCase()
}

// Set the day number of the puzzle to display and show it as the address bar query string

const setDay = newDay => {
  if (newDay < 1 || newDay > og_day) return;
  day = newDay;
  window.history.pushState({}, '', '?' + day);
};

const getDay = (og_day) => {
  const { search } = document.location;
  var url_day = og_day
  if (search) {
    if (isNaN(search.slice(1))) {
      url_day = og_day
    } else {
      url_day = parseInt(search.slice(1), 10);
    }
    if (url_day > og_day || url_day < 1) {
      url_day = og_day
    }
    return url_day
  }
  else {
    return og_day
  }
}

const getOGDay = () => {
  const today = new Date()
  const date1 = new Date('6/21/21')
  const diffTime = Math.abs(today - date1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const toDate = (day) => {
  let date1 = new Date('6/21/21')
  date1 += day * (1000 * 60 * 60 * 24)
  return date1
}

var day;
const og_day = getOGDay() //This is today
setDay(getDay(og_day));
var items_list = []
for (var i=1;i<=og_day;i++) {
  items_list.push(i)
}

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

let fbApp, fbAnalytics;

function Init(){
  // Initialize Firebase
  fbApp = fbInit(firebaseConfig);
  fbAnalytics = fbGetAnalytics(fbApp);
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // ...
    });
  }

let _user, _userProfile, _db;

function App() {
  console.log('Run');

  const reloadCount = Number(sessionStorage.getItem('reloadCount')) || 0;

  const initialStates = {
    answer: () => getDayAnswer(day),
    gameState: state.playing,
    board: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ],
    cellStatuses: () => Array(6).fill(Array(5).fill(status.unguessed)),
    currentRow: 0,
    currentCol: 0,
    letterStatuses: () => {
      const letterStatuses = {}
      letters.forEach((letter) => {
        letterStatuses[letter] = status.unguessed
      })
      return letterStatuses
    },
  }

  const [answer, setAnswer] = useState(initialStates.answer)
  const [gameState, setGameState] = useState(initialStates.gameState)
  const [gameStateList, setGameStateList] = useLocalStorage('gameStateList', Array(500).fill(initialStates.gameState))
  const [board, setBoard] = useState(initialStates.board)
  const [cellStatuses, setCellStatuses] = useState(initialStates.cellStatuses)
  const [currentRow, setCurrentRow] = useState(initialStates.currentRow)
  const [currentCol, setCurrentCol] = useState(initialStates.currentCol)
  const [letterStatuses, setLetterStatuses] = useState(initialStates.letterStatuses)
  const [submittedInvalidWord, setSubmittedInvalidWord] = useState(false)
  const [currentStreak, setCurrentStreak] = useLocalStorage('current-streak', 0)
  const [longestStreak, setLongestStreak] = useLocalStorage('longest-streak', 0)
  const streakUpdated = useRef(false)
  const [modalIsOpen, setIsOpen] = useState(false)


  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false)
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const [colorBlindMode, setColorblindMode] = useLocalStorage('colorblind-mode', false)
  const toggleColorBlindMode = () => {
    setColorblindMode((prev) => !prev)
  }

  const toggleShareModal = () => {
    openModal()
  }


  useEffect(() => {
    if (gameState !== state.playing) {
      setTimeout(() => {
        openModal()
      }, 500)
    }
  }, [gameState])

  useEffect(() => {
    if (!streakUpdated.current) {
      if (gameState === state.won) {
        if (currentStreak >= longestStreak) {
          setLongestStreak((prev) => prev + 1)
        }
        setCurrentStreak((prev) => prev + 1)
        streakUpdated.current = true
      } else if (gameState === state.lost) {
        setCurrentStreak(0)
        streakUpdated.current = true
      }
    }
  }, [gameState, currentStreak, longestStreak, setLongestStreak, setCurrentStreak])

  useEffect(() => {
    if (localStorage.getItem('gameStateList') == null) {
      setGameStateList(gameStateList)
    }
  }, [])

  useEffect(() => {
    if (reloadCount < 1) {
      window.location.reload(true);
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  }, [og_day])

  const getCellStyles = (rowNumber, colNumber, letter) => {
    if (rowNumber === currentRow) {
      if (letter) {
        return `nm-inset-background dark:nm-inset-background-dark text-primary dark:text-primary-dark ${
          submittedInvalidWord ? 'border border-red-800' : ''
        }`
      }
      return 'nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark'
    }

    switch (cellStatuses[rowNumber][colNumber]) {
      case status.green:
        if (colorBlindMode) {
          return 'nm-inset-orange-500 text-gray-50'
        }
        else {
          return 'nm-inset-n-green text-gray-50'
        }
      case status.yellow:
      if (colorBlindMode) {
        return 'nm-inset-blue-300 text-gray-50'
      }
      else {
        return 'nm-inset-yellow-500 text-gray-50'
      }
      case status.gray:
        return 'nm-inset-n-gray text-gray-50'
      default:
        return 'nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark'
    }
  }

  const addLetter = (letter) => {
    document.activeElement.blur()
    setSubmittedInvalidWord(false)
    setBoard((prev) => {
      if (currentCol > 4) {
        return prev
      }
      const newBoard = [...prev]
      newBoard[currentRow][currentCol] = letter
      return newBoard
    })
    if (currentCol < 5) {
      setCurrentCol((prev) => prev + 1)
    }
  }

  const isValidWord = (word) => {
    if (word.length < 5) return false
    return words[word.toLowerCase()]
  }

  const onEnterPress = () => {
    const word = board[currentRow].join('')
    if (!isValidWord(word)) {
      setSubmittedInvalidWord(true)
      return
    }

    if (currentRow === 6) return

    updateCellStatuses(word, currentRow)
    updateLetterStatuses(word)
    setCurrentRow((prev) => prev + 1)
    setCurrentCol(0)
  }

  const onDeletePress = () => {
    setSubmittedInvalidWord(false)
    if (currentCol === 0) return

    setBoard((prev) => {
      const newBoard = [...prev]
      newBoard[currentRow][currentCol - 1] = ''
      return newBoard
    })

    setCurrentCol((prev) => prev - 1)
  }

  const updateCellStatuses = (word, rowNumber) => {
    setCellStatuses((prev) => {
      const newCellStatuses = [...prev]
      newCellStatuses[rowNumber] = [...prev[rowNumber]]
      const wordLength = word.length
      const answerLetters = answer.split('')

      // set all to gray
      for (let i = 0; i < wordLength; i++) {
        newCellStatuses[rowNumber][i] = status.gray
      }

      // check greens
      for (let i = wordLength - 1; i >= 0; i--) {
        if (word[i] === answer[i]) {
          newCellStatuses[rowNumber][i] = status.green
          answerLetters.splice(i, 1)
        }
      }

      // check yellows
      for (let i = 0; i < wordLength; i++) {
        if (answerLetters.includes(word[i]) && newCellStatuses[rowNumber][i] !== status.green) {
          newCellStatuses[rowNumber][i] = status.yellow
          answerLetters.splice(answerLetters.indexOf(word[i]), 1)
        }
      }

      return newCellStatuses
    })
  }

  const onGameOver = () => {
    let st = {
        gameIndex: day,
        date:toDate(day),
        answer: answer,
        gameState: gameState,
        board: board,
        cellStatuses: cellStatuses,
        letterStatuses: letterStatuses
    }
    console.log(st);
    // add the game to the profile only if it doesn't exist
    if(!_userProfile.games?.[day]){
      //TODO: update streak as well
      set(ref(_db, `users/${_user.uid}/games/${day}`), st)
        .then( () => {
          //add it locally as well
          if(!_userProfile.games){
            _userProfile.games = {}
          }
          _userProfile.games[day] = st;
        });
    }
  }


  const isRowAllGreen = (row) => {
    return row.every((cell) => cell === status.green)
  }

  // every time cellStatuses updates, check if the game is won or lost
  useEffect(() => {
    const cellStatusesCopy = [...cellStatuses]
    const reversedStatuses = cellStatusesCopy.reverse()
    const lastFilledRow = reversedStatuses.find((r) => {
      return r[0] !== status.unguessed
    })

    if (lastFilledRow && isRowAllGreen(lastFilledRow)) {
      setGameState(state.won)
      let newGameStateList = JSON.parse(localStorage.getItem('gameStateList'))
      newGameStateList[day-1] = state.won
      localStorage.setItem('gameStateList', JSON.stringify(newGameStateList))
      onGameOver();
    } else if (currentRow === 6) {
      setGameState(state.lost)
      let newGameStateList = JSON.parse(localStorage.getItem('gameStateList'))
      newGameStateList[day-1] = state.lost
      localStorage.setItem('gameStateList', JSON.stringify(newGameStateList))
      onGameOver();
    }
  }, [cellStatuses, currentRow])

  const updateLetterStatuses = (word) => {
    setLetterStatuses((prev) => {
      const newLetterStatuses = { ...prev }
      const wordLength = word.length
      for (let i = 0; i < wordLength; i++) {
        if (newLetterStatuses[word[i]] === status.green) continue

        if (word[i] === answer[i]) {
          newLetterStatuses[word[i]] = status.green
        } else if (answer.includes(word[i])) {
          newLetterStatuses[word[i]] = status.yellow
        } else {
          newLetterStatuses[word[i]] = status.gray
        }
      }
      return newLetterStatuses
    })
  }


  const play = () => {
    setAnswer(initialStates.answer)
    setGameState(initialStates.gameState)
    setBoard(initialStates.board)
    setCellStatuses(initialStates.cellStatuses)
    setCurrentRow(initialStates.currentRow)
    setCurrentCol(initialStates.currentCol)
    setLetterStatuses(initialStates.letterStatuses)
  }
  const playFirst = () => playDay(1)
  const playPrevious = () => playDay(day - 1)
  const playRandom = () => playDay(Math.floor(Math.random() * (og_day-1)) + 1)
  const playNext = () => playDay(day + 1)
  const playLast = () => playDay(og_day)

  const playDay = (i) => {
    setDay(i)
    play()
  }

  Init();
  const auth = getAuth();
  // Triggers on firebase auth change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if(!_user){
        // User is signed in for the first time
        console.log('Successfully Authed');
        console.log(user.uid);
        const uid = user.uid;
        _db = getDatabase(fbApp);
        _user = user;
        // This will also create the user if necessary
        set(ref(_db, `users/${uid}/last_login`), Date.now());
        // Get profile if it exists
        get(child(ref(_db), `users/${uid}`)).then((snapshot) => {
          if(snapshot.exists()){
            _userProfile = snapshot.val();
          } else {
            _userProfile = {
              games:{}
            }
          }
        });
      }
    } else {
      // User is signed out
      // ...
    }
  });


  var html;
  if (darkMode === true) {
    html = document.getElementsByTagName( 'html' )[0]; // '0' to assign the first (and only `HTML` tag)
    html.setAttribute( 'class', 'dark-bg' );
  }
  else {
    html = document.getElementsByTagName( 'html' )[0]; // '0' to assign the first (and only `HTML` tag)
    html.setAttribute( 'class', 'bg' );
  }

  return (
    <div className={darkMode ? 'dark h-fill' : 'h-fill'}>
      <div className={`flex flex-col justify-between h-fill bg-background dark:bg-background-dark`}>
        <Header
          day={day}
          gameStateList={gameStateList}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          colorBlindMode={colorBlindMode}
          toggleColorBlindMode={toggleColorBlindMode}
          toggleShareModal={toggleShareModal}
        />

        <Nav
          playPrevious = {playPrevious}
          playRandom   = {playRandom}
          playNext     = {playNext}
          playLast     = {playLast}
          playFirst    = {playFirst}
          items_list   = {items_list}
          gameStateList = {gameStateList}
        />

        <div className="flex items-center flex-col py-4">
          <div className="grid grid-cols-5 grid-flow-row gap-4">
            {board.map((row, rowNumber) =>
              row.map((letter, colNumber) => (
                <span
                  key={colNumber}
                  className={`${getCellStyles(
                    rowNumber,
                    colNumber,
                    letter
                  )} inline-flex items-center font-medium justify-center text-xl w-[14vw] h-[14vw] xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded`}
                >
                  {letter}
                </span>
              ))
            )}
          </div>
        </div>
        <EndGameModal
          isOpen={modalIsOpen}
          handleClose={closeModal}
          styles={ darkMode ? modalStylesDark : modalStyles}
          darkMode={darkMode}
          gameState={gameState}
          state={state}
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          answer={answer}
          playAgain={() => {
            closeModal()
            streakUpdated.current = false
          }}
          day={day}
          currentRow={currentRow}
          cellStatuses={cellStatuses}
        />
        <Keyboard
          letterStatuses={letterStatuses}
          addLetter={addLetter}
          onEnterPress={onEnterPress}
          onDeletePress={onDeletePress}
          gameDisabled={gameState !== state.playing}
          colorBlindMode={colorBlindMode}
        />
      </div>
    </div>
  )
}

export default App
