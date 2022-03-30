const express = require('express');
const sessionChecker = require('../middlewares/sessionchecker');

const router = express.Router();

router.get(
    '/',
    sessionChecker.authCheck(['Administrator', 'Member Level 1', 'Member Level 2']),
    async (req, res, next) => {
        res.render('member', {
            username: req.session.user.username
        });
    }
);

router.get(
    '/for-member-level-1',
    sessionChecker.authCheck(['Administrator', 'Member Level 1']),
    async (req, res, next) => {
        res.render('member-level-1-only', {
            username: req.session.user.username
        });
    }
);

router.get(
    '/for-member-level-2',
    sessionChecker.authCheck(['Administrator', 'Member Level 2']),
    async (req, res, next) => {
        res.render('member-level-2-only', {
            username: req.session.user.username
        });
    }
);

module.exports = router;