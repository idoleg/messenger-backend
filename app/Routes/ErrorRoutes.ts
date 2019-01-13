import {Express} from "express";
import httpError from "http-errors";

export default function(express: Express) {

    this.use("",(req:any,res:any,next:any)=> {
        throw new httpError.NotFound("Wrong path");
    });

}
