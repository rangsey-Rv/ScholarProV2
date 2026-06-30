import getProfile from "@controllers/user/get-profile.controller";
import { getAllUsers, getUsersByRole, getUserById } from "@controllers/user/get-user.controller";
import { updateUser } from "@controllers/user/update-user.controller";
import { deleteUser } from "@controllers/user/delete-user.controller";
import inviteUser from "@controllers/user/invite-user.controller"
import updateProfile from "@controllers/user/update.profile.controller";
export const userController = {
    getProfile,
    getAllUsers,
    getUsersByRole,
    getUserById,
    updateUser,
    deleteUser,
    inviteUser,
    updateProfile
};