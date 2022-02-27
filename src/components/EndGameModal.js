import Modal from 'react-modal'
import { ReactComponent as Close } from '../data/Close.svg'
import { useEffect, useState } from 'react'
import { status } from '../constants'
import Success from '../data/Success.png'
import Fail from '../data/Cross.png'
import WIP from '../data/WIP3.png'
import {AllFriendsGame} from './FriendDisplay'

Modal.setAppElement('#root')

export const EndGameModal = ({
  isOpen,
  handleClose,
  styles,
  darkMode,
  gameState,
  state,
  currentStreak,
  longestStreak,
  answer,
  playAgain,
  day,
  currentRow,
  cellStatuses,
  colorBlindMode,
  gameId,
  db
}) => {
  const CloseButton = () => {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <button
          type="button"
          className="rounded px-6 py-2 mt-8 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
          onClick={playAgain}
        >
          Close
        </button>
      </div>
    )
  }

  function getOccurrence(array, value) {
    var count = 0
    if (array) {
      for (let i=0; i<array.length; i++) {
        if (array[i] == value) {
          count += 1
        }
      }
    }
    return count
  }

  function doShare(){
    setButtonPressed(true)
    navigator.clipboard.writeText(
      `Wordle ${day} ${gameState === state.won ? currentRow: 'X'}/6\n\n` +
      cellStatuses
      .map((row) => {
        if (row.every((item) => item !== status.unguessed)) {
          return (
            row
            .map((state) => {
              switch (state) {
                case status.gray:
                  if (darkMode) {
                    return '⬛'
                  }
                  else {
                    return '⬜'
                  }
                case status.green:
                  return '🟩'
                case status.yellow:
                  return '🟨'
                default:
                  return '  '
              }
            })
            .join('') + '\n'
          )
        } else {
          return ''
        }
      })
      .join('')
    )
  }

  const gameStateList = JSON.parse(localStorage.getItem('gameStateList'))
  var wins = getOccurrence(gameStateList, 'won')
  var losses = getOccurrence(gameStateList, 'lost')
  const [buttonPressed, setButtonPressed] = useState(false)

  const ShareButton = (props) => {
    useEffect(() => {
      if (buttonPressed !== false) {
        setTimeout(() => setButtonPressed(false), [3000])
      }
    }, [buttonPressed])
    return (
      <button
        type="button"
        className="rounded px-6 py-2 mt-8 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
        onClick={doShare}
      >
        {buttonPressed ? 'Copied!' : 'Share'}
      </button>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={styles}
      contentLabel="Game End Modal"
    >
      <div className={(darkMode ? 'dark' : '') + ' h-full overflow-auto'}>
        <div className="absolute top-4 right-4 z-50">
          <button
            className="rounded-full nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark p-1 w-6 h-6 sm:p-2 sm:h-8 sm:w-8"
            onClick={playAgain}
          >
            <Close />
          </button>
        </div>
        <div className="h-full flex flex-col items-center mx-auto text-primary dark:text-primary-dark">
          {gameState === state.won && (
            <div className="max-w-[300px]">
              <img src={Success} alt="success" height="auto" width="auto" />
              <h1 className=" text-3xl">Congrats!</h1>
            </div>
          )}
          {gameState === state.lost && (
            <>
              <img src={Fail} alt="success" height="auto" width="80%" />
              <div className="text-primary dark:text-primary-dark text-4xl text-center">
                <p>Oops!</p>
                <p className="mt-3 text-2xl">
                  The word was <strong>{answer}</strong>
                </p>
              </div>
            </>
          )}
          {gameState === state.playing && (
            <div className="max-w-[300px]">
              <img src={WIP} alt="keep playing" height="auto" width="80%" />
            </div>
          )}
          <div className="text-primary dark:text-primary-dark text-4xl text-center">
            <p className="mt-3 text-2xl">
              Won: {wins}
            </p>
            <p className="mt-3 text-2xl">
              Lost: {losses}
            </p>
          </div>
          <ShareButton />
          <div className="w-full">
            <AllFriendsGame
              friendsData={db.getFriendsData()}
              userData={db.getUserProfile()}
              gameId={gameId}
              colorBlindMode={colorBlindMode}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
