
import { useEffect, useState, useRef } from 'react'
import { ReactComponent as Settings } from '../data/Settings.svg'
import { ReactComponent as Share } from '../data/Share.svg'
import { ReactComponent as Info } from '../data/Info.svg'
import { InfoModal } from './InfoModal'
import { SettingsModal } from './SettingsModal'
import { FriendsModal } from './FriendsModal'
import { modalStyles, modalStylesDark } from '../styles'
import { useLocalStorage } from '../hooks/useLocalStorage'



export const Header = ({
  day,
  gameStateList,
  darkMode,
  colorBlindMode,
  toggleDarkMode,
  toggleColorBlindMode,
  toggleShareModal,
  isAuthed,
  db
}) => {

  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)
  const [friendModalIsOpen, setFriendsModalIsOpen] = useState(false)
  const [firstTime, setFirstTime] = useLocalStorage('first-time', true)
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(firstTime)


  const handleInfoClose = () => {
    setFirstTime(false)
    setInfoModalIsOpen(false)
  }

  let header_symbol = (gameStateList[day-1] == 'won') ? ('✔') : ((gameStateList[day-1] == 'lost') ? ('✘') : '')

  let friends;
  if(isAuthed){
    friends = (
            <button type="button" onClick={() => setFriendsModalIsOpen(true)}>
              Friends
            </button>
    );
  }

  return (
    <div>
        <header className="flex items-center py-2 px-3 text-primary dark:text-primary-dark">
          <button type="button" onClick={() => setSettingsModalIsOpen(true)}>
            <Settings />
          </button>

          {friends}

          <h1 className={"flex-1 text-center text-l xxs:text-lg sm:text-3xl tracking-wide font-bold font-og"}>
            WORDLE ARCHIVE {day} {header_symbol}
          </h1>
          <button className="mr-2" type="button" onClick={toggleShareModal}>
            <Share />
          </button>
          <button type="button" onClick={() => setInfoModalIsOpen(true)}>
            <Info />
          </button>
        </header>
        <FriendsModal
          isOpen={friendModalIsOpen}
          handleClose={() => setFriendsModalIsOpen(false)}
          styles={darkMode ? modalStylesDark : modalStyles}
          darkMode={darkMode}
          db={db}
        />
        <SettingsModal
          isOpen={settingsModalIsOpen}
          handleClose={() => setSettingsModalIsOpen(false)}
          styles={darkMode ? modalStylesDark : modalStyles}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          colorBlindMode={colorBlindMode}
          toggleColorBlindMode={toggleColorBlindMode}
          db={db}
        />
        <InfoModal
          isOpen={infoModalIsOpen}
          handleClose={handleInfoClose}
          darkMode={darkMode}
          colorBlindMode={colorBlindMode}
          styles={darkMode ? modalStylesDark : modalStyles}
        />
    </div>
  )
}
