import express from "express";
import { userController } from "@controllers/user";
import { authenticateUser } from "@middleware/authenticate-user";
import { authorizeRole } from "@middleware/authorize-role";
import { asyncHandler } from "@middleware/async-handler";
import { upload } from "@middleware/multer";
const router = express.Router();

// GET /users - Get all users
router.get("/", authenticateUser, authorizeRole("admin"), userController.getAllUsers);

// GET /users/profile - Get authenticated user's profile
router.get(
    "/profile",
    authenticateUser,
    authorizeRole("admin", "committee"),
    asyncHandler(userController.getProfile)
);


//invite user
router.post("/invite", authenticateUser, authorizeRole("admin"), asyncHandler(userController.inviteUser));

//update profile
router.patch("/profile", authenticateUser, authorizeRole("admin", "committee"), upload.single("profileUrl") ,asyncHandler(userController.updateProfile));


// GET /users/role/:role - Get users by role (admin or committee)
router.get("/role/:role", authenticateUser, authorizeRole("admin"), userController.getUsersByRole);

// GET /users/:id - Get user by ID
router.get("/:id", authenticateUser, authorizeRole("admin"), userController.getUserById);

// PATCH /users/:id - Update user details (including isActive status)
router.patch("/:id", authenticateUser, authorizeRole("admin"), userController.updateUser);

// DELETE /users/:id - Soft delete user (set isActive to false)
router.delete("/:id", authenticateUser, authorizeRole("admin"), userController.deleteUser);

export default router;