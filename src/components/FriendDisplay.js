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
      <li> Played {Object.values(friendData.games)?.length || 0} games </li>
    </div>
  );
}

export function FriendGame({ friendData, userData, colorBlindMode}){
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
      >
        { sortedGames.map((g) =>
            <div className="mb-5" key={g.gameIndex} >
              <FriendGame
                friendData={g}
                userData={userData.games[g.gameIndex]}
                colorBlindMode={colorBlindMode}
              />
              <div className="mb-10">
                <div>
                  {new Date(g.timestamp).toLocaleString()}
                </div>
                <div>
                  <a href={`/g/${g.gameIndex}`}>
                    <button
                      type="button"
                      className="rounded px-2 py-2 mt-2 w-24 text-sm nm-inset-n-green text-gray-50"
                      >Play
                    </button>
                  </a>
                </div>
              </div>
            </div>
          )
        }
      </Carousel>
    </div>
  );
}
