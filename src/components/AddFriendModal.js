import { useState } from 'react'
import { ReactComponent as Close } from '../data/Close.svg'
import Modal from 'react-modal'

Modal.setAppElement('#root')

export const AddFriendModal = ({
  isOpen,
  handleClose,
  darkMode,
  styles,
  friendId,
  db
}) => {

  let [friendData, setFriendData] = useState();
  let inside;
  if(friendData){
    if(friendData.error){
      inside = (
        <div>
          Error adding friend {friendId}
          <br />
          {friendData.error}
        </div>
      )
    } else {
      inside = (
        <div>
          Added friend '{friendData.name}'
        </div>
      )
    }
    // TODO: populate friend data
  } else {
    inside = (
      <div>
        Adding Friend {friendId}
      </div>
    )
  }

  // Only do this once
  if(!friendData){
    db.addFriendWithId(friendId).then( friend => {
      setFriendData(friend);
    });
  }

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
          {inside}
        </div>
      </div>
    </Modal>
  );
}