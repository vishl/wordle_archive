import { ReactComponent as Close } from '../data/Close.svg'
import { useEffect, useState, useRef } from 'react'
import Modal from 'react-modal'
import { Switch } from '@headlessui/react'
import { useForm } from 'react-hook-form'

Modal.setAppElement('#root')


export const SettingsModal = ({
  isOpen,
  handleClose,
  styles,
  darkMode,
  toggleDarkMode,
  colorBlindMode,
  toggleColorBlindMode,
  db
}) => {

  function updateName(data){
    console.log(data);
  }

  const {register, handleSubmit} = useForm({mode: 'onBlur'});
  const [name, setName] = useState(db?.getUserProfile()?.name);

  //if name changes, write it back to the server
  useEffect( () => {
    if(name){
      db.setName(name);
    }
  }, [name])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={styles}
      contentLabel="Settings Modal"
    >
      <div className={`h-full ${darkMode ? 'dark' : ''}`}>
        <div className={`h-full flex flex-col items-center justify-center mx-auto pt-9 text-primary dark:text-primary-dark `} >
          <h1 className="text-center mb-4 sm:text-3xl text-2xl">Settings</h1>
          <div className="flex-1 w-full border-b border-slate-400 mb-4">
            <button
              className="absolute top-4 right-4 rounded-full nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark p-1 w-6 h-6 sm:p-2 sm:h-8 sm:w-8"
              onClick={handleClose}
            >
              <Close />
            </button>

            <Switch.Group as="div" className="flex items-center mb-6">
              <Switch.Label as="span" className="w-1/3 pr-4 text-right cursor-pointer">
                Dark Mode
              </Switch.Label>

              <div className="w-2/3">
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className={`${
                    darkMode
                      ? 'nm-inset-yellow-500 border-background-dark'
                      : 'nm-inset-background border-transparent'
                  } relative inline-flex flex-shrink-0 h-8 w-14 p-1 border-2 rounded-full cursor-pointer transition ease-in-out duration-200`}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      darkMode ? 'translate-x-[1.55rem]' : 'translate-x-0'
                    } absolute pointer-events-none inline-block top-1/2 -translate-y-1/2 h-5 w-5 shadow rounded-full bg-white transform ring-0 transition ease-in-out duration-200`}
                  />
                </Switch>
              </div>
            </Switch.Group>

            <Switch.Group as="div" className="flex items-center mt-8">
              <Switch.Label as="span" className="w-1/3 pr-4 text-right cursor-pointer">
                Color Blind Mode
              </Switch.Label>
              <div className="w-2/3">
                <Switch
                  checked={colorBlindMode}
                  onChange={toggleColorBlindMode}
                  className={`${
                    colorBlindMode
                      ? 'nm-inset-yellow-500'
                      : 'nm-inset-background'
                  } ${darkMode ? 'border-background-dark' : ''} relative inline-flex flex-shrink-0 h-8 w-14 p-1 border-2 rounded-full cursor-pointer transition ease-in-out duration-200`}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      colorBlindMode ? 'translate-x-[1.55rem]' : 'translate-x-0'
                    } absolute pointer-events-none inline-block top-1/2 -translate-y-1/2 h-5 w-5 shadow rounded-full bg-white transform ring-0 transition ease-in-out duration-200`}
                  />
                </Switch>
              </div>
            </Switch.Group>

            <form className="w-full mt-8"
              onBlur={handleSubmit(updateName)}
              onSubmit={handleSubmit(updateName)}
            >
              <div className="sm:flex sm:items-center mb-6">
                <div className="sm:w-1/3">
                  <label className="block sm:text-right mb-1 sm:mb-0 pr-4" htmlFor="inline-full-name">
                    Name
                  </label>
                </div>
                <div className="sm:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    {...register('name')}
                    id="name"
                    aria-label="Name"
                    placeholder="Name"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  )
}
