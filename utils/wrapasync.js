// Async Error Handler Wrapper
// This utility function wraps async route handlers to catch errors automatically
// Instead of writing try-catch in every async route, we use this wrapper
// If any promise rejects, the error is passed to the next middleware (Express error handler)

module.exports=(fn)=>{
    return (req,res,next)=>{
        // Execute the async function and catch any errors
        fn(req,res,next).catch(next);
    };
};
