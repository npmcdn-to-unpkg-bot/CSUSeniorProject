

module.exports = function(app, passport) {
  /* GET home page. */
  app.get('/', isLoggedIn, function(req, res, next) {
    res.render('profile', {
      user : req.user, // get the user out of session and pass to template
      bodytagclass: 'page-md',
      pagetitle: 'Profile'
    });
  });
  
  // show question session
  app.get('/session/:id/:token/:qs_id', isLoggedIn, function(req, res, next) {
    res.render('session', {
      user : req.user, // get the user out of session and pass to template
      session_id: req.params.id,
      token_val: req.params.token,
      question_set_id: req.params.qs_id,
      bodytagclass: 'page-md',
      pagetitle: 'Question Set Session'
    });
  });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', { bodytagclass: 'login', message: req.flash('loginMessage') });
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    //app.get('/profile', isLoggedIn, function(req, res) {
    //    res.render('profile', {
    //        user : req.user // get the user out of session and pass to template
    //    });
    //});

    /*********************************
    ==================================
    ============== LOGOUT ============
    ==================================
    *********************************/
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the login page
    res.redirect('/login');
}
