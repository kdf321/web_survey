var express = require('express'),
    Survey = require('../models/Survey'),
    Comment = require('../models/comment');
var router = express.Router();

/* GET surveys listing. */
router.get('/', function(req, res, next) {
  Survey.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('surveys/index', {surveys: docs});
  });
});


router.get('/new', function(req, res, next) {
  res.render('surveys/new');
});


router.get('/signin', function(req, res, next) {
  res.render('surveys/signin');
});

router.post('/', function(req, res, next) {
  var survey = new Survey({
    title: req.body.title,
    email: req.body.email,
    content: req.body.content
  });

  survey.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/surveys');
  });
});

router.delete('/:id', function(req, res, next) { // 지워줌
  Survey.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/surveys');
  });
});

router.get('/:id/edit', function(req, res, next) { // 수정을 클릭했을때
  Survey.findById(req.params.id, function(err, survey) { // id를 찾고
    if (err) {
      return next(err);
    }
    res.render('surveys/edit', {survey: survey}); //그 id를 가진 survey를 넘김
  });
});

router.get('/:id/cedit', function(req, res, next) { // 수정을 클릭했을때
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    Comment.find({survey: survey.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
      res.render('surveys/cedit', {survey: survey, comments: comments});
    });
  });
});

router.get('/:id', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    Comment.find({survey: survey.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
      res.render('surveys/show', {survey: survey, comments: comments});
    });
  });
});

router.put('/:id', function(req, res, next) { // 수정 후 저장을 클릭했을때
  Survey.findById({_id: req.params.id}, function(err, survey) {
    if (err) {
      return next(err);
    }
    /*수정 후 저장*/
    survey.title = req.body.title;
    survey.email = req.body.email;
    survey.content = req.body.content;

    survey.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys');
    });
  });
});

router.post('/:id/comments', function(req, res, next) {
  var comment = new Comment({
    survey: req.params.id,
    email: req.body.email,
    content: req.body.content
  });

  comment.save(function(err) {
    if (err) {
      return next(err);
    }
    Survey.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + req.params.id);
    });
  });
});

router.post('/:id/cedita', function(req, res, next) {
  Survey.findById({_id: req.params.id}, function(err, comment) {
    if (err) {
      return next(err);
    }

      res.redirect('/surveys/' + req.params.id);

  });
});

module.exports = router;
