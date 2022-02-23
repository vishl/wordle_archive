import { status } from '../constants.js'


export default function Board({
  colorBlindMode,
  board,
  cellStatuses,
  currentRow,
  submittedInvalidWord
}){
  function getCellStyles(rowNumber, colNumber, letter) {
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




  return (
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
  );
}
