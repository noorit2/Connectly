export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("here");
        return next(); // User is authenticated, proceed to the next middleware or route handler
    }
    // User is not authenticated, redirect or respond with an error
    res.status(401).json({ error: 'Unauthorized' });
}

