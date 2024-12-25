import express from "express";
import CandidateProfileController from "../controllers/candidateProfileController.js";
import upload from "../middlewares/upload-middleware.js";

const router = express.Router()


// Route Level Middleware - For Parsing multipart/ Form-Data
router.use('/resume',upload.fields([{ name : 'pimage', maxCount: 1},{ name : 'rdoc', maxCount: 1} ]) )

// Public Router
router.post('/resume', CandidateProfileController.saveProfile)

router.get('/resume', CandidateProfileController.profileList)

router.delete('/resume/:id', CandidateProfileController.deleteProfile)
export default router
