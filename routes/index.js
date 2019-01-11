const express = require("express");
const router = express.Router();

const Worker = require("../models/worker-model.js");
const Shift = require("../models/shift-model.js");

router.get('/', (req, res, next) => {
  res.render("index")
})

// route to fetch all workers data from DB
router.get("/workers", (req, res, next) => {
  Worker.find()
    .sort({ first_name: -1 })
    .then(data => {
      res.locals.workers = data;
      res.render("workers.hbs");
    })
    .catch(err=>next(err))
});

// POST to CREATE a worker document in the DB
router.post("/worker/add", (req, res, next) => {
  const {first_name, status} = req.body
  if(!first_name || !status){
    res.redirect('/workers');
    return;
  }
  Worker.create({ first_name, status })
    .then(() => {
      res.redirect("/workers");
    })
    .catch(err=>next(err))
});

// route to get page to edit worker info
router.get("/worker/:workerId/edit", (req, res, next) => {
  const {workerId} = req.params
  Worker.findById(workerId)
    .then(data => {
      res.locals.worker = data;
      res.render("edit-worker.hbs");
    })
    .catch(err=>next(err))
});

// route to delete worker
router.get("/worker/:workerId/delete", (req, res, next) => {
  const {workerId} = req.params
  Worker.findByIdAndRemove(workerId)
    .then(data => {
      res.locals.worker = data;
      Shift.deleteMany({user_id : {$eq : workerId}})
      .then(data=>{
        res.redirect("/workers")
      }
      )
    })
    .catch(err=>next(err))
});


// POST to UPDATE worker document in DB
router.post("/worker/:workerId/edit", (req, res, next) => {
  const {first_name, status} = req.body
  const {workerId} = req.params
  if(!first_name || !status){
    res.redirect(`/worker/${workerId}/edit`);
    return;
  }

  Worker.findByIdAndUpdate(
    workerId,
    { first_name, status },
    { runValidators: true }
  )
    .then(() => {
      res.redirect("/workers");
    })
    .catch(err=>next(err))
});

// route to fetch all shift data from DB
router.get("/shifts", (req, res, next) => {
  Shift.find()
    .sort({ start_date: 1 })
    .populate("user_id")
    .then(data => {
      res.locals.shifts = data;

      Worker.find()
        .then(data2 => {
          res.locals.workers = data2;
          res.render("shifts.hbs");
        });
    })
    .catch(err=>next(err))
});

// POST to CREATE new shift document in DB
router.post("/shift/add", (req, res, next) => {
  const { start_date, user_id } = req.body;
  if(!req.body.start_date || !req.body.user_id){
    res.redirect('/shifts')
    return;
  }
  Shift.create({ start_date, user_id })
    .then(() => {
      res.redirect("/shifts");
    })
    .catch(err=>next(err))
});

// POST to UPDATE existing shift document in DB
router.post("/shift/:shiftId", (req, res, next) => {
  const {user_id} = req.body;
  const {shiftId} = req.params

  Shift.findByIdAndUpdate(
    shiftId,
    { user_id },
    { runValidators: true }
  )
    .then(() => {
      res.redirect("/shifts");
    })
    .catch(err=>next(err))
});

// route to delete shift
router.get("/shift/delete/:shiftId", (req, res, next) => {
  const {shiftId} = req.params
  Shift.findByIdAndRemove(shiftId)
    .then(() => {
      res.redirect('/shifts');
    })
    .catch(err=>next(err))
});

module.exports = router;
