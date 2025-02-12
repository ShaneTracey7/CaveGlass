import '../styles.css';
import React, {useState,useEffect} from 'react';
import redTrash from '../pics/red-trash.png';

function PlayerCard(props) {

    function deletePlayerCard()
    {   
        let temp = props.players[0];
        let newTemp = temp.filter((e)=>{ return e[0] != props.playerData[0];});
        props.players[1](newTemp);
        console.log('card deleted');
    }

    return (
        <div className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'} id={"color-" + props.teamInfo.abbrev}>
            <div id="player-card-layer2"className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'} style={{backgroundImage: "url(" + props.teamInfo.logo + ")"}}>
                <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                <div id="player-card-layer3"className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'}>
                    <img className='player-card-delete' onClick={() => {deletePlayerCard()}} src={redTrash} alt='delete'/>
                    <img className='player-card-img' src={props.playerData[5]} alt={props.playerData[1]}/>
                </div>
            </div>
        </div>
      );
  }
  
  export default PlayerCard;