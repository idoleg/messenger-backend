import {Express} from "express";
import CheckAuth from "../Middleware/CheckAuth";

export default function(express: Express) {

    this.use("",CheckAuth.isAuth);

}
