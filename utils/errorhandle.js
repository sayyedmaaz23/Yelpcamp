class Errorhandle extends Error{
    constructor(message, statuscode, stack){
        super();
        this.message=message;
        this.statuscode=statuscode;
        this.stack=stack
    }
}

module.exports= Errorhandle;