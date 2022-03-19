import axios from 'axios';
import {GET_ONE_GAME, GET_GAMES} from './ActionTypes'


//get games of one user
export const getGames = (userId) => (dispatch) => {
    axios
    .get(`/api/games/${userId}`)
    .then((res) => dispatch({ type: GET_GAMES, payload: res.data.games }))
    .catch((err) => console.log(err));
};

//Get one game
export const getOneGame = gameId => (dispatch) => {
    axios
    .get(`/api/games/game/${gameId}`)
    .then((res) => dispatch({ type: GET_ONE_GAME, payload: res.data }))
    .catch((err) => console.log(err));
};

//post new game
export const postGame = (newGame, userId) => (dispatch) => {
    axios
    .post(`/api/games`, newGame)
    .then((res) => dispatch(getGames(userId)))
    .catch((err) => console.log(err));
};

//edit game
export const editGame = (userId, gameId, editedGame) => (dispatch) => {
    axios
    .put(`/api/games/edit-game/${gameId}`, editedGame)
    .then((res) => dispatch(getGames(userId)))
    .catch((err) => console.log(err));
};



