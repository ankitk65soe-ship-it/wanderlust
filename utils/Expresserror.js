// Custom Error Class for Express Applications
// This class extends the native Error class to include HTTP status codes
// Used throughout the application to throw errors with specific status codes

class Expresserror extends Error{
    // Constructor accepts HTTP status code and error message
    constructor(status,message){
        super();
        this.status=status;      // HTTP status code (e.g., 404, 500)
        this.message=message;    // Error message to display to user
    }
}

module.exports=Expresserror;