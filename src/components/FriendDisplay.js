import Board from './Board';
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Display overall stats
export function FriendSummary({friendData}) {
  if(!friendData){
    return(<div/>)
  }

  return (
    <div>
      <li> Played {Object.values(friendData.games || {}).length || 0} games </li>
    </div>
  );
}

export function FriendGame({ friendData, userData, colorBlindMode, name}){
  if(!friendData){
    //friend has not played the game
    return <div />
  }

  // if user hasn't played the game don't display the answer, just the colors
  let colorsOnly = !userData;

  let footer = <div />
  if(colorsOnly){
    footer = (
      <div>
        <div>
          Play to see results
        </div>
        <div>
          <a href={`/g/${friendData.gameIndex}`}>
            <button
              type="button"
              className="rounded px-2 py-2 mt-2 w-24 text-sm nm-inset-n-green text-gray-50"
            >Play
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Board
        colorBlindMode={false}
        board={friendData.board}
        cellStatuses={friendData.cellStatuses}
        colorsOnly={colorsOnly}
        mode='small'
      />
      <div className="mb-10">
        <div>
          {name && `${name} played`} Game #{friendData.gameIndex}
        </div>
        <div>
          Played at {new Date(friendData.timestamp).toLocaleString()}
        </div>
        {footer}
      </div>
    </div>

  )
}

export function AllFriendsGame({ friendsData, userData, gameId, colorBlindMode}){
  if (!friendsData){
    return (<div />)
  }

  let sortedGames = Object.values(friendsData)
    .map( d => {
      return {name: d.name, id: d.id, game: d.games?.[gameId]}
    }) // get the game if it exists
    .filter( d => d.game) // remove nulls
    .sort((a, b) => {
      return a.timestamp > b.timestamp;
    });

  return (
    <div>
      <div>
        {sortedGames.length} friends have completed this game
      </div>
      <Carousel
        styles={styles}
        showThumbs={false}
        centerMode
        centerSlidePercentage={70}
        showStatus={false}
        infiniteLoop={true}
      >
        { sortedGames.map((g) =>
            <div className="m-5" key={g.id} >
              <FriendGame
                friendData={g.game}
                userData={userData.games[gameId]}
                colorBlindMode={colorBlindMode}
                name={g.name}
              />
            </div>
          )
        }
      </Carousel>
    </div>
  );
}

export function FriendAllGames({friendData, userData, colorBlindMode}){
  if (!friendData?.games){
    return (<div />)
  }

  let sortedGames = Object.values(friendData.games)
        .sort((a, b) => {
          return a.timestamp > b.timestamp;
      })

  return (
    <div>
      <Carousel
        styles={styles}
        showThumbs={false}
        centerMode
        centerSlidePercentage={70}
        showStatus={false}
        infiniteLoop={true}
      >
        { sortedGames.map((g) =>
            <div className="m-5" key={g.gameIndex} >
              <FriendGame
                friendData={g}
                userData={userData.games[g.gameIndex]}
                colorBlindMode={colorBlindMode}
              />
            </div>
          )
        }
      </Carousel>
    </div>
  );
}
