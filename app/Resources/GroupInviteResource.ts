import BaseResource from "../../src/HttpServer/BaseResource";

export default class GroupInviteResource extends BaseResource {

    public uncover() {
        let active = false;
        if (this.invitingCode) active = true;
        return {
            active,
            invitation_code: this.invitingCode,
        };
    }

}
