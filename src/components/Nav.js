import { Menu } from '@headlessui/react'
import { classNames, state} from '../constants'


export const Nav = ({
  playPrevious,
  playRandom,
  playNext,
  playLast,
  playDay,
  playFirst,
  items_list,
  gameStateList

}) => {
  var elements = items_list.map(i => {
    return (
      <Menu.Item key={i}>
        {({ active }) =>
          (
            <a onMouseDown={() => playDay(i)} className=
              {
                classNames(active ? 'font-bold text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm '+gameStateList[i-1])
              }>{i+((gameStateList[i-1] == state.won) ? ' ✔' : ((gameStateList[i-1] == state.lost) ? ' ✘' : ''))}
            </a>
          )
        }
      </Menu.Item>
    );
  });

  return (
    <div>
        <div className="flex flex-force-center items-center py-3">
          <div className="flex items-center px-2">
            <button
              type="button"
              className="rounded px-2 py-2 mt-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
              onClick={playPrevious}>Previous
            </button>
          </div>
          <div className="flex items-center px-2">
            <button
              type="button"
              className="rounded px-2 py-2 mt-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
              onClick={playRandom}>Random
            </button>
          </div>
          <div className="flex items-center px-2">
            <button
              type="button"
              className="rounded px-2 py-2 mt-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
              onClick={playNext}>Next
            </button>
          </div>
        </div>
        <div className="flex flex-force-center items-center py-3">
          <div className="flex items-center px-2">
            <button
              type="button"
              className="rounded px-2 py-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
              onClick={playFirst}>First
            </button>
          </div>
          <div className="flex items-center px-2">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="blurthis rounded px-2 py-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark">
                  Choose
                </Menu.Button>
              </div>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-42 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-scroll h-56">
                  <div className="py-1">
                    {elements}
                  </div>
                </Menu.Items>
            </Menu>
          </div>
          <div className="flex items-center px-2">
            <button
              type="button"
              className="rounded px-2 py-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
              onClick={playLast}>Last
            </button>
          </div>
        </div>
    </div>

  )

}
