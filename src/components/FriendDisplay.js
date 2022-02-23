import Board from './Board'

// Display overall stats
export function FriendSummary({friendData}) {
  if(!friendData){
    return(<div/>)
  }

  return (
    <div>
      <li> Played {friendData.games?.length || 0} games </li>
    </div>
  );
}

export function FriendGame({ friendData, userData, colorBlindMode}){
  if(!friendData || !userData ){
    return (<div>Invalid Data</div>)
  }

  if(!friendData){
    //friend has not played the game
    return <div />
  }

  // if user hasn't played the game don't display the answer, just the colors
  let colorsOnly = !userData;

  return (
    <Board
      colorBlindMode={false}
      board={friendData.board}
      cellStatuses={friendData.cellStatuses}
      colorsOnly={colorsOnly}
      mode='small'
    />

  )


}
