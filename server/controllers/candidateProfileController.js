import CandidateProfileModel from "../models/CandidateProfile.js";
import fs from "fs"

class CandidateProfileController {
    static saveProfile =  async (req, res) => {
       try {
        const { name, email, dob, state, gender, city} = req.body
        const pimage = req.files['pimage'][0].filename
        const rdoc = req.files['rdoc'][0].filename

        if(name && email && pimage && rdoc) {

            const doc = new CandidateProfileModel({
                name: name,
                email: email,
                dob: dob,
                state: state,
                city: city,
                gender: gender,
                pimage: pimage,
                rdoc: rdoc
            })
            const candidate = await doc.save()
            res.status(201).send({ success : "Profile added successfully", data: candidate})
        } else {
            res.status(400).send({ errors : {"message" : "All Fields are required"}})
        }
       } catch (error) {
         console.log(error)
       }
    }

    static profileList =  async (req, res) => {
        try {
            const candidates = await CandidateProfileModel.find()

            res.status(200).send({ data: candidates})
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProfile =  async (req, res) => {
        // try {
        //     const id = req.params.id;
        //     const candidates = await CandidateProfileModel.findByIdAndDelete({_id : id})

        //     const filePath = '/public/uploads/pimage/' + candidates.pimage;
        //     fs.unlink(filePath, (err)=> {
        //         if (err) {
        //             console.error('Error removing file:', err);
        //           } else {
        //             console.log('File removed successfully');
        //           }
        //     })
        //     if(!candidates) {
        //         res.status(404).send({ "info": 'Record not found'});
        //     } else {
        //         res.status(200).send({ success : "Profile deleted successfully"})
        //     }
        // } catch (error) {
        //     console.log(error)
        // }

        try {
            const record = await CandidateProfileModel.findById(req.params.id);
            if (!record) {
              return res.status(404).send({ error: 'Record not found' });
            }
        
            // Delete file from storage

            const imageFilePath = `public/uploads/pimage/${record.pimage}`;
            const documentFilePath = `public/uploads/rdoc/${record.rdoc}`
            fs.unlink(imageFilePath, async (err) => {
              if (err) {
                console.error('Error removing file:', err);
                return res.status(500).send({ error: 'Server Error' });
              } else {
                fs.unlink(documentFilePath, async (err) => {
                    if (err) {
                      console.error('Error removing file:', err);
                      return res.status(500).send({ error: 'Server Error' });
                    } else {
                        // Remove record from database
                        await CandidateProfileModel.findByIdAndDelete(req.params.id);
                        res.status(200).send({success : "Profile deleted successfully" ,message: 'File and associated record deleted successfully' }); 
                    }  
                  });
              }
            });
          } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Server Error' });
          }
    }
}

export default CandidateProfileController;