
import { ReactComponent as Close } from '../data/Close.svg'
import Modal from 'react-modal'
import {FriendAllGames, FriendSummary} from './FriendDisplay'
import structuredClone from '@ungap/structured-clone';

Modal.setAppElement('#root')

export const FriendsModal = ({ isOpen, handleClose, darkMode, colorBlindMode, styles, db }) => {
  styles = structuredClone(styles); //deep copy because apparently this is a ref

  styles.content.maxHeight = null;

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} style={styles} contentLabel="Game Info Modal">
      <div className={(darkMode ? 'dark' : '') + ' h-full overflow-auto'}>
        <button
          className="absolute top-4 right-4 rounded-full nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark p-1 w-6 h-6 sm:p-2 sm:h-8 sm:w-8 z-50"
          onClick={handleClose}
        >
          <Close />
        </button>
        <div className="w-full flex flex-col items-center mx-auto pt-9 text-primary dark:text-primary-dark">
            {db.getFriendsData().map( d =>
            <div key={d.id} className="w-full">
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
    </Modal>
  )
};
