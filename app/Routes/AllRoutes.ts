import {Express} from "express";
import CheckAuth from "../Middleware/CheckAuth";

export default function(express: Express) {

    express.use("", CheckAuth.isAuth);

}
