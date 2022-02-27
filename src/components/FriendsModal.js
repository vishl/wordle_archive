
import { ReactComponent as Close } from '../data/Close.svg'
import Modal from 'react-modal'
import {FriendAllGames, FriendSummary} from './FriendDisplay'

Modal.setAppElement('#root')

export const FriendsModal = ({ isOpen, handleClose, darkMode, colorBlindMode, styles, db }) => {

  styles.content.maxHeight = null;

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} style={styles} contentLabel="Game Info Modal">
      <div className={`h-full ${darkMode ? 'dark' : ''}`}>
        <button
          className="absolute top-4 right-4 rounded-full nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark p-1 w-6 h-6 sm:p-2 sm:h-8 sm:w-8"
          onClick={handleClose}
        >
          <Close />
        </button>
        <div className="h-full flex flex-col items-center justify-center max-w-[390px] mx-auto pt-9 text-primary dark:text-primary-dark">
          <div className={`h-full ${darkMode ? 'dark' : ''}`}>
            {db.friendsData().map( d =>
            <div key={d.id} >
              <div>
                {d.name}
              </div>
              <FriendSummary friendData={d} />
              <FriendAllGames
                friendData={d}
                userData={db.getUserProfile()}
              />
            </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
};
