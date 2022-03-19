const router = require('express').Router();
const Invitation = require('../models/InvitationModel');

//post new invitation
router.post("/", async (req, res)=> {
    const newInvitation = new Invitation(req.body)
    try {
        const invitation = await newInvitation.save()
        res.status(200).json(invitation)        
    } catch (error) {
        res.status(500).json(error)
    }
})

//get invitations received by a user
router.get("/:userId", async (req, res)=> {
    try {
        const invitations = await Invitation.find({
            receiverId: req.params.userId,
        }) 
        res.status(200).json(invitations)
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete invitation
router.delete('/delete/:_id', async (req, res) => {
    const  _id  = req.params._id;
    try {
        const invitation = await Invitation.findOneAndDelete({ _id });
        res.json({ msg: `invitation deleted`, invitation });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;