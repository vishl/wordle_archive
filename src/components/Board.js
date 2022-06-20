import { status } from '../constants.js'


export default function Board({
  colorBlindMode,
  board,
  cellStatuses,
  currentRow,
  submittedInvalidWord,
  colorsOnly,
  mode
}){
  function getCellStyles(rowNumber, colNumber, letter, mode) {
    let s = ""
    if (rowNumber === currentRow) {
      if (letter) {
        s += `nm-inset-background dark:nm-inset-background-dark text-primary dark:text-primary-dark ${
            submittedInvalidWord ? 'border border-red-800' : ''
          }`;
      }else{
        s += 'nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark';
      }
    }

    switch (cellStatuses[rowNumber][colNumber]) {
      case status.green:
        if (colorBlindMode) {
          s += 'nm-inset-orange-500 text-gray-50';
        }
        else {
          s += 'nm-inset-n-green text-gray-50';
        }
        break;
      case status.yellow:
        if (colorBlindMode) {
          s += 'nm-inset-blue-300 text-gray-50';
        }
        else {
          s += 'nm-inset-yellow-500 text-gray-50';
        }
        break;
      case status.gray:
        s += 'nm-inset-n-gray text-gray-50';
        break;
      default:
        s += 'nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark';
    }

    if(mode === 'small'){
      s += ' inline-flex items-center font-medium justify-center text-xl w-[7vw] h-[7vw] xs:w-7 xs:h-7 sm:w-7 sm:h-7 rounded';
    }else{
      s += ' inline-flex items-center font-medium justify-center text-xl w-[12vw] h-[12vw] xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded';
    }
    return s;
  }




  return (
    <div className="flex items-center flex-col py-4">
      <div className={`grid grid-cols-5 grid-flow-row ${mode==='small' ? "gap-2" : "gap-4"}`}>
        {board.map((row, rowNumber) =>
          row.map((letter, colNumber) => (
            <span
              key={colNumber}
              className={`${getCellStyles(
                rowNumber,
                colNumber,
                letter,
                mode
              )}`}
            >
              {colorsOnly ? '' : letter}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
