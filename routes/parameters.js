
const express = require('express');
const router = express.Router();//ליצור אובייקט שדרכו נגדיר מסלולים

const Parameter = require('../models/Parameter')

//מגדיר מסלול חדש מסוג POST שמאזין לבקשות שנשלחות לכתובת parameters/
router.post('/', async (req, res) =>{
    try{
        const newParameter = new Parameter({
            altitude: req.body.altitude,
            HSI: req.body.HSI,
            ADI: req.body.ADI
        });

        const saved = await newParameter.save();
        res.status(201).json(saved);

    }catch(err){
        res.status(400).json({error: err.message });
    }
});

module.exports = router;

// בקשה שמחזירה את כל הנתונים שנשמרו במסד הנתונים
router.get('/', async (req, res) => {
    try {
        const allParameters = await Parameter.find();
        res.json(allParameters);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  });
  