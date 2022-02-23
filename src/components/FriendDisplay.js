
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

export function FriendGame({friendData, userData, gameId}){
  if(!friendData || !userData || !gameId){
    return (<div>Invalid Data</div>)
  }

  let f = friendData.game[gameId];
  if(!f){
    //friend has not played the game
    return <div />
  }

  let u = userData.game[gameId];
  // if user hasn't played the game don't display the answer, just the colors
  let showLetters = !!u;

  return (
    //render a board here TODO
    <div />

  )


}
