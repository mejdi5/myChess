const router = require('express').Router();
let Game = require('../models/GameModel');


//post new game
router.post("/", async (req, res)=> {
    const newGame = new Game(req.body)
    try {
        const game = await newGame.save()
        res.status(200).json(game)        
    } catch (error) {
        console.log('game not created', error)
    }
})

//get games of one user
router.get("/:userId", async (req, res)=> {
    try {
        const gamesWithWhite = await Game.find({
            whitePlayerId: req.params.userId,
        }) 
        const gamesWithBlack = await Game.find({
            blackPlayerId: req.params.userId,
        })
        const games = [...gamesWithWhite, ...gamesWithBlack]
        res.status(200).json({games, gamesWithWhite, gamesWithBlack})
    } catch (error) {
        res.status(500).json(error)
    }
})

//get one game
router.get('/game/:_id', async (req, res) => {
    const {_id}  = req.params;
    try {
        const game = await Game.findOne({_id});
        res.status(200).json(game);
    } catch (error) {
        console.log(error);
    }
});


//set a game as finished, set winner and history
router.put("/edit-game/:_id",  async (req, res) => {

    const { _id } = req.params;
    const {whitePlayerId, blackPlayerId, isFinished, winner, history} = req.body

    try {
    const game = await Game.findByIdAndUpdate(_id, {whitePlayerId, blackPlayerId, isFinished, winner, history});
    res.status(200).json({ msg: "game edited", game});

    } catch (error) {
    console.log('game not edited', error);
    }
});


module.exports = router;